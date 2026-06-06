// Server-only Firestore access for blog posts (uses the Admin SDK).
// Imported exclusively from getStaticProps/getStaticPaths and API routes, so
// it is never bundled for the browser.

import { getAdminDb, isAdminConfigured } from "./firebase/admin";
import { POSTS_COLLECTION } from "./blog";

const toIso = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : null;
};

// Converts a Firestore document into a plain, JSON-serializable post object
// suitable for Next.js props.
export function serializePost(id, data = {}) {
  return {
    id,
    title: data.title || "",
    slug: data.slug || "",
    excerpt: data.excerpt || "",
    content: data.content || "",
    coverImage: data.coverImage
      ? {
          url: data.coverImage.url || "",
          alt: data.coverImage.alt || "",
          width: data.coverImage.width || null,
          height: data.coverImage.height || null
        }
      : null,
    status: data.status || "draft",
    featured: Boolean(data.featured),
    author: data.author
      ? {
          name: data.author.name || "Imagicity",
          email: data.author.email || "",
          picture: data.author.picture || "",
          bio: data.author.bio || ""
        }
      : { name: "Imagicity", email: "", picture: "", bio: "" },
    category: data.category || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    seo: {
      title: data.seo?.title || "",
      description: data.seo?.description || "",
      focusKeyword: data.seo?.focusKeyword || "",
      canonicalUrl: data.seo?.canonicalUrl || "",
      ogImage: data.seo?.ogImage || "",
      noindex: Boolean(data.seo?.noindex)
    },
    wordCount: data.wordCount || 0,
    readingTimeMinutes: data.readingTimeMinutes || 1,
    publishedAt: toIso(data.publishedAt),
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt)
  };
}

export async function getPublishedPosts({ max } = {}) {
  if (!isAdminConfigured) return [];
  try {
    // Query by status only (single-field index, always available) and sort in
    // memory so no composite index is required for the listing to work.
    const snapshot = await getAdminDb()
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
    console.error("getPublishedPosts failed:", error.message);
    return [];
  }
}

export async function getPublishedSlugs() {
  if (!isAdminConfigured) return [];
  try {
    const snapshot = await getAdminDb()
      .collection(POSTS_COLLECTION)
      .where("status", "==", "published")
      .get();
    return snapshot.docs.map((doc) => doc.data().slug).filter(Boolean);
  } catch (error) {
    console.error("getPublishedSlugs failed:", error.message);
    return [];
  }
}

export async function getPostBySlug(slug) {
  if (!isAdminConfigured || !slug) return null;
  try {
    const snapshot = await getAdminDb()
      .collection(POSTS_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return serializePost(doc.id, doc.data());
  } catch (error) {
    console.error("getPostBySlug failed:", error.message);
    return null;
  }
}

export async function getRelatedPosts(post, max = 3) {
  if (!isAdminConfigured || !post) return [];
  const all = await getPublishedPosts({ max: 24 });
  const scored = all
    .filter((item) => item.slug !== post.slug)
    .map((item) => {
      let score = 0;
      if (item.category && item.category === post.category) score += 2;
      const shared = (item.tags || []).filter((tag) => (post.tags || []).includes(tag));
      score += shared.length;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || (b.item.publishedAt || "").localeCompare(a.item.publishedAt || ""));
  return scored.slice(0, max).map((entry) => entry.item);
}

// ----- Admin (drafts + published) -----

export async function getAllPostsForAdmin() {
  if (!isAdminConfigured) return [];
  const snapshot = await getAdminDb()
    .collection(POSTS_COLLECTION)
    .orderBy("updatedAt", "desc")
    .get();
  return snapshot.docs.map((doc) => serializePost(doc.id, doc.data()));
}

export async function getPostById(id) {
  if (!isAdminConfigured || !id) return null;
  const doc = await getAdminDb().collection(POSTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return serializePost(doc.id, doc.data());
}

export async function slugExists(slug, excludeId) {
  if (!isAdminConfigured) return false;
  const snapshot = await getAdminDb()
    .collection(POSTS_COLLECTION)
    .where("slug", "==", slug)
    .get();
  return snapshot.docs.some((doc) => doc.id !== excludeId);
}

// Ensures a slug is unique by appending -2, -3, … when needed.
export async function uniqueSlug(baseSlug, excludeId) {
  let candidate = baseSlug || "post";
  let suffix = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await slugExists(candidate, excludeId)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}
