import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { clientDb, clientStorage, isClientFirebaseConfigured } from "@/lib/firebase/client";
import type { BlogPost } from "@/types/blog";
export type { BlogPost } from "@/types/blog";
export type BlogPostInput = Partial<BlogPost> & {
  metaTitle?: string;
  metaDescription?: string;
  featuredImageUrl?: string;
  intro?: string;
  content?: string;
  author?: string;
  isPublished?: boolean;
  slug?: string;
};
import { createSlug, ensureLazyImages, generateTableOfContents, getReadingTime, getWordCount, sanitizeContentHtml } from "@/lib/cms/utils";

const getPostsRef = () => (clientDb ? collection(clientDb, "blogs") : null);

const parseDate = (value: unknown) => {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
};

type SnapshotLike = Pick<Partial<BlogPost>, keyof Partial<BlogPost>> & { id?: string };

const normalizePost = (docSnap: DocumentSnapshot<DocumentData> | SnapshotLike): BlogPost => {
  const data =
    "data" in docSnap && typeof docSnap.data === "function"
      ? ((docSnap.data() as Partial<BlogPost>) || {})
      : (docSnap as Partial<BlogPost>);
  const legacyData = data as {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    secondaryKeywords?: string[];
    canonicalUrl?: string;
    openGraphTitle?: string;
    openGraphDescription?: string;
    openGraphImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
  };
  const rawContent = (data as Partial<BlogPost> & { content?: string }).contentHtml || (data as { content?: string }).content || "";
  const contentHtml = ensureLazyImages(sanitizeContentHtml(rawContent));
  const wordCount = getWordCount(contentHtml);
  return {
    id: docSnap.id,
    title: data.title || "",
    slug: data.slug || createSlug(data.title || docSnap.id || ""),
    featuredImage: data.featuredImage || data.featuredImageUrl || "",
    featuredImageAlt:
      data.featuredImageAlt || (data as { featuredImageAltText?: string }).featuredImageAltText || "",
    category: data.category || "General",
    tags: data.tags || [],
    excerpt: data.excerpt || data.intro || "",
    authorId: data.authorId || (data as { author?: string }).author || "",
    status: data.status || ((data as { isPublished?: boolean }).isPublished ? "published" : "draft"),
    publishDate: parseDate(data.publishDate || data.createdAt),
    contentHtml,
    tableOfContents: data.tableOfContents || generateTableOfContents(contentHtml),
    readingTime: data.readingTime || getReadingTime(wordCount),
    wordCount: data.wordCount || wordCount,
    seo: data.seo || {
      seoTitle: legacyData.metaTitle || data.title || "",
      metaDescription: legacyData.metaDescription || data.excerpt || "",
      focusKeyword: legacyData.focusKeyword || "",
      secondaryKeywords: legacyData.secondaryKeywords || [],
      canonicalUrl: legacyData.canonicalUrl || "",
      openGraphTitle: legacyData.openGraphTitle || data.title || "",
      openGraphDescription: legacyData.openGraphDescription || data.excerpt || "",
      openGraphImage: legacyData.openGraphImage || data.featuredImage || "",
      twitterTitle: legacyData.twitterTitle || data.title || "",
      twitterDescription: legacyData.twitterDescription || data.excerpt || "",
      twitterImage: legacyData.twitterImage || data.featuredImage || ""
    },
    schemaType: data.schemaType || "BlogPosting",
    internalLinks: data.internalLinks || [],
    openGraphImage: data.openGraphImage || data.featuredImage || "",
    twitterImage: data.twitterImage || data.featuredImage || "",
    cta: data.cta || { ctaEnabled: false, ctaLink: "", ctaText: "" },
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
    featuredImageUrl: data.featuredImage || data.featuredImageUrl,
    intro: data.excerpt || data.intro
  };
};

export const fetchPublishedPosts = async (): Promise<BlogPost[]> => {
  try {
    const ref = getPostsRef();
    if (!ref) return [];
    const q = query(ref, where("status", "==", "published"), orderBy("publishDate", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(normalizePost);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
};

export const fetchAllPosts = async (): Promise<BlogPost[]> => {
  try {
    const ref = getPostsRef();
    if (!ref) return [];
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(normalizePost);
  } catch (error) {
    console.error("Failed to fetch all blog posts:", error);
    return [];
  }
};

export const fetchPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const ref = getPostsRef();
    if (!ref) return null;
    const q = query(ref, where("slug", "==", slug), where("status", "==", "published"), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return normalizePost(snapshot.docs[0]);
  } catch (error) {
    console.error(`Failed to fetch blog post for slug: ${slug}:`, error);
    return null;
  }
};

export const fetchPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const ref = getPostsRef();
    if (!ref) return null;
    const snapshot = await getDoc(doc(ref, id));
    if (!snapshot.exists()) return null;
    return normalizePost({ ...snapshot, id });
  } catch (error) {
    console.error(`Failed to fetch blog post by id: ${id}:`, error);
    return null;
  }
};

export const fetchRelatedPosts = async (category: string, currentSlug: string): Promise<BlogPost[]> => {
  try {
    const ref = getPostsRef();
    if (!ref) return [];
    const q = query(ref, where("category", "==", category), where("status", "==", "published"), orderBy("publishDate", "desc"), limit(3));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(normalizePost)
      .filter((post) => post.slug !== currentSlug)
      .slice(0, 3);
  } catch (error) {
    console.error(`Failed to fetch related blog posts for category: ${category}:`, error);
    return [];
  }
};

export async function uploadBlogImage(file: File, slug: string) {
  if (!clientStorage) {
    throw new Error("Firebase Storage is not configured.");
  }

  try {
    const imageRef = ref(clientStorage, `blog-images/${slug}-${Date.now()}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error("Failed to upload blog image", error);
    throw new Error("Unable to upload image. Please try again.");
  }
}

export const createBlogPost = async (data: Partial<BlogPost>) => {
  const ref = getPostsRef();
  if (!ref) {
    throw new Error("Firebase is not configured; cannot create blog posts.");
  }

  const payload = {
    ...data,
    slug: data.slug || createSlug(data.title || ""),
    featuredImage: data.featuredImage || data.featuredImageUrl || "",
    featuredImageUrl: undefined,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(ref, payload);
  return fetchPostById(docRef.id);
};

export const updateBlogPost = async (id: string, data: Partial<BlogPost>) => {
  const ref = getPostsRef();
  if (!ref) {
    throw new Error("Firebase is not configured; cannot update blog posts.");
  }

  const payload = {
    ...data,
    slug: data.slug || (data.title ? createSlug(data.title) : undefined),
    featuredImage: data.featuredImage || data.featuredImageUrl,
    updatedAt: serverTimestamp()
  };
  await updateDoc(doc(ref, id), payload);
  return fetchPostById(id);
};

export const deleteBlogPost = async (id: string) => {
  const ref = getPostsRef();
  if (!ref) {
    throw new Error("Firebase is not configured; cannot delete blog posts.");
  }
  return deleteDoc(doc(ref, id));
};

export const isFirebaseReady = isClientFirebaseConfigured;

// Re-export utility slug generator for admin form imports
export { createSlug };
