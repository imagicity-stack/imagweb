import { TableOfContentsItem } from "./models";

export const generateTocFromHtml = (html: string): TableOfContentsItem[] => {
  const matches = Array.from(html.matchAll(/<(h[23])[^>]*>(.*?)<\/\1>/gi));
  return matches.map((match, index) => ({
    id: `heading-${index + 1}`,
    label: match[2].replace(/<[^>]+>/g, "").trim(),
    level: match[1].toLowerCase() as "h2" | "h3"
  }));
};
