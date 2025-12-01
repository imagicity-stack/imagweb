import {
  addDoc,
  collection,
  DocumentData,
  DocumentSnapshot,
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
import { db } from "../firebase";
import { BlogPostCore, BlogPostDocument, BlogPostInput, RedirectRule, VersionRecord } from "./models";
import { estimateReadingTime } from "./readingTime";
import { buildSitemapXml, writeSitemap } from "./sitemap";
import { generateTocFromHtml } from "./toc";
import { sanitizeTags, validatePostInput } from "./validation";
import slugify from "slugify";

const postsCollection = () => (db ? collection(db, "blogPosts") : null);
const redirectCollection = () => (db ? collection(db, "redirects") : null);

const serialize = (docSnap: DocumentSnapshot<DocumentData>): BlogPostDocument => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: (data.createdAt?.toDate?.() ?? new Date()).toISOString(),
    updatedAt: (data.updatedAt?.toDate?.() ?? new Date()).toISOString(),
    publishedAt: data.publishedAt || new Date().toISOString()
  } as BlogPostDocument;
};

const saveVersion = async (postId: string, version: number, payload: BlogPostCore) => {
  const ref = postsCollection();
  if (!ref) return null;
  const versionCollection = collection(doc(ref, postId), "versions");
  const versionDoc: VersionRecord = {
    postId,
    version,
    payload,
    createdAt: new Date().toISOString()
  };
  await addDoc(versionCollection, versionDoc);
  return versionDoc;
};

const recordRedirect = async (from: string, to: string) => {
  const ref = redirectCollection();
  if (!ref) return null;
  const rule: RedirectRule = {
    from,
    to,
    createdAt: new Date().toISOString()
  };
  await addDoc(ref, rule);
  return rule;
};

const mapInputToPayload = (input: BlogPostInput, previous?: BlogPostDocument): BlogPostCore => {
  const featuredImage = input.featuredImage || previous?.featuredImage;
  if (!featuredImage) {
    throw new Error("Featured image is required.");
  }

  const slug = slugify((input.overrideSlug || input.slug || input.title || previous?.title || "post"), {
    lower: true,
    strict: true
  });

  const readingTimeMinutes = estimateReadingTime(input.contentHtml || previous?.contentHtml || "");
  const toc = (input.tableOfContentsEnabled ?? previous?.tableOfContentsEnabled) ? generateTocFromHtml(input.contentHtml || previous?.contentHtml || "") : [];

  return {
    title: input.title || previous?.title || "Untitled",
    slug,
    excerpt: input.excerpt || previous?.excerpt || "",
    contentHtml: input.contentHtml || previous?.contentHtml || "",
    featuredImage,
    category: input.category || previous?.category || "General",
    tags: sanitizeTags(input.tags || previous?.tags || []),
    status: input.status || previous?.status || "draft",
    authorId: input.authorId || previous?.authorId || "unknown",
    publishedAt: input.publishedAt || previous?.publishedAt || new Date().toISOString(),
    schemaType: input.schemaType || previous?.schemaType || "BlogPosting",
    tableOfContentsEnabled: Boolean(input.tableOfContentsEnabled ?? previous?.tableOfContentsEnabled ?? true),
    readingTimeMinutes,
    seo: input.seo ||
      previous?.seo || {
        seoTitle: input.title || previous?.title || "",
        metaDescription: input.excerpt || previous?.excerpt || "",
        canonicalUrl: input.canonicalUrl || previous?.canonicalUrl,
        robots: {
          index: "index",
          follow: "follow"
        },
        openGraph: {
          title: input.title || previous?.title || "",
          description: input.excerpt || previous?.excerpt || "",
          image: input.seo?.openGraph?.image || previous?.seo?.openGraph?.image || featuredImage
        }
      },
    canonicalUrl: input.canonicalUrl || previous?.canonicalUrl,
    internalLinks: input.internalLinks || previous?.internalLinks || [],
    redirectFrom: previous?.redirectFrom || [],
    toc
  };
};

export const fetchPosts = async (): Promise<BlogPostDocument[]> => {
  const ref = postsCollection();
  if (!ref) return [];
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(serialize);
};

export const fetchPostById = async (id: string): Promise<BlogPostDocument | null> => {
  const ref = postsCollection();
  if (!ref) return null;
  const snap = await getDoc(doc(ref, id));
  if (!snap.exists()) return null;
  return serialize(snap);
};

export const fetchSuggestions = async (): Promise<BlogPostDocument[]> => {
  const ref = postsCollection();
  if (!ref) return [];
  const q = query(ref, where("status", "==", "published"), orderBy("createdAt", "desc"), limit(10));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(serialize);
};

const refreshSitemap = async () => {
  const posts = await fetchPosts();
  const xml = buildSitemapXml(posts);
  await writeSitemap(xml);
};

export const createPost = async (input: BlogPostInput) => {
  const ref = postsCollection();
  if (!ref) throw new Error("Firestore is not configured");

  const validation = validatePostInput(input);
  if (!validation.valid) {
    throw new Error(`Post validation failed: ${JSON.stringify(validation.errors)}`);
  }

  const sanitizedInput = (validation.sanitized as BlogPostInput) || input;
  const payload = mapInputToPayload(sanitizedInput);
  const docRef = await addDoc(ref, {
    ...payload,
    toc: payload.toc,
    version: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await saveVersion(docRef.id, 1, payload);
  await refreshSitemap();
  const saved = await getDoc(docRef);
  return serialize(saved);
};

export const updatePost = async (id: string, input: BlogPostInput) => {
  const ref = postsCollection();
  if (!ref) throw new Error("Firestore is not configured");

  const current = await fetchPostById(id);
  if (!current) throw new Error("Post not found");

  const validation = validatePostInput({ ...current, ...input });
  if (!validation.valid) {
    throw new Error(`Post validation failed: ${JSON.stringify(validation.errors)}`);
  }

  const sanitizedInput = (validation.sanitized as BlogPostInput) || input;
  const payload = mapInputToPayload(sanitizedInput, current);
  const version = current.version + 1;

  await saveVersion(id, version, {
    ...current,
    toc: payload.toc,
    redirectFrom: payload.redirectFrom
  });

  if (current.slug !== payload.slug) {
    payload.redirectFrom = Array.from(new Set([...(current.redirectFrom || []), current.slug]));
    await recordRedirect(current.slug, payload.slug);
  }

  await updateDoc(doc(ref, id), {
    ...payload,
    toc: payload.toc,
    version,
    updatedAt: serverTimestamp()
  });

  await refreshSitemap();
  const saved = await fetchPostById(id);
  return saved;
};

export const rollbackVersion = async (postId: string, versionId: string) => {
  const ref = postsCollection();
  if (!ref) throw new Error("Firestore is not configured");
  const versionSnap = await getDoc(doc(collection(doc(ref, postId), "versions"), versionId));
  if (!versionSnap.exists()) throw new Error("Version not found");
  const version = versionSnap.data() as VersionRecord;

  await updateDoc(doc(ref, postId), {
    ...version.payload,
    version: version.version,
    updatedAt: serverTimestamp()
  });

  await refreshSitemap();
  return fetchPostById(postId);
};
