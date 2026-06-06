// Normalizes an incoming post payload from the editor into a safe, computed
// document shape. Used by the create/update API routes.

import { sanitizePostHtml, htmlToText } from "./sanitize";
import { slugify, readingStats, buildExcerpt } from "./blog";

function toTagArray(value) {
  const list = Array.isArray(value)
    ? value
    : String(value || "").split(",");
  return [...new Set(list.map((tag) => String(tag).trim()).filter(Boolean))].slice(0, 20);
}

export function normalizeIncomingPost(body = {}) {
  const title = String(body.title || "").trim().slice(0, 200);
  const content = sanitizePostHtml(body.content || "");
  const contentText = htmlToText(content);
  const { wordCount, readingTimeMinutes } = readingStats(content);
  const excerpt =
    String(body.excerpt || "").trim().slice(0, 320) || buildExcerpt(contentText, 160);

  const coverImage =
    body.coverImage && body.coverImage.url
      ? {
          url: String(body.coverImage.url).slice(0, 600),
          alt: String(body.coverImage.alt || "").slice(0, 200),
          width: Number(body.coverImage.width) || null,
          height: Number(body.coverImage.height) || null
        }
      : null;

  const seo = {
    title: String(body.seo?.title || "").trim().slice(0, 120),
    description: String(body.seo?.description || "").trim().slice(0, 320),
    focusKeyword: String(body.seo?.focusKeyword || "").trim().slice(0, 120),
    canonicalUrl: String(body.seo?.canonicalUrl || "").trim().slice(0, 400),
    ogImage: String(body.seo?.ogImage || "").trim().slice(0, 600),
    noindex: Boolean(body.seo?.noindex)
  };

  return {
    title,
    content,
    contentText,
    excerpt,
    wordCount,
    readingTimeMinutes,
    coverImage,
    category: String(body.category || "").trim().slice(0, 80),
    tags: toTagArray(body.tags),
    featured: Boolean(body.featured),
    status: body.status === "published" ? "published" : "draft",
    seo,
    authorBio: String(body.authorBio || "").trim().slice(0, 400),
    requestedSlug: slugify(body.slug || title) || "post"
  };
}

export async function revalidateBlog(res, slugs = []) {
  // /sitemap.xml is server-rendered (always fresh), so it does not need ISR
  // revalidation here.
  const paths = ["/blog", ...slugs.filter(Boolean).map((s) => `/blog/${s}`)];
  await Promise.all(
    [...new Set(paths)].map(async (path) => {
      try {
        await res.revalidate(path);
      } catch (error) {
        console.error(`Revalidation failed for ${path}:`, error.message);
      }
    })
  );
}
