import slugify from "slugify";
import { listRelatedPosts, getPostBySlug, getPublishedPosts, getPostById, getAllPosts } from "./blog-engine/repository";
import type { Post, PostInput } from "./blog-engine/models";

export type BlogPost = Post;
export type BlogPostInput = PostInput & {
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
  author?: string;
  featuredImageAlt?: string;
  isPublished?: boolean;
};

export const fetchPublishedPosts = async (): Promise<Post[]> => getPublishedPosts();

export const fetchAllPosts = async (): Promise<Post[]> => getAllPosts();

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => getPostBySlug(slug);

export const fetchPostById = async (id: string): Promise<Post | null> => getPostById(id);

export const fetchRelatedPosts = async (categoryOrSlug: string, currentSlug?: string): Promise<Post[]> => {
  const related = await listRelatedPosts(categoryOrSlug);
  if (!currentSlug) return related;
  return related.filter((post) => post.slug !== currentSlug);
};

const mapBlogInputToPost = (payload: BlogPostInput): PostInput => {
  const tags = Array.isArray(payload.tags)
    ? payload.tags
    : typeof payload.tags === "string"
      ? payload.tags.split(",").map((t) => t.trim())
      : [];

  const status = payload.isPublished ? "Published" : payload.status ?? "Draft";

  return {
    ...payload,
    excerpt: payload.excerpt || payload.intro || "",
    tags,
    status,
    authorName: payload.authorName || payload.author,
    featuredImageAlt: payload.featuredImageAlt || payload.title || "",
    seoTitle: payload.seoTitle || payload.metaTitle || payload.title,
    metaDescription: payload.metaDescription || payload.excerpt || payload.intro || "",
    ogTitle: payload.ogTitle || payload.metaTitle || payload.title,
    ogDescription: payload.ogDescription || payload.metaDescription || payload.excerpt,
    isPublished: status === "Published"
  } satisfies PostInput;
};

const apiRequest = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Request failed");
  }
  return json.data as T;
};

export const createBlogPost = async (payload: BlogPostInput): Promise<Post> => {
  const body = mapBlogInputToPost(payload);
  return apiRequest<Post>("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
};

export const updateBlogPost = async (id: string, payload: BlogPostInput): Promise<Post> => {
  const body = mapBlogInputToPost(payload);
  return apiRequest<Post>(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
};

export const deleteBlogPost = async (id: string) =>
  apiRequest<null>(`/api/posts/${id}`, { method: "DELETE" });

export const createSlug = (value: string) => slugify(value || "", { lower: true, strict: true });

export const uploadBlogImage = async (file: File, baseName: string): Promise<string> => {
  const filename = `${createSlug(baseName || "image")}-${Date.now()}`;
  const formData = new FormData();
  formData.append("file", file, filename);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (res.ok) {
    const json = await res.json();
    return json.url || json.path || json.location || "";
  }

  // Fall back to a local object URL to keep the form usable if upload API is absent
  return URL.createObjectURL(file);
};
