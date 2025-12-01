import slugify from "slugify";
import sanitizeHtml from "sanitize-html";
import type { TableOfContentsItem } from "@/types/blog";

export const createSlug = (title: string) =>
  slugify(title || "", {
    lower: true,
    strict: true,
    trim: true
  });

export const ensureLazyImages = (html: string) =>
  html.replace(/<img\s/gi, '<img loading="lazy" decoding="async" ');

export const sanitizeContentHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: false,
    allowedAttributes: false,
    transformTags: {
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          loading: "lazy",
          decoding: "async"
        }
      })
    }
  });

export const getWordCount = (html: string) => {
  const stripped = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
  const words = stripped.trim().split(/\s+/);
  return words.filter(Boolean).length;
};

export const getReadingTime = (wordCount: number) => Math.max(1, Math.ceil(wordCount / 200));

export const generateTableOfContents = (html: string): TableOfContentsItem[] => {
  if (!html) return [];
  const matches = [...html.matchAll(/<h(2|3)[^>]*>(.*?)<\/h\1>/gims)];
  return matches.map((match, index) => ({
    id: `toc-${index}`,
    text: sanitizeHtml(match[2], { allowedTags: [], allowedAttributes: {} }),
    level: match[1] === "2" ? 2 : 3
  }));
};

export const validateSeoFields = (seo: Record<string, string | string[]>) => {
  const missing = Object.entries(seo)
    .filter(([, value]) => (Array.isArray(value) ? !value.length : !value))
    .map(([key]) => key);
  if (missing.length) {
    throw new Error(`Missing required SEO fields: ${missing.join(", ")}`);
  }
};
