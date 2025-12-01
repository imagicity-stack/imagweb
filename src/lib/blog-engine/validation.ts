import slugify from "slugify";
import { PostInput, PostStatus, RobotsFollow, RobotsIndex, SchemaType } from "./models";

const MAX_TAGS = 8;
const MIN_TAGS = 4;
const MIN_EXCERPT = 40;
const MAX_EXCERPT = 260;
const MIN_META_DESCRIPTION = 70;
const MAX_META_DESCRIPTION = 160;
const MAX_SEO_TITLE = 70;

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitized?: PostInput;
}

const normalizeSlug = (value: string) =>
  slugify(value, {
    lower: true,
    strict: true
  });

const isValidUrl = (value?: string) => {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isValidStatus = (status?: string): status is PostStatus =>
  Boolean(status && ["Draft", "Scheduled", "Published", "Private"].includes(status));

const isValidSchemaType = (schema?: string): schema is SchemaType =>
  Boolean(schema && ["Article", "BlogPosting", "FAQ", "HowTo"].includes(schema));

const isValidRobotsIndex = (index?: string): index is RobotsIndex => Boolean(index && ["index", "noindex"].includes(index));
const isValidRobotsFollow = (follow?: string): follow is RobotsFollow =>
  Boolean(follow && ["follow", "nofollow"].includes(follow));

export const validatePostInput = (input: PostInput): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!input.title || input.title.trim().length < 4) {
    errors.title = "Title is required and should be at least 4 characters.";
  }

  const slugCandidate = input.slug || input.title;
  if (!slugCandidate) {
    errors.slug = "Slug is required.";
  }

  const normalizedSlug = slugCandidate ? normalizeSlug(slugCandidate) : "";
  if (normalizedSlug.length < 3) {
    errors.slug = "Slug must be at least 3 characters.";
  }

  if (!input.content || input.content.trim().length < 120) {
    errors.content = "Content must be at least 120 characters and include headings.";
  }

  if (!input.featuredImageUrl) {
    errors.featuredImageUrl = "Featured image URL is required.";
  }

  if (!input.featuredImageAlt) {
    errors.featuredImageAlt = "Featured image alt text is required.";
  }

  if (!input.category) {
    errors.category = "Primary category is required.";
  }

  if (!input.tags?.length || input.tags.length < MIN_TAGS || input.tags.length > MAX_TAGS) {
    errors.tags = "Please provide between 4 and 8 tags.";
  }

  if (!input.excerpt || input.excerpt.length < MIN_EXCERPT || input.excerpt.length > MAX_EXCERPT) {
    errors.excerpt = `Excerpt must be ${MIN_EXCERPT}-${MAX_EXCERPT} characters.`;
  }

  if (!input.seoTitle || input.seoTitle.length > MAX_SEO_TITLE) {
    errors.seoTitle = `SEO title is required and cannot exceed ${MAX_SEO_TITLE} characters.`;
  }

  if (
    !input.metaDescription ||
    input.metaDescription.length < MIN_META_DESCRIPTION ||
    input.metaDescription.length > MAX_META_DESCRIPTION
  ) {
    errors.metaDescription = `Meta description must be ${MIN_META_DESCRIPTION}-${MAX_META_DESCRIPTION} characters.`;
  }

  if (!isValidRobotsIndex(input.robotsIndex)) {
    errors.robotsIndex = "Robots index must be either index or noindex.";
  }

  if (!isValidRobotsFollow(input.robotsFollow)) {
    errors.robotsFollow = "Robots follow must be either follow or nofollow.";
  }

  if (input.canonicalUrl && !isValidUrl(input.canonicalUrl)) {
    errors.canonicalUrl = "Canonical URL must be a valid URL.";
  }

  if (input.ogImageUrl && !isValidUrl(input.ogImageUrl)) {
    errors.ogImageUrl = "Open Graph image must be a valid URL.";
  }

  if (!isValidStatus(input.status)) {
    errors.status = "Post status is invalid.";
  }

  if (!isValidSchemaType(input.schemaType)) {
    errors.schemaType = "Schema type is invalid.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      ...input,
      slug: normalizedSlug
    }
  };
};

export const sanitizeTags = (tags: string[]) =>
  tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());
