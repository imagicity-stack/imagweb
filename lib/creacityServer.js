// Server-only data layer for Creacity ("Tips & Tricks"). Mirrors the blog data
// layer but points at a separate Firestore database (getCreacityDb). Reuses the
// blog's pure serializers/normalizers so the two stay structurally identical.

import { FieldValue } from "firebase-admin/firestore";
import { getCreacityDb, isCreacityConfigured } from "./firebase/admin";
import {
  POSTS_COLLECTION,
  COMMENTS_COLLECTION,
  POST_STATS_COLLECTION,
  CATEGORIES_COLLECTION
} from "./blog";
import { serializePost } from "./blogServer";
import { serializeComment } from "./commentsServer";
import { serializeStats } from "./statsServer";

const db = () => getCreacityDb();

// Default starter categories for the learning school.
export const CREACITY_CATEGORIES = [
  "Marketing Tips",
  "Branding",
  "Design",
  "Social Media",
  "Content & SEO",
  "Growth Hacks",
  "Business",
  "Tools & Templates",
  "Case Studies"
];

/* -------------------------------- Posts -------------------------------- */

export async function getPublishedPosts({ max } = {}) {
  if (!isCreacityConfigured) return [];
  try {
    const snapshot = await db()
      .collection(POSTS_COLLECTION)
      .where("status", "==", "published")
      .get();
    let posts = snapshot.docs.map((doc) => serializePost(doc.id, doc.data()));
    posts.sort((a, b) =>
      (b.publishedAt || b.createdAt || "").localeCompare(a.publishedAt || a.createdAt || "")
    );
    if (max) posts = posts.slice(0, max);
    return posts;
  } catch (error) {
    console.error("creacity getPublishedPosts:", error.message);
    return [];
  }
}

export async function getPublishedSlugs() {
  if (!isCreacityConfigured) return [];
  try {
    const snapshot = await db()
      .collection(POSTS_COLLECTION)
      .where("status", "==", "published")
      .get();
    return snapshot.docs.map((doc) => doc.data().slug).filter(Boolean);
  } catch (error) {
    console.error("creacity getPublishedSlugs:", error.message);
    return [];
  }
}

export async function getPostBySlug(slug) {
  if (!isCreacityConfigured || !slug) return null;
  try {
    const snapshot = await db()
      .collection(POSTS_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return serializePost(doc.id, doc.data());
  } catch (error) {
    console.error("creacity getPostBySlug:", error.message);
    return null;
  }
}

export async function getRelatedPosts(post, max = 3) {
  if (!isCreacityConfigured || !post) return [];
  const all = await getPublishedPosts({ max: 24 });
  return all
    .filter((item) => item.slug !== post.slug)
    .map((item) => {
      let score = 0;
      if (item.category && item.category === post.category) score += 2;
      const shared = (item.tags || []).filter((tag) => (post.tags || []).includes(tag));
      score += shared.length;
      return { item, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.item.publishedAt || "").localeCompare(a.item.publishedAt || "")
    )
    .slice(0, max)
    .map((entry) => entry.item);
}

export async function getAllPostsForAdmin() {
  if (!isCreacityConfigured) return [];
  const snapshot = await db().collection(POSTS_COLLECTION).orderBy("updatedAt", "desc").get();
  return snapshot.docs.map((doc) => serializePost(doc.id, doc.data()));
}

export async function getPostById(id) {
  if (!isCreacityConfigured || !id) return null;
  const doc = await db().collection(POSTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return serializePost(doc.id, doc.data());
}

async function slugExists(slug, excludeId) {
  const snapshot = await db().collection(POSTS_COLLECTION).where("slug", "==", slug).get();
  return snapshot.docs.some((doc) => doc.id !== excludeId);
}

export async function uniqueSlug(baseSlug, excludeId) {
  let candidate = baseSlug || "tip";
  let suffix = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await slugExists(candidate, excludeId)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function createPostFromPayload(data, user) {
  if (!isCreacityConfigured) {
    const error = new Error("Creacity is not configured. Set CREACITY_DATABASE_ID.");
    error.statusCode = 503;
    throw error;
  }
  const slug = await uniqueSlug(data.requestedSlug);
  const now = FieldValue.serverTimestamp();
  const doc = {
    title: data.title,
    slug,
    excerpt: data.excerpt,
    content: data.content,
    contentText: data.contentText,
    coverImage: data.coverImage,
    status: data.status,
    featured: data.featured,
    category: data.category,
    tags: data.tags,
    seo: data.seo,
    wordCount: data.wordCount,
    readingTimeMinutes: data.readingTimeMinutes,
    author: {
      uid: user.uid,
      name: user.name,
      email: user.email,
      picture: user.picture,
      bio: data.authorBio
    },
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === "published" ? now : null
  };
  const ref = await db().collection(POSTS_COLLECTION).add(doc);
  if (data.category) await ensureCategories([data.category]);
  const saved = await ref.get();
  return serializePost(saved.id, saved.data());
}

export async function updatePostFromPayload(id, data, user) {
  if (!isCreacityConfigured) {
    const error = new Error("Creacity is not configured.");
    error.statusCode = 503;
    throw error;
  }
  const ref = db().collection(POSTS_COLLECTION).doc(id);
  const snapshot = await ref.get();
  if (!snapshot.exists) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }
  const existing = snapshot.data();

  let slug = existing.slug;
  if (data.requestedSlug && data.requestedSlug !== existing.slug) {
    slug = await uniqueSlug(data.requestedSlug, id);
  }
  let publishedAt = existing.publishedAt || null;
  if (data.status === "published" && !existing.publishedAt) {
    publishedAt = FieldValue.serverTimestamp();
  }

  await ref.update({
    title: data.title,
    slug,
    excerpt: data.excerpt,
    content: data.content,
    contentText: data.contentText,
    coverImage: data.coverImage,
    status: data.status,
    featured: data.featured,
    category: data.category,
    tags: data.tags,
    seo: data.seo,
    wordCount: data.wordCount,
    readingTimeMinutes: data.readingTimeMinutes,
    author: {
      ...(existing.author || {}),
      bio: data.authorBio || existing.author?.bio || "",
      lastEditedBy: user.email
    },
    updatedAt: FieldValue.serverTimestamp(),
    publishedAt
  });
  if (data.category) await ensureCategories([data.category]);
  const saved = await ref.get();
  return { post: serializePost(saved.id, saved.data()), slugs: [slug, existing.slug] };
}

export async function deletePost(id) {
  if (!isCreacityConfigured || !id) return { slug: null };
  const ref = db().collection(POSTS_COLLECTION).doc(id);
  const snapshot = await ref.get();
  const slug = snapshot.exists ? snapshot.data().slug : null;
  await ref.delete();
  return { slug };
}

/* ------------------------------ Categories ----------------------------- */

const toCategoryId = (name) =>
  String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export async function getCategories() {
  if (!isCreacityConfigured) return [];
  try {
    const snapshot = await db().collection(CATEGORIES_COLLECTION).get();
    const stored = snapshot.docs.map((doc) => doc.data().name).filter(Boolean);
    return [...new Set([...CREACITY_CATEGORIES, ...stored])].sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("creacity getCategories:", error.message);
    return [...CREACITY_CATEGORIES];
  }
}

export async function ensureCategories(names = []) {
  if (!isCreacityConfigured) return;
  const clean = [...new Set(names.map((n) => String(n || "").trim()).filter(Boolean))];
  await Promise.all(
    clean.map(async (name) => {
      const id = toCategoryId(name);
      if (!id) return;
      try {
        await db()
          .collection(CATEGORIES_COLLECTION)
          .doc(id)
          .set({ name, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      } catch (error) {
        /* non-critical */
      }
    })
  );
}

/* ------------------------------- Comments ------------------------------ */

export async function getPublishedComments(postId) {
  if (!isCreacityConfigured || !postId) return [];
  try {
    const snapshot = await db()
      .collection(COMMENTS_COLLECTION)
      .where("postId", "==", String(postId))
      .get();
    return snapshot.docs
      .map((doc) => serializeComment(doc.id, doc.data()))
      .filter((comment) => comment.status === "published")
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  } catch (error) {
    console.error("creacity getPublishedComments:", error.message);
    return [];
  }
}

export async function getAllComments({ max = 300 } = {}) {
  if (!isCreacityConfigured) return [];
  const snapshot = await db()
    .collection(COMMENTS_COLLECTION)
    .orderBy("createdAt", "desc")
    .limit(max)
    .get();
  return snapshot.docs.map((doc) => serializeComment(doc.id, doc.data()));
}

export async function createComment({ postId, name, body, geo }) {
  if (!isCreacityConfigured) {
    const error = new Error("Comments are unavailable right now.");
    error.statusCode = 503;
    throw error;
  }
  const postDoc = await db().collection(POSTS_COLLECTION).doc(String(postId)).get();
  if (!postDoc.exists || postDoc.data().status !== "published") {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }
  const post = postDoc.data();
  const ref = await db()
    .collection(COMMENTS_COLLECTION)
    .add({
      postId: String(postId),
      postSlug: post.slug || "",
      postTitle: post.title || "",
      name,
      body,
      status: "published",
      country: (geo?.country || "").slice(0, 2),
      createdAt: FieldValue.serverTimestamp()
    });
  const saved = await ref.get();
  return serializeComment(saved.id, saved.data());
}

export async function deleteComment(id) {
  if (!isCreacityConfigured || !id) return;
  await db().collection(COMMENTS_COLLECTION).doc(String(id)).delete();
}

/* -------------------------------- Stats -------------------------------- */

const cleanKey = (value) =>
  String(value || "")
    .replace(/[.~*/[\]`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

export async function recordView({ postId, slug, geo }) {
  if (!isCreacityConfigured || !postId) return;
  const country = cleanKey(geo?.country) || "Unknown";
  const cityKey = cleanKey([geo?.city, geo?.region, geo?.country].filter(Boolean).join(", "));
  const payload = {
    slug: String(slug || "").slice(0, 200),
    total: FieldValue.increment(1),
    byCountry: { [country]: FieldValue.increment(1) },
    updatedAt: FieldValue.serverTimestamp()
  };
  if (cityKey) payload.byCity = { [cityKey]: FieldValue.increment(1) };
  await db().collection(POST_STATS_COLLECTION).doc(String(postId)).set(payload, { merge: true });
}

export async function getStatsMap() {
  if (!isCreacityConfigured) return {};
  try {
    const snapshot = await db().collection(POST_STATS_COLLECTION).get();
    const map = {};
    snapshot.docs.forEach((doc) => {
      map[doc.id] = serializeStats(doc.data());
    });
    return map;
  } catch (error) {
    console.error("creacity getStatsMap:", error.message);
    return {};
  }
}

/* ------------------------------ Revalidate ----------------------------- */

export async function revalidateCreacity(res, slugs = []) {
  const paths = ["/creacity", ...slugs.filter(Boolean).map((s) => `/creacity/${s}`)];
  await Promise.all(
    [...new Set(paths)].map(async (path) => {
      try {
        await res.revalidate(path);
      } catch (error) {
        console.error(`creacity revalidate ${path}:`, error.message);
      }
    })
  );
}
