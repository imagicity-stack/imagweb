// Pure, framework-agnostic blog + SEO helpers.
// IMPORTANT: no Firebase imports here so this file is safe to bundle on the
// client (the editor and SEO panel use it for live scoring).

export const POSTS_COLLECTION = "posts";
export const COMMENTS_COLLECTION = "comments";
export const POST_STATS_COLLECTION = "postStats";
export const SUBSCRIBERS_COLLECTION = "subscribers";
export const CATEGORIES_COLLECTION = "categories";
export const WORDS_PER_MINUTE = 200;

export const DEFAULT_CATEGORIES = [
  "Marketing Strategy",
  "Brand Building",
  "Performance Marketing",
  "Content & SEO",
  "Social Media",
  "Growth & Funnels",
  "Case Studies",
  "Agency News"
];

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function stripHtml(html) {
  return String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text) {
  const clean = stripHtml(text);
  if (!clean) return 0;
  return clean.split(/\s+/).filter(Boolean).length;
}

export function readingStats(htmlOrText) {
  const words = countWords(htmlOrText);
  return {
    wordCount: words,
    readingTimeMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  };
}

export function buildExcerpt(htmlOrText, max = 160) {
  const text = stripHtml(htmlOrText);
  if (text.length <= max) return text;
  const truncated = text.slice(0, max);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 40 ? lastSpace : max).trim()}…`;
}

export function formatDate(value) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function getTags(html, tag) {
  const matches = String(html || "").match(
    new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}>`, "gi")
  );
  return matches || [];
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = haystack.match(new RegExp(escaped, "gi"));
  return matches ? matches.length : 0;
}

const STATUS_WEIGHT = { good: 1, warn: 0.5, bad: 0 };

// Yoast-style heuristic SEO analysis. Returns an overall 0-100 score plus a
// granular checklist that the editor renders live as the author types.
export function computeSeoScore(post = {}) {
  const title = (post.title || "").trim();
  const metaTitle = (post.seoTitle || post.title || "").trim();
  const metaDescription = (post.metaDescription || post.excerpt || "").trim();
  const focusKeyword = (post.focusKeyword || "").trim().toLowerCase();
  const slug = (post.slug || "").trim().toLowerCase();
  const html = post.content || "";
  const text = stripHtml(html).toLowerCase();
  const words = countWords(html);
  const firstParagraph = (stripHtml(getTags(html, "p")[0] || "") || text.slice(0, 160)).toLowerCase();
  const headings = [...getTags(html, "h2"), ...getTags(html, "h3")];
  const images = String(html).match(/<img[^>]*>/gi) || [];
  const imagesWithoutAlt = images.filter((img) => !/alt\s*=\s*["'][^"']+["']/i.test(img));
  const links = String(html).match(/<a[^>]+href=/gi) || [];

  const checks = [];
  const add = (id, label, status, advice, weight = 1) =>
    checks.push({ id, label, status, advice, weight });

  // Focus keyword
  if (focusKeyword) {
    add("keyword-set", "Focus keyword is set", "good", `Targeting “${focusKeyword}”.`, 2);
  } else {
    add("keyword-set", "Set a focus keyword", "bad", "Add the main phrase you want this post to rank for.", 2);
  }

  if (focusKeyword) {
    add(
      "keyword-title",
      "Keyword in SEO title",
      metaTitle.toLowerCase().includes(focusKeyword) ? "good" : "bad",
      "Use the focus keyword in the SEO title — ideally near the start.",
      2
    );
    add(
      "keyword-meta",
      "Keyword in meta description",
      metaDescription.toLowerCase().includes(focusKeyword) ? "good" : "warn",
      "Mention the focus keyword once in the meta description."
    );
    add(
      "keyword-slug",
      "Keyword in URL slug",
      slug.includes(focusKeyword.replace(/\s+/g, "-")) ? "good" : "warn",
      "Include the focus keyword in the URL slug."
    );
    add(
      "keyword-intro",
      "Keyword in introduction",
      firstParagraph.includes(focusKeyword) ? "good" : "warn",
      "Mention the focus keyword in the first paragraph."
    );
    const occurrences = countOccurrences(text, focusKeyword);
    const density = words ? (occurrences / words) * 100 : 0;
    let densityStatus = "warn";
    if (density >= 0.5 && density <= 2.5) densityStatus = "good";
    else if (density > 3.5) densityStatus = "bad";
    add(
      "keyword-density",
      `Keyword density ${density.toFixed(1)}%`,
      densityStatus,
      "Aim for a natural keyword density between 0.5% and 2.5%."
    );
  }

  // SEO title length
  let titleStatus = "bad";
  if (metaTitle.length >= 30 && metaTitle.length <= 60) titleStatus = "good";
  else if (metaTitle.length >= 20 && metaTitle.length <= 65) titleStatus = "warn";
  add(
    "title-length",
    `SEO title length ${metaTitle.length}/60`,
    titleStatus,
    "Keep the SEO title between 30 and 60 characters.",
    2
  );

  // Meta description length
  let metaStatus = "bad";
  if (metaDescription.length >= 120 && metaDescription.length <= 160) metaStatus = "good";
  else if (metaDescription.length >= 80 && metaDescription.length <= 170) metaStatus = "warn";
  add(
    "meta-length",
    `Meta description ${metaDescription.length}/160`,
    metaStatus,
    "Write a compelling meta description of 120–160 characters.",
    2
  );

  // Content length
  let lengthStatus = "bad";
  if (words >= 600) lengthStatus = "good";
  else if (words >= 300) lengthStatus = "warn";
  add(
    "content-length",
    `Content length ${words} words`,
    lengthStatus,
    "Long-form content ranks better — aim for 600+ words.",
    2
  );

  // Subheadings
  add(
    "subheadings",
    "Uses subheadings",
    headings.length >= 2 ? "good" : headings.length === 1 ? "warn" : "bad",
    "Break content up with H2/H3 subheadings for readability and SEO."
  );

  // Image alt text
  if (images.length === 0) {
    add("images", "Add an image", "warn", "Posts with images perform better — add at least one.");
  } else {
    add(
      "images",
      "Images have alt text",
      imagesWithoutAlt.length === 0 ? "good" : "bad",
      "Every image needs descriptive alt text for SEO and accessibility."
    );
  }

  // Links
  add(
    "links",
    "Contains links",
    links.length >= 1 ? "good" : "warn",
    "Add internal and external links to provide context and authority."
  );

  // Cover image
  add(
    "cover",
    "Cover image set",
    post.coverImageUrl ? "good" : "warn",
    "Add a cover image — it powers social sharing cards."
  );

  // Slug quality
  add(
    "slug",
    "Readable URL slug",
    slug && slug.length <= 60 ? "good" : "warn",
    "Keep slugs short, lowercase and descriptive."
  );

  const totalWeight = checks.reduce((sum, c) => sum + (c.weight || 1), 0);
  const earned = checks.reduce(
    (sum, c) => sum + STATUS_WEIGHT[c.status] * (c.weight || 1),
    0
  );
  const score = totalWeight ? Math.round((earned / totalWeight) * 100) : 0;

  let label = "Needs work";
  let tone = "bad";
  if (score >= 80) {
    label = "Excellent";
    tone = "good";
  } else if (score >= 55) {
    label = "Good";
    tone = "warn";
  } else if (score >= 35) {
    label = "Okay";
    tone = "warn";
  }

  return {
    score,
    label,
    tone,
    checks,
    stats: { words, headings: headings.length, images: images.length, links: links.length }
  };
}
