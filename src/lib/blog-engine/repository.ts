import {
  addDoc,
  collection,
  DocumentData,
  DocumentSnapshot,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where
} from "firebase/firestore";
import slugify from "slugify";
import { db } from "../firebase";
import { estimateReadingTime } from "./readingTime";
import { buildSitemapXml, writeSitemap } from "./sitemap";
import { generateTocFromHtml } from "./toc";
import { sanitizeTags, validatePostInput } from "./validation";
import type { FirestorePostData, Post, PostInput } from "./models";

const postsCollection = () => (db ? collection(db, "blogs") : null);

const toDate = (value: Timestamp | Date | string | undefined): Date => {
  if (!value) return new Date();
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const firestoreDocToPost = (snapshot: DocumentSnapshot<DocumentData>): Post => {
  const data = snapshot.data() as FirestorePostData;
  return {
    id: snapshot.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt,
    category: data.category,
    tags: data.tags || [],
    status: data.status,
    authorId: data.authorId,
    authorName: data.authorName,
    featuredImageUrl: data.featuredImageUrl,
    featuredImageAlt: data.featuredImageAlt,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    publishDate: toDate(data.publishDate),
    seoTitle: data.seoTitle,
    metaDescription: data.metaDescription,
    canonicalUrl: data.canonicalUrl,
    ogTitle: data.ogTitle,
    ogDescription: data.ogDescription,
    ogImageUrl: data.ogImageUrl,
    robotsIndex: data.robotsIndex,
    robotsFollow: data.robotsFollow,
    schemaType: data.schemaType,
    readingTime: data.readingTime,
    tocEnabled: data.tocEnabled,
    redirects: data.redirects || [],
    toc: data.toc,
    isPublished: data.isPublished ?? data.status === "Published"
  } satisfies Post;
};

export const postToFirestoreData = (post: Post): FirestorePostData => {
  const createdAtValue =
    post.createdAt instanceof Date ? post.createdAt : typeof post.createdAt === "string" ? new Date(post.createdAt) : new Date();
  const updatedAtValue =
    post.updatedAt instanceof Date ? post.updatedAt : typeof post.updatedAt === "string" ? new Date(post.updatedAt) : new Date();
  const publishDateValue =
    post.publishDate instanceof Date
      ? post.publishDate
      : typeof post.publishDate === "string"
        ? new Date(post.publishDate)
        : new Date();

  const createdAt = Timestamp.fromDate(createdAtValue);
  const updatedAt = Timestamp.fromDate(updatedAtValue);
  const publishDate = Timestamp.fromDate(publishDateValue);

  return {
    title: post.title,
    slug: slugify(post.slug || post.title, { lower: true, strict: true }),
    content: post.content,
    excerpt: post.excerpt,
    category: post.category,
    tags: sanitizeTags(post.tags || []),
    status: post.status,
    authorId: post.authorId,
    authorName: post.authorName,
    featuredImageUrl: post.featuredImageUrl,
    featuredImageAlt: post.featuredImageAlt,
    createdAt: createdAt as Timestamp,
    updatedAt: updatedAt as Timestamp,
    publishDate: publishDate as Timestamp,
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    canonicalUrl: post.canonicalUrl,
    ogTitle: post.ogTitle,
    ogDescription: post.ogDescription,
    ogImageUrl: post.ogImageUrl,
    robotsIndex: post.robotsIndex,
    robotsFollow: post.robotsFollow,
    schemaType: post.schemaType,
    readingTime: post.readingTime,
    tocEnabled: post.tocEnabled,
    redirects: post.redirects || [],
    isPublished: post.status === "Published",
    toc: post.toc
  } satisfies FirestorePostData;
};

const buildPostFromInput = (input: PostInput, current?: Post): Post => {
  const normalizedSlug = slugify(input.slug || input.title || current?.slug || "post", { lower: true, strict: true });
  const content = input.content ?? current?.content ?? "";
  const readingTime = estimateReadingTime(content);
  const toc = (input.tocEnabled ?? current?.tocEnabled ?? false) ? generateTocFromHtml(content) : undefined;
  const publishDate = input.publishDate ? toDate(input.publishDate as Date | string) : current?.publishDate || new Date();

  return {
    id: input.id || current?.id || "",
    title: input.title || current?.title || "",
    slug: normalizedSlug,
    content,
    excerpt: input.excerpt ?? current?.excerpt ?? "",
    category: input.category ?? current?.category ?? "",
    tags: sanitizeTags(input.tags ?? current?.tags ?? []),
    status: input.status ?? current?.status ?? "Draft",
    authorId: input.authorId ?? current?.authorId,
    authorName: input.authorName ?? current?.authorName,
    featuredImageUrl: input.featuredImageUrl ?? current?.featuredImageUrl ?? "",
    featuredImageAlt: input.featuredImageAlt ?? current?.featuredImageAlt ?? "",
    createdAt: current?.createdAt ?? new Date(),
    updatedAt: new Date(),
    publishDate,
    seoTitle: input.seoTitle ?? current?.seoTitle ?? input.title ?? "",
    metaDescription: input.metaDescription ?? current?.metaDescription ?? input.excerpt ?? "",
    canonicalUrl: input.canonicalUrl ?? current?.canonicalUrl,
    ogTitle: input.ogTitle ?? current?.ogTitle ?? input.title ?? "",
    ogDescription: input.ogDescription ?? current?.ogDescription ?? input.excerpt ?? "",
    ogImageUrl: input.ogImageUrl ?? current?.ogImageUrl,
    robotsIndex: input.robotsIndex ?? current?.robotsIndex ?? "index",
    robotsFollow: input.robotsFollow ?? current?.robotsFollow ?? "follow",
    schemaType: input.schemaType ?? current?.schemaType ?? "BlogPosting",
    readingTime,
    tocEnabled: input.tocEnabled ?? current?.tocEnabled ?? false,
    redirects: input.redirects ?? current?.redirects ?? [],
    toc,
    isPublished: (input.status ?? current?.status ?? "Draft") === "Published"
  } satisfies Post;
};

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const ref = postsCollection();
    if (!ref) return [];
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(firestoreDocToPost);
  } catch (error) {
    console.error("Failed to fetch all posts", error);
    return [];
  }
};

export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const ref = postsCollection();
    if (!ref) return null;
    const snap = await getDoc(doc(ref, id));
    if (!snap.exists()) return null;
    return firestoreDocToPost(snap);
  } catch (error) {
    console.error(`Failed to fetch post by id ${id}`, error);
    return null;
  }
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const ref = postsCollection();
    if (!ref) return null;
    const q = query(ref, where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return firestoreDocToPost(snap.docs[0]);
  } catch (error) {
    console.error(`Failed to fetch post by slug ${slug}`, error);
    return null;
  }
};

export const getPublishedPosts = async (): Promise<Post[]> => {
  try {
    const ref = postsCollection();
    if (!ref) return [];
    const q = query(ref, where("isPublished", "==", true), orderBy("publishDate", "desc"));
    const snapshot = await getDocs(q);
    const now = new Date();
    return snapshot.docs
      .map(firestoreDocToPost)
      .filter((post) => post.status === "Published" && post.publishDate <= now);
  } catch (error) {
    console.error("Failed to fetch published posts", error);
    return [];
  }
};

export const createPost = async (input: PostInput): Promise<Post> => {
  const ref = postsCollection();
  if (!ref) throw new Error("Firestore is not configured");

  const validation = validatePostInput(input);
  if (!validation.valid) {
    throw new Error(`Post validation failed: ${JSON.stringify(validation.errors)}`);
  }

  const basePost = buildPostFromInput(validation.sanitized || input);
  const post: Post = {
    ...basePost,
    createdAt: new Date(),
    updatedAt: new Date(),
    redirects: basePost.redirects || []
  };

  const data = postToFirestoreData({ ...post, createdAt: post.createdAt, updatedAt: post.updatedAt });
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await refreshSitemap();
  const saved = await getDoc(docRef);
  return firestoreDocToPost(saved);
};

export const updatePost = async (id: string, input: PostInput): Promise<Post> => {
  const ref = postsCollection();
  if (!ref) throw new Error("Firestore is not configured");

  const current = await getPostById(id);
  if (!current) throw new Error("Post not found");

  const validation = validatePostInput({ ...current, ...input });
  if (!validation.valid) {
    throw new Error(`Post validation failed: ${JSON.stringify(validation.errors)}`);
  }

  const nextPost = buildPostFromInput({ ...validation.sanitized, id }, current);
  const redirects = [...(current.redirects || [])];
  if (current.slug !== nextPost.slug) {
    redirects.push(current.slug);
  }

  const post: Post = {
    ...nextPost,
    redirects,
    createdAt: current.createdAt,
    updatedAt: new Date(),
    isPublished: nextPost.status === "Published"
  };

  const data = postToFirestoreData(post);
  await updateDoc(doc(ref, id), { ...data, updatedAt: serverTimestamp() });

  await refreshSitemap();
  const saved = await getPostById(id);
  if (!saved) throw new Error("Failed to load saved post");
  return saved;
};

export const deletePost = async (id: string) => {
  const ref = postsCollection();
  if (!ref) throw new Error("Firestore is not configured");
  await deleteDoc(doc(ref, id));
};

export const listRelatedPosts = async (postIdOrSlug: string): Promise<Post[]> => {
  const ref = postsCollection();
  if (!ref) return [];
  const target = (await getPostById(postIdOrSlug)) ?? (await getPostBySlug(postIdOrSlug));
  if (!target) return [];

  try {
    const q = query(
      ref,
      where("category", "==", target.category),
      where("isPublished", "==", true),
      orderBy("publishDate", "desc"),
      limit(5)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(firestoreDocToPost)
      .filter((post) => post.slug !== target.slug && post.status === "Published");
  } catch (error) {
    console.error("Failed to list related posts", error);
    return [];
  }
};

const refreshSitemap = async () => {
  const posts = await getPublishedPosts();
  const xml = buildSitemapXml(posts);
  await writeSitemap(xml);
};
