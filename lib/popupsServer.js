// Server-only popup CRUD (Admin SDK). Popups are marketing modals shown on the
// public site; they're authored in /admin and stored in the `popups` collection.

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminConfigured } from "./firebase/admin";
import { POPUPS_COLLECTION } from "./popups";

const toIso = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : null;
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// Only allow safe CTA destinations (no javascript: etc.).
const safeUrl = (value) => {
  const v = String(value || "").trim().slice(0, 600);
  if (!v) return "";
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(v) ? v : "";
};

export function serializePopup(id, data = {}) {
  return {
    id,
    name: data.name || "",
    heading: data.heading || "",
    body: data.body || "",
    image: data.image
      ? { url: data.image.url || "", alt: data.image.alt || "" }
      : { url: "", alt: "" },
    ctaLabel: data.ctaLabel || "",
    ctaUrl: data.ctaUrl || "",
    theme: data.theme || "light",
    size: data.size || "md",
    layout: data.layout || "top",
    align: data.align || "left",
    ctaAlign: data.ctaAlign || "left",
    ctaStyle: data.ctaStyle || "solid",
    pages: Array.isArray(data.pages) && data.pages.length ? data.pages : ["all"],
    trigger: {
      type: data.trigger?.type || "delay",
      delaySeconds: Number(data.trigger?.delaySeconds) || 5
    },
    frequency: data.frequency || "session",
    startAt: toIso(data.startAt),
    endAt: toIso(data.endAt),
    active: Boolean(data.active),
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt)
  };
}

export function normalizePopup(body = {}) {
  const clip = (value, max) => String(value || "").trim().slice(0, max);

  const triggerType = ["delay", "exit", "immediate"].includes(body.trigger?.type)
    ? body.trigger.type
    : "delay";
  let delaySeconds = Number(body.trigger?.delaySeconds);
  if (!Number.isFinite(delaySeconds) || delaySeconds < 0) delaySeconds = 5;
  delaySeconds = Math.min(120, Math.round(delaySeconds));

  const pages = Array.isArray(body.pages)
    ? [...new Set(body.pages.filter(Boolean))].slice(0, 10)
    : [];

  const oneOf = (value, list, fallback) => (list.includes(value) ? value : fallback);

  return {
    name: clip(body.name, 120) || "Untitled popup",
    heading: clip(body.heading, 160),
    body: clip(body.body, 1200),
    image:
      body.image && body.image.url
        ? { url: clip(body.image.url, 600), alt: clip(body.image.alt, 200) }
        : null,
    ctaLabel: clip(body.ctaLabel, 60),
    ctaUrl: safeUrl(body.ctaUrl),
    theme: oneOf(body.theme, ["light", "dark", "accent"], "light"),
    size: oneOf(body.size, ["sm", "md", "lg"], "md"),
    layout: oneOf(body.layout, ["top", "side", "background"], "top"),
    align: oneOf(body.align, ["left", "center", "right"], "left"),
    ctaAlign: oneOf(body.ctaAlign, ["left", "center", "right", "full"], "left"),
    ctaStyle: oneOf(body.ctaStyle, ["solid", "outline"], "solid"),
    pages: pages.length ? pages : ["all"],
    trigger: { type: triggerType, delaySeconds },
    frequency: ["session", "daily", "always"].includes(body.frequency)
      ? body.frequency
      : "session",
    startAt: parseDate(body.startAt),
    endAt: parseDate(body.endAt),
    active: Boolean(body.active)
  };
}

export async function getAllPopups() {
  if (!isAdminConfigured) return [];
  const snapshot = await getAdminDb()
    .collection(POPUPS_COLLECTION)
    .orderBy("updatedAt", "desc")
    .get();
  return snapshot.docs.map((doc) => serializePopup(doc.id, doc.data()));
}

// Active popups whose schedule window (if any) currently includes "now".
export async function getActivePopups() {
  if (!isAdminConfigured) return [];
  try {
    const snapshot = await getAdminDb()
      .collection(POPUPS_COLLECTION)
      .where("active", "==", true)
      .get();
    const now = Date.now();
    return snapshot.docs
      .map((doc) => serializePopup(doc.id, doc.data()))
      .filter((popup) => {
        if (popup.startAt && new Date(popup.startAt).getTime() > now) return false;
        if (popup.endAt && new Date(popup.endAt).getTime() < now) return false;
        return true;
      })
      .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  } catch (error) {
    console.error("getActivePopups failed:", error.message);
    return [];
  }
}

export async function getPopupById(id) {
  if (!isAdminConfigured || !id) return null;
  const doc = await getAdminDb().collection(POPUPS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return serializePopup(doc.id, doc.data());
}

export async function createPopup(data) {
  if (!isAdminConfigured) {
    const error = new Error("Firebase is not configured.");
    error.statusCode = 503;
    throw error;
  }
  const now = FieldValue.serverTimestamp();
  const ref = await getAdminDb()
    .collection(POPUPS_COLLECTION)
    .add({ ...data, createdAt: now, updatedAt: now });
  const saved = await ref.get();
  return serializePopup(saved.id, saved.data());
}

export async function updatePopup(id, data) {
  if (!isAdminConfigured || !id) {
    const error = new Error("Popup not found.");
    error.statusCode = 404;
    throw error;
  }
  const ref = getAdminDb().collection(POPUPS_COLLECTION).doc(id);
  await ref.update({ ...data, updatedAt: FieldValue.serverTimestamp() });
  const saved = await ref.get();
  return serializePopup(saved.id, saved.data());
}

export async function deletePopup(id) {
  if (!isAdminConfigured || !id) return;
  await getAdminDb().collection(POPUPS_COLLECTION).doc(id).delete();
}
