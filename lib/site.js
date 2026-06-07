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

// One-line description reused for meta, llms.txt and the Organization schema.
export const SITE_DESCRIPTION =
  "Imagicity is a creative marketing agency blending strategy, storytelling, and performance to launch, grow, and scale bold brands.";

// Primary contact details (kept in one place so schema, footer and llms.txt agree).
export const CONTACT_EMAIL = "connect@imagicity.in";
export const CONTACT_PHONE = "+91 91222 89578";
export const LOCATIONS = ["Hyderabad", "Bengaluru", "Dubai"];

// Public social profiles. Fill in the real URLs to power the footer links AND
// the Organization `sameAs` identity signal in one place. Leave url empty to
// omit a profile from `sameAs` (the footer falls back to "#").
export const SOCIAL_PROFILES = [
  { name: "Instagram", url: "" },
  { name: "LinkedIn", url: "" },
  { name: "X", url: "" },
  { name: "YouTube", url: "" }
];
