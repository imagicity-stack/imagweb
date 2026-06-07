// Server-only view + location stats (Admin SDK). Stored in a dedicated
// `postStats` collection (doc id = post id) so view counters never collide with
// post edits or ISR. Location is stored ONLY as aggregate counts (per country
// and per city) — no per-visitor records and no IP addresses.

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminConfigured } from "./firebase/admin";
import { POST_STATS_COLLECTION } from "./blog";

// Map keys must avoid characters Firestore treats specially in field paths.
const cleanKey = (value) =>
  String(value || "")
    .replace(/[.~*/[\]`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

export async function recordView({ postId, slug, geo }) {
  if (!isAdminConfigured || !postId) return;

  const country = cleanKey(geo?.country) || "Unknown";
  const cityKey = cleanKey([geo?.city, geo?.region, geo?.country].filter(Boolean).join(", "));

  const payload = {
    slug: String(slug || "").slice(0, 200),
    total: FieldValue.increment(1),
    byCountry: { [country]: FieldValue.increment(1) },
    updatedAt: FieldValue.serverTimestamp()
  };
  if (cityKey) payload.byCity = { [cityKey]: FieldValue.increment(1) };

  await getAdminDb()
    .collection(POST_STATS_COLLECTION)
    .doc(String(postId))
    .set(payload, { merge: true });
}

export function serializeStats(data = {}) {
  const asMap = (value) =>
    value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    views: Number(data.total) || 0,
    byCountry: asMap(data.byCountry),
    byCity: asMap(data.byCity)
  };
}

// All stats keyed by post id, for the admin dashboard.
export async function getStatsMap() {
  if (!isAdminConfigured) return {};
  try {
    const snapshot = await getAdminDb().collection(POST_STATS_COLLECTION).get();
    const map = {};
    snapshot.docs.forEach((doc) => {
      map[doc.id] = serializeStats(doc.data());
    });
    return map;
  } catch (error) {
    console.error("getStatsMap failed:", error.message);
    return {};
  }
}
