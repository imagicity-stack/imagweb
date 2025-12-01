export type BlogStatus = "draft" | "scheduled" | "published" | "private";

export type SchemaType = "Article" | "BlogPosting" | "FAQ" | "HowTo" | "CaseStudy" | "Review";

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface SeoFields {
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  canonicalUrl: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export interface CtaFields {
  ctaText: string;
  ctaLink: string;
  ctaEnabled: boolean;
  newsletterEmbed?: string;
}

export interface BlogRevision {
  id?: string;
  title: string;
  contentHtml: string;
  seo: SeoFields;
  updatedAt: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  featuredImage: string;
  featuredImageAlt: string;
  category: string;
  tags: string[];
  excerpt: string;
  authorId: string;
  status: BlogStatus;
  publishDate?: string;
  contentHtml: string;
  tableOfContents: TableOfContentsItem[];
  readingTime: number;
  wordCount: number;
  seo: SeoFields;
  schemaType: SchemaType;
  internalLinks: string[];
  openGraphImage?: string;
  twitterImage?: string;
  cta: CtaFields;
  createdAt?: string;
  updatedAt?: string;
  featuredImageUrl?: string;
  intro?: string;
}

export interface InternalLinkSuggestion {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
}
