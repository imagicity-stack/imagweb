import { Timestamp } from "firebase/firestore";

export type PostStatus = "Draft" | "Scheduled" | "Published" | "Private";

export type SchemaType = "Article" | "BlogPosting" | "FAQ" | "HowTo";

export type RobotsIndex = "index" | "noindex";
export type RobotsFollow = "follow" | "nofollow";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: PostStatus;
  authorId?: string;
  authorName?: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishDate: Date | string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  robotsIndex: RobotsIndex;
  robotsFollow: RobotsFollow;
  schemaType: SchemaType;
  readingTime: number;
  tocEnabled: boolean;
  redirects: string[];
  isPublished: boolean;
  toc?: TableOfContentsItem[];
}

export interface PostInput extends Partial<Post> {
  id?: string;
  slug?: string;
}

export type HeadingLevel = "h2" | "h3";

export interface TableOfContentsItem {
  id: string;
  label: string;
  level: HeadingLevel;
}

export interface FirestorePostData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: PostStatus;
  authorId?: string;
  authorName?: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishDate: Timestamp;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  robotsIndex: RobotsIndex;
  robotsFollow: RobotsFollow;
  schemaType: SchemaType;
  readingTime: number;
  tocEnabled: boolean;
  redirects: string[];
  isPublished: boolean;
  toc?: TableOfContentsItem[];
}
