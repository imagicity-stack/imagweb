import slugify from "slugify";
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
import { db, storage } from "./firebase";
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  featuredImageUrl: string;
  category: string;
  tags: string[];
  intro: string;
  content: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
  isPublished: boolean;
}

export type BlogPostInput = Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "slug"> & {
  slug?: string;
};

const postsRef = collection(db, "posts");

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

const normalizeTags = (tags: string[] | string): string[] => {
  if (Array.isArray(tags)) return tags.map((t) => t.trim()).filter(Boolean);
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

export const createSlug = (title: string) =>
  slugify(title, {
    lower: true,
    strict: true
  });

export const serializePost = (docSnap: DocumentSnapshot<DocumentData>): BlogPost => {
  const data = docSnap.data() || {};
  return {
    id: docSnap.id,
    title: data.title || "",
    slug: data.slug || createSlug(data.title || docSnap.id),
    metaTitle: data.metaTitle || data.title || "",
    metaDescription: data.metaDescription || data.intro || "",
    featuredImageUrl: data.featuredImageUrl || "",
    category: data.category || "General",
    tags: normalizeTags(data.tags || []),
    intro: data.intro || "",
    content: data.content || "",
    author: data.author || "",
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
    isPublished: Boolean(data.isPublished)
  };
};

export const fetchPublishedPosts = async (): Promise<BlogPost[]> => {
  const q = query(postsRef, where("isPublished", "==", true), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(serializePost);
};

export const fetchAllPosts = async (): Promise<BlogPost[]> => {
  const q = query(postsRef, orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(serializePost);
};

export const fetchPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const q = query(postsRef, where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return serializePost(snapshot.docs[0]);
};

export const fetchPostById = async (id: string): Promise<BlogPost | null> => {
  const snapshot = await getDoc(doc(postsRef, id));
  if (!snapshot.exists()) return null;
  return serializePost(snapshot);
};

export const fetchRelatedPosts = async (category: string, currentSlug: string): Promise<BlogPost[]> => {
  const q = query(
    postsRef,
    where("category", "==", category),
    where("isPublished", "==", true),
    orderBy("createdAt", "desc"),
    limit(3)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(serializePost)
    .filter((post) => post.slug !== currentSlug)
    .slice(0, 3);
};

export const uploadFeaturedImage = async (file: File, slug: string): Promise<string> => {
  const storageRef = ref(storage, `featured/${slug}-${Date.now()}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export const createBlogPost = async (data: BlogPostInput) => {
  const slug = data.slug && data.slug.length > 0 ? data.slug : createSlug(data.title);
  const payload = {
    ...data,
    slug,
    tags: normalizeTags(data.tags || []),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(postsRef, payload);
  return fetchPostById(docRef.id);
};

export const updateBlogPost = async (id: string, data: BlogPostInput) => {
  const slug = data.slug && data.slug.length > 0 ? data.slug : createSlug(data.title);
  const payload = {
    ...data,
    slug,
    tags: normalizeTags(data.tags || []),
    updatedAt: serverTimestamp()
  };
  await updateDoc(doc(postsRef, id), payload);
  return fetchPostById(id);
};

export const deleteBlogPost = async (id: string) => deleteDoc(doc(postsRef, id));
