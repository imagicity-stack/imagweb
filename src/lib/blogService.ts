import { listRelatedPosts, getPostBySlug, getPublishedPosts, getPostById, getAllPosts } from "./blog-engine/repository";
import type { Post } from "./blog-engine/models";

export type BlogPost = Post;

export const fetchPublishedPosts = async (): Promise<Post[]> => getPublishedPosts();

export const fetchAllPosts = async (): Promise<Post[]> => getAllPosts();

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => getPostBySlug(slug);

export const fetchPostById = async (id: string): Promise<Post | null> => getPostById(id);

export const fetchRelatedPosts = async (categoryOrSlug: string, currentSlug?: string): Promise<Post[]> => {
  const related = await listRelatedPosts(categoryOrSlug);
  if (!currentSlug) return related;
  return related.filter((post) => post.slug !== currentSlug);
};
