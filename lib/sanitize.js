// Server-side sanitization for post HTML produced by the rich text editor.
// Runs before content is stored in Firestore so what we render is always safe.

import sanitizeHtml from "sanitize-html";

const ALLOWED_IFRAME_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com"
];

const options = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "blockquote", "pre", "code", "span", "div",
    "ul", "ol", "li",
    "a", "b", "strong", "i", "em", "u", "s", "strike", "mark", "sub", "sup",
    "br", "hr",
    "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td",
    "iframe"
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    iframe: [
      "src", "width", "height", "allow", "allowfullscreen",
      "frameborder", "title"
    ],
    span: ["style"],
    p: ["style"],
    div: ["style"],
    h1: ["style"], h2: ["style"], h3: ["style"], h4: ["style"],
    td: ["style"], th: ["style"], li: ["style"]
  },
  allowedStyles: {
    "*": {
      "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/]
    }
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: "noopener noreferrer",
        ...(attribs.target === "_blank" ? { target: "_blank" } : {})
      }
    }),
    img: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, loading: attribs.loading || "lazy" }
    })
  },
  allowedIframeHostnames: ALLOWED_IFRAME_HOSTS
};

export function sanitizePostHtml(dirty) {
  if (!dirty || typeof dirty !== "string") return "";
  return sanitizeHtml(dirty, options);
}

// Plain-text version of the content, used for word counts, excerpts and search.
export function htmlToText(html) {
  if (!html) return "";
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}
