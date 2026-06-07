import { useEffect, useState } from "react";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { getStorageInstance } from "../../lib/firebase/client";
import { slugify, DEFAULT_CATEGORIES } from "../../lib/blog";
import { SITE_URL } from "../../lib/site";
import { useAdminAuth } from "./AdminAuthGate";
import { ThemeToggle } from "./ThemeProvider";
import RichTextEditor from "./RichTextEditor";
import SeoPanel from "./SeoPanel";

const host = SITE_URL.replace(/^https?:\/\//, "");

const emptySeo = {
  title: "",
  description: "",
  focusKeyword: "",
  canonicalUrl: "",
  ogImage: "",
  noindex: false
};

function getImageDimensions(url) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve({ width: null, height: null });
      return;
    }
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: null, height: null });
    img.src = url;
  });
}

export default function PostEditorModal({ post, onClose, onSaved, config }) {
  const cfg = config || {};
  const apiBase = cfg.apiBase || "/api/admin/posts";
  const categoriesApi = cfg.categoriesApi || "/api/admin/categories";
  const storageFolder = cfg.storageFolder || "blog";
  const publicBase = cfg.publicBase || "/blog";

  const { user, getToken } = useAdminAuth();

  const [currentId, setCurrentId] = useState(post?.id || null);
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post?.slug));
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [category, setCategory] = useState(post?.category || "");
  const [tags, setTags] = useState(post?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [featured, setFeatured] = useState(Boolean(post?.featured));
  const [status, setStatus] = useState(post?.status || "draft");
  const [coverImage, setCoverImage] = useState(
    post?.coverImage || { url: "", alt: "", width: null, height: null }
  );
  const [seo, setSeo] = useState({ ...emptySeo, ...(post?.seo || {}) });
  const [authorBio, setAuthorBio] = useState(post?.author?.bio || "");

  const [coverUploading, setCoverUploading] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [activeTab, setActiveTab] = useState("seo");
  const [categoryOptions, setCategoryOptions] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!slugEdited && !currentId) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited, currentId]);

  // Load custom categories so the author's own categories are suggested too.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(categoriesApi, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (alive && res.ok && Array.isArray(data.categories)) {
          const merged = [...new Set([...DEFAULT_CATEGORIES, ...data.categories])].sort((a, b) =>
            a.localeCompare(b)
          );
          setCategoryOptions(merged);
        }
      } catch (error) {
        /* fall back to defaults */
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSeo = (field, value) => setSeo((prev) => ({ ...prev, [field]: value }));

  const addTags = (incoming) => {
    setTags((prev) => {
      const next = new Set(prev);
      incoming
        .map((tag) => tag.trim())
        .filter(Boolean)
        .forEach((tag) => next.add(tag));
      return Array.from(next).slice(0, 20);
    });
  };

  const commitTagInput = () => {
    if (tagInput.trim()) {
      addTags([tagInput]);
      setTagInput("");
    }
  };

  // Splitting on commas lets authors type or paste "a, b, c" and have each
  // become its own tag automatically.
  const handleTagChange = (event) => {
    const value = event.target.value;
    if (value.includes(",")) {
      const parts = value.split(",");
      addTags(parts.slice(0, -1));
      setTagInput(parts[parts.length - 1].replace(/^\s+/, ""));
    } else {
      setTagInput(value);
    }
  };

  const handleTagKey = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitTagInput();
    } else if (event.key === "Backspace" && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleCover = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Cover image must be an image file.");
      return;
    }
    setCoverUploading(true);
    setCoverProgress(0);
    setError("");
    try {
      const storage = getStorageInstance();
      const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const reference = storageRef(
        storage,
        `${storageFolder}/${user?.uid || "admin"}/cover-${Date.now()}-${safe}`
      );
      const task = uploadBytesResumable(reference, file, { contentType: file.type });
      await new Promise((resolve, reject) => {
        task.on(
          "state_changed",
          (snapshot) =>
            setCoverProgress(
              Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            ),
          reject,
          resolve
        );
      });
      const url = await getDownloadURL(reference);
      const dims = await getImageDimensions(url);
      setCoverImage((prev) => ({ ...prev, url, width: dims.width, height: dims.height }));
    } catch (err) {
      setError(`Cover upload failed: ${err.message || err}`);
    } finally {
      setCoverUploading(false);
      setCoverProgress(0);
    }
  };

  const handleSave = async (targetStatus) => {
    if (!title.trim()) {
      setError("Please add a title before saving.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      content,
      excerpt: excerpt.trim(),
      category: category.trim(),
      tags,
      featured,
      status: targetStatus,
      coverImage: coverImage.url ? coverImage : null,
      seo,
      authorBio: authorBio.trim()
    };
    try {
      const token = await getToken();
      const url = currentId ? `${apiBase}/${currentId}` : apiBase;
      const method = currentId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not save the post.");
        return;
      }
      setCurrentId(data.post.id);
      setStatus(data.post.status);
      setSlug(data.post.slug);
      setSavedAt(Date.now());
      onSaved(data.post);
    } catch (err) {
      setError(err.message || "Could not save the post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentId) {
      onClose();
      return;
    }
    if (!window.confirm("Delete this post permanently? This cannot be undone.")) return;
    setSaving(true);
    try {
      const token = await getToken();
      const response = await fetch(`${apiBase}/${currentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Could not delete the post.");
        return;
      }
      onSaved(null, currentId);
      onClose();
    } catch (err) {
      setError(err.message || "Could not delete the post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-modal" role="dialog" aria-modal="true" aria-label="Post editor">
      <div className="editor-modal-bar">
        <div className="editor-modal-bar-left">
          <button type="button" className="editor-close" onClick={onClose}>
            ← Close
          </button>
          <span className={`status-pill ${status}`}>{status}</span>
          {saving ? (
            <span className="editor-saving">Saving…</span>
          ) : savedAt ? (
            <span className="editor-saved">All changes saved</span>
          ) : null}
          <ThemeToggle />
        </div>
        <div className="editor-modal-bar-right">
          {status === "published" && slug ? (
            <a
              href={`${publicBase}/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="editor-view"
            >
              View ↗
            </a>
          ) : null}
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            Save draft
          </button>
          <button
            type="button"
            className="btn btn-glow"
            onClick={() => handleSave("published")}
            disabled={saving}
          >
            {status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {error ? <div className="editor-modal-error">{error}</div> : null}

      <div className="editor-modal-body">
        <div className="editor-main">
          <div className="editor-main-head">
            <input
              className="editor-title-input"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="editor-permalink">
              <span>{host}{publicBase}/</span>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugEdited(true);
                }}
                placeholder="post-url"
              />
            </div>
          </div>

          <RichTextEditor
            value={content}
            onChange={setContent}
            uid={user?.uid}
            folder={storageFolder}
          />
        </div>

        <aside className="editor-sidebar">
          <div className="editor-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "seo"}
              className={activeTab === "seo" ? "active" : ""}
              onClick={() => setActiveTab("seo")}
            >
              SEO
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "settings"}
              className={activeTab === "settings" ? "active" : ""}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          <div className="editor-tab-body">
            {activeTab === "seo" ? (
              <SeoPanel
                title={title}
                slug={slug}
                content={content}
                excerpt={excerpt}
                coverImageUrl={coverImage.url}
                seo={seo}
                onSeoChange={updateSeo}
                onChangeTitle={setTitle}
                onAddTags={addTags}
                getToken={getToken}
              />
            ) : (
              <>
                <div className="editor-box">
                  <h4>Publish</h4>
                  <label className="editor-inline-toggle">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <span>Feature this post</span>
                  </label>
                  {status === "published" ? (
                    <button
                      type="button"
                      className="editor-text-btn"
                      onClick={() => handleSave("draft")}
                      disabled={saving}
                    >
                      Switch back to draft
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="editor-danger-btn"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    Delete post
                  </button>
                </div>

                <div className="editor-box">
                  <h4>Excerpt</h4>
                  <textarea
                    className="editor-bio"
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short summary for listings and social cards (auto-generated if blank)."
                  />
                </div>

                <div className="editor-box">
                  <h4>Cover image</h4>
                  {coverImage.url ? (
                    <div className="editor-cover-preview">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverImage.url} alt={coverImage.alt || "Cover"} />
                      <button
                        type="button"
                        onClick={() =>
                          setCoverImage({ url: "", alt: "", width: null, height: null })
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                  <label className="editor-upload-btn">
                    {coverUploading
                      ? `Uploading… ${coverProgress}%`
                      : coverImage.url
                      ? "Replace image"
                      : "Upload image"}
                    <input type="file" accept="image/*" onChange={handleCover} hidden />
                  </label>
                  {coverImage.url ? (
                    <label className="editor-field">
                      <span>Alt text</span>
                      <input
                        type="text"
                        value={coverImage.alt}
                        onChange={(e) =>
                          setCoverImage((prev) => ({ ...prev, alt: e.target.value }))
                        }
                        placeholder="Describe the image"
                      />
                    </label>
                  ) : null}
                </div>

                <div className="editor-box">
                  <h4>Organization</h4>
                  <label className="editor-field">
                    <span>Category</span>
                    <input
                      list="category-options"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Choose or type a category"
                    />
                    <datalist id="category-options">
                      {categoryOptions.map((option) => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </label>
                  <label className="editor-field">
                    <span>Tags</span>
                    <input
                      value={tagInput}
                      onChange={handleTagChange}
                      onKeyDown={handleTagKey}
                      onBlur={commitTagInput}
                      placeholder="Type tags, separated by commas"
                    />
                  </label>
                  {tags.length ? (
                    <div className="editor-tags">
                      {tags.map((tag) => (
                        <span key={tag} className="editor-tag">
                          {tag}
                          <button
                            type="button"
                            onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                            aria-label={`Remove ${tag}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="editor-box">
                  <h4>Author bio (optional)</h4>
                  <textarea
                    className="editor-bio"
                    rows={3}
                    value={authorBio}
                    onChange={(e) => setAuthorBio(e.target.value)}
                    placeholder="A short bio shown at the end of the article."
                  />
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
