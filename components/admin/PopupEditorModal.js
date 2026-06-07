import { useEffect, useState } from "react";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { getStorageInstance } from "../../lib/firebase/client";
import {
  POPUP_PAGES,
  POPUP_TRIGGERS,
  POPUP_FREQUENCIES,
  POPUP_THEMES
} from "../../lib/popups";
import { useAdminAuth } from "./AdminAuthGate";

function toLocalInput(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export default function PopupEditorModal({ popup, onClose, onSaved }) {
  const { user, getToken } = useAdminAuth();
  const isEdit = Boolean(popup?.id);
  const nowLocal = toLocalInput(new Date().toISOString());

  const [name, setName] = useState(popup?.name || "");
  const [heading, setHeading] = useState(popup?.heading || "");
  const [body, setBody] = useState(popup?.body || "");
  const [image, setImage] = useState(popup?.image || { url: "", alt: "" });
  const [ctaLabel, setCtaLabel] = useState(popup?.ctaLabel || "");
  const [ctaUrl, setCtaUrl] = useState(popup?.ctaUrl || "");
  const [theme, setTheme] = useState(popup?.theme || "light");
  const [pages, setPages] = useState(popup?.pages?.length ? popup.pages : ["all"]);
  const [triggerType, setTriggerType] = useState(popup?.trigger?.type || "delay");
  const [delaySeconds, setDelaySeconds] = useState(popup?.trigger?.delaySeconds ?? 5);
  const [frequency, setFrequency] = useState(popup?.frequency || "session");
  const [startAt, setStartAt] = useState(toLocalInput(popup?.startAt));
  const [endAt, setEndAt] = useState(toLocalInput(popup?.endAt));
  const [active, setActive] = useState(popup?.active ?? true);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const togglePage = (id) => {
    setPages((prev) => {
      if (id === "all") return ["all"];
      const withoutAll = prev.filter((p) => p !== "all");
      const next = withoutAll.includes(id)
        ? withoutAll.filter((p) => p !== id)
        : [...withoutAll, id];
      return next.length ? next : ["all"];
    });
  };

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setUploading(true);
    setProgress(0);
    setError("");
    try {
      const storage = getStorageInstance();
      const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const reference = storageRef(
        storage,
        `popups/${user?.uid || "admin"}/${Date.now()}-${safe}`
      );
      const task = uploadBytesResumable(reference, file, { contentType: file.type });
      await new Promise((resolve, reject) => {
        task.on(
          "state_changed",
          (snapshot) =>
            setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
          reject,
          resolve
        );
      });
      const url = await getDownloadURL(reference);
      setImage((prev) => ({ ...prev, url }));
    } catch (err) {
      setError(`Image upload failed: ${err.message || err}`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const buildPayload = () => ({
    name: name.trim(),
    heading: heading.trim(),
    body: body.trim(),
    image: image.url ? image : null,
    ctaLabel: ctaLabel.trim(),
    ctaUrl: ctaUrl.trim(),
    theme,
    pages,
    trigger: { type: triggerType, delaySeconds: Number(delaySeconds) || 0 },
    frequency,
    startAt: startAt || null,
    endAt: endAt || null,
    active
  });

  const handleSave = async () => {
    if (!heading.trim() && !body.trim() && !image.url) {
      setError("Add a heading, some text, or an image before saving.");
      return;
    }
    const now = Date.now();
    if (startAt && new Date(startAt).getTime() < now - 60000) {
      setError("The start date & time can’t be in the past.");
      return;
    }
    if (endAt) {
      const endMs = new Date(endAt).getTime();
      if (endMs < now) {
        setError("The end date & time can’t be in the past.");
        return;
      }
      if (startAt && endMs <= new Date(startAt).getTime()) {
        setError("The end time must be after the start time.");
        return;
      }
    }
    setSaving(true);
    setError("");
    try {
      const token = await getToken();
      const url = isEdit ? `/api/admin/popups/${popup.id}` : "/api/admin/popups";
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(buildPayload())
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not save the popup.");
        return;
      }
      onSaved(data.popup);
      onClose();
    } catch (err) {
      setError(err.message || "Could not save the popup.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit) {
      onClose();
      return;
    }
    if (!window.confirm("Delete this popup permanently?")) return;
    setSaving(true);
    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/popups/${popup.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Could not delete the popup.");
        return;
      }
      onSaved(null, popup.id);
      onClose();
    } catch (err) {
      setError(err.message || "Could not delete the popup.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pop-modal-overlay" role="dialog" aria-modal="true" aria-label="Popup builder">
      <div className="pop-modal">
        <div className="pop-modal-bar">
          <div className="pop-modal-bar-left">
            <button type="button" className="editor-close" onClick={onClose}>
              ← Close
            </button>
            <strong>{isEdit ? "Edit popup" : "New popup"}</strong>
            <label className="pop-active-toggle">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <span>{active ? "Active" : "Inactive"}</span>
            </label>
          </div>
          <div className="pop-modal-bar-right">
            {isEdit ? (
              <button
                type="button"
                className="editor-danger-btn"
                onClick={handleDelete}
                disabled={saving}
              >
                Delete
              </button>
            ) : null}
            <button type="button" className="btn btn-glow" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create popup"}
            </button>
          </div>
        </div>

        {error ? <div className="editor-modal-error">{error}</div> : null}

        <div className="pop-modal-body">
          <div className="pop-form">
            <div className="editor-box">
              <h4>Content</h4>
              <label className="editor-field">
                <span>Internal name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Free consultation offer"
                  maxLength={120}
                />
              </label>
              <label className="editor-field">
                <span>Heading</span>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Your first consultation is on us"
                  maxLength={160}
                />
              </label>
              <label className="editor-field">
                <span>Body</span>
                <textarea
                  className="editor-bio"
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="A short, convincing message…"
                  maxLength={1200}
                />
              </label>
            </div>

            <div className="editor-box">
              <h4>Image</h4>
              {image.url ? (
                <div className="editor-cover-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt={image.alt || "Popup"} />
                  <button type="button" onClick={() => setImage({ url: "", alt: "" })}>
                    Remove
                  </button>
                </div>
              ) : null}
              <label className="editor-upload-btn">
                {uploading
                  ? `Uploading… ${progress}%`
                  : image.url
                  ? "Replace image"
                  : "Upload image"}
                <input type="file" accept="image/*" onChange={handleImage} hidden />
              </label>
              {image.url ? (
                <label className="editor-field">
                  <span>Alt text</span>
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(e) => setImage((prev) => ({ ...prev, alt: e.target.value }))}
                    placeholder="Describe the image"
                  />
                </label>
              ) : null}
            </div>

            <div className="editor-box">
              <h4>Call to action</h4>
              <label className="editor-field">
                <span>Button label</span>
                <input
                  type="text"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  placeholder="Claim your free session"
                  maxLength={60}
                />
              </label>
              <label className="editor-field">
                <span>Button link</span>
                <input
                  type="text"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="/contact"
                />
              </label>
            </div>

            <div className="editor-box">
              <h4>Style</h4>
              <div className="pop-chip-row">
                {POPUP_THEMES.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`pop-chip ${theme === option.id ? "active" : ""}`}
                    onClick={() => setTheme(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="editor-box">
              <h4>Show on</h4>
              <div className="pop-check-grid">
                {POPUP_PAGES.map((page) => (
                  <label key={page.id} className="pop-check">
                    <input
                      type="checkbox"
                      checked={pages.includes(page.id)}
                      onChange={() => togglePage(page.id)}
                    />
                    <span>{page.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="editor-box">
              <h4>Behaviour</h4>
              <label className="editor-field">
                <span>Trigger</span>
                <select value={triggerType} onChange={(e) => setTriggerType(e.target.value)}>
                  {POPUP_TRIGGERS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              {triggerType === "delay" ? (
                <label className="editor-field">
                  <span>Delay (seconds)</span>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={delaySeconds}
                    onChange={(e) => setDelaySeconds(e.target.value)}
                  />
                </label>
              ) : null}
              <label className="editor-field">
                <span>Show frequency</span>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                  {POPUP_FREQUENCIES.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="editor-box">
              <h4>Schedule</h4>
              <p className="pop-help">Optional — leave blank to start now and never expire.</p>
              <div className="pop-schedule-grid">
                <label className="editor-field">
                  <span>Starts</span>
                  <input
                    type="datetime-local"
                    min={nowLocal}
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                  />
                </label>
                <label className="editor-field">
                  <span>Ends</span>
                  <input
                    type="datetime-local"
                    min={startAt || nowLocal}
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                  />
                </label>
              </div>
              {startAt || endAt ? (
                <button
                  type="button"
                  className="pop-clear-btn"
                  onClick={() => {
                    setStartAt("");
                    setEndAt("");
                  }}
                >
                  Clear schedule
                </button>
              ) : null}
            </div>
          </div>

          <div className="pop-preview">
            <span className="pop-preview-label">Live preview</span>
            <div className="pop-preview-stage">
              <div className={`site-popup site-popup-${theme}`}>
                <button type="button" className="site-popup-close" aria-hidden="true" tabIndex={-1}>
                  ×
                </button>
                {image.url ? (
                  <div className="site-popup-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt={image.alt || ""} />
                  </div>
                ) : null}
                <div className="site-popup-content">
                  {heading ? <h3 className="site-popup-heading">{heading}</h3> : null}
                  {body ? <p className="site-popup-text">{body}</p> : null}
                  {ctaLabel ? (
                    <span className="site-popup-cta" role="button" tabIndex={-1}>
                      {ctaLabel}
                    </span>
                  ) : null}
                  {!heading && !body && !image.url ? (
                    <p className="pop-preview-hint">Your popup preview appears here.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
