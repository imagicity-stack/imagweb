import { FieldValue, type Query } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { BlogPost, BlogRevision } from "@/types/blog";
import { createSlug, ensureLazyImages, generateTableOfContents, getReadingTime, getWordCount, sanitizeContentHtml, validateSeoFields } from "@/lib/cms/utils";

const BLOG_COLLECTION = "blogs";
const REDIRECTS_COLLECTION = "redirects";

const withTimestamps = (data: Record<string, unknown>) => ({
  ...data,
  updatedAt: FieldValue.serverTimestamp(),
  createdAt: data.createdAt || FieldValue.serverTimestamp()
});

const buildSearchIndex = (data: BlogPost) =>
  [
    data.title,
    data.slug,
    data.category,
    data.tags.join(" "),
    data.seo.focusKeyword,
    data.seo.secondaryKeywords.join(" ")
  ]
    .join(" ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

const normalizeBlog = (payload: Partial<BlogPost>): BlogPost => {
  const safeContent = ensureLazyImages(sanitizeContentHtml(payload.contentHtml || ""));
  const wordCount = getWordCount(safeContent);
  const readingTime = getReadingTime(wordCount);
  const tableOfContents = generateTableOfContents(safeContent);

  const seo = payload.seo || {
    seoTitle: payload.title || "",
    metaDescription: payload.excerpt || "",
    focusKeyword: "",
    secondaryKeywords: [],
    canonicalUrl: "",
    openGraphTitle: payload.title || "",
    openGraphDescription: payload.excerpt || "",
    openGraphImage: payload.featuredImage || "",
    twitterTitle: payload.title || "",
    twitterDescription: payload.excerpt || "",
    twitterImage: payload.featuredImage || ""
  };

  if ((payload.status || "draft") === "published") {
    validateSeoFields({ ...seo, secondaryKeywords: seo.secondaryKeywords || [] });
  }

  return {
    title: payload.title || "",
    slug: payload.slug || createSlug(payload.title || ""),
    featuredImage: payload.featuredImage || "",
    featuredImageAlt: payload.featuredImageAlt || "",
    category: payload.category || "General",
    tags: payload.tags || [],
    excerpt: payload.excerpt || "",
    authorId: payload.authorId || "",
    status: payload.status || "draft",
    publishDate: payload.publishDate,
    contentHtml: safeContent,
    tableOfContents,
    readingTime,
    wordCount,
    seo: {
      ...seo,
      openGraphImage: seo.openGraphImage || payload.featuredImage || "",
      twitterImage: seo.twitterImage || payload.featuredImage || ""
    },
    schemaType: payload.schemaType || "BlogPosting",
    internalLinks: payload.internalLinks || [],
    openGraphImage: payload.seo?.openGraphImage || payload.featuredImage,
    twitterImage: payload.seo?.twitterImage || payload.featuredImage,
    cta: payload.cta || { ctaEnabled: false, ctaLink: "", ctaText: "", newsletterEmbed: "" },
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
    featuredImageUrl: payload.featuredImage,
    intro: payload.excerpt
  } as BlogPost;
};

export const fetchBlogById = async (id: string): Promise<BlogPost | null> => {
  if (!adminDb) return null;
  const snap = await adminDb.collection(BLOG_COLLECTION).doc(id).get();
  if (!snap.exists()) return null;
  const data = snap.data() as BlogPost;
  return {
    ...data,
    id: snap.id
  };
};

export const fetchBlogs = async (filters?: { status?: string; category?: string; authorId?: string }) => {
  if (!adminDb) return [];
  let q: Query = adminDb.collection(BLOG_COLLECTION);
  if (filters?.status) q = q.where("status", "==", filters.status);
  if (filters?.category) q = q.where("category", "==", filters.category);
  if (filters?.authorId) q = q.where("authorId", "==", filters.authorId);
  q = q.orderBy("createdAt", "desc");
  const snap = await q.get();
  return snap.docs.map((docSnap) => ({ ...(docSnap.data() as BlogPost), id: docSnap.id }));
};

const saveRevision = async (id: string, data: BlogPost) => {
  if (!adminDb) return;
  const revision: BlogRevision = {
    title: data.title,
    contentHtml: data.contentHtml,
    seo: data.seo,
    updatedAt: new Date().toISOString()
  };
  await adminDb.collection(BLOG_COLLECTION).doc(id).collection("revisions").add(revision);
};

const createRedirect = async (blogId: string, oldSlug: string, newSlug: string) => {
  if (!adminDb || oldSlug === newSlug) return;
  await adminDb.collection(REDIRECTS_COLLECTION).add({
    oldSlug,
    newSlug,
    blogId,
    timestamp: FieldValue.serverTimestamp()
  });
};

export const createBlog = async (payload: Partial<BlogPost>) => {
  if (!adminDb) throw new Error("Firebase Admin is not configured");
  const normalized = normalizeBlog(payload);
  const ref = await adminDb.collection(BLOG_COLLECTION).add(withTimestamps({ ...normalized, searchIndex: buildSearchIndex(normalized) }));
  return fetchBlogById(ref.id);
};

export const updateBlog = async (id: string, payload: Partial<BlogPost>) => {
  if (!adminDb) throw new Error("Firebase Admin is not configured");
  const existing = await fetchBlogById(id);
  if (!existing) throw new Error("Blog not found");

  await saveRevision(id, existing);

  const normalized = normalizeBlog({ ...existing, ...payload });

  await adminDb.collection(BLOG_COLLECTION).doc(id).update(withTimestamps({ ...normalized, searchIndex: buildSearchIndex(normalized) }));
  await createRedirect(id, existing.slug, normalized.slug);
  return fetchBlogById(id);
};

export const deleteBlog = async (id: string) => {
  if (!adminDb) throw new Error("Firebase Admin is not configured");
  await adminDb.collection(BLOG_COLLECTION).doc(id).delete();
};

export const duplicateBlog = async (id: string) => {
  const existing = await fetchBlogById(id);
  if (!existing) throw new Error("Blog not found");
  const duplicated = {
    ...existing,
    status: "draft" as const,
    slug: `${existing.slug}-copy`,
    title: `${existing.title} (Copy)`,
    publishDate: undefined
  };
  return createBlog(duplicated);
};

export const fetchInternalSuggestions = async (queryText?: string) => {
  if (!adminDb) return [];
  const terms = (queryText || "").toLowerCase().split(/\s+/).filter(Boolean);
  let q: Query = adminDb.collection(BLOG_COLLECTION).orderBy("createdAt", "desc").limit(8);
  if (terms.length) {
    q = adminDb.collection(BLOG_COLLECTION).where("searchIndex", "array-contains-any", terms).limit(8);
  }
  const snap = await q.get();
  return snap.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as BlogPost) }));
};
