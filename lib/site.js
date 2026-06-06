// Site-wide constants shared by client and server.
// NEXT_PUBLIC_SITE_URL lets you override the canonical origin per environment.

export const SITE_NAME = "Imagicity";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://imagicity.in"
).replace(/\/+$/, "");

export const DEFAULT_OG_IMAGE = `${SITE_URL}/ICONS/80795w00.png`;

export const absoluteUrl = (path = "/") => {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
