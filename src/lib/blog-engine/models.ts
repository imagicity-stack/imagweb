export type HeadingLevel = "h2" | "h3";

export type PostStatus = "draft" | "scheduled" | "published" | "private";

export type SchemaType = "Article" | "BlogPosting" | "FAQ" | "HowTo";

export type RobotsIndex = "index" | "noindex";
export type RobotsFollow = "follow" | "nofollow";

export interface TableOfContentsItem {
  id: string;
  label: string;
  level: HeadingLevel;
}

export interface FeaturedImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface OpenGraphMeta {
  title: string;
  description: string;
  image?: FeaturedImage;
}

export interface SeoMeta {
  seoTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  robots: {
    index: RobotsIndex;
    follow: RobotsFollow;
  };
  openGraph: OpenGraphMeta;
}

export interface AuthorProfile {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface BlogPostCore {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  featuredImage: FeaturedImage;
  category: string;
  tags: string[];
  status: PostStatus;
  authorId: string;
  publishedAt: string;
  schemaType: SchemaType;
  tableOfContentsEnabled: boolean;
  readingTimeMinutes: number;
  seo: SeoMeta;
  canonicalUrl?: string;
  internalLinks: string[];
  redirectFrom: string[];
  toc?: TableOfContentsItem[];
}

export interface BlogPostDocument extends BlogPostCore {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface BlogPostInput extends Partial<BlogPostCore> {
  id?: string;
  slug?: string;
  overrideSlug?: string;
  publishAt?: string;
}

export interface VersionRecord {
  id?: string;
  postId: string;
  version: number;
  payload: BlogPostCore;
  createdAt: string;
}

export interface RedirectRule {
  from: string;
  to: string;
  createdAt: string;
}

export interface BlogSuggestion {
  id: string;
  title: string;
  slug: string;
  category: string;
}
