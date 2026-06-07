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

// Public social profiles, sourced from environment variables so they can be
// managed in Vercel (Project → Settings → Environment Variables) without
// touching code. They must be NEXT_PUBLIC_* because the footer and the
// Organization `sameAs` render in the browser — note that NEXT_PUBLIC_* values
// are inlined at build time, so changing them requires a redeploy. A profile
// with no URL set is omitted from both the footer and `sameAs`.
export const SOCIAL_PROFILES = [
  { name: "Instagram", url: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM },
  { name: "LinkedIn", url: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN },
  { name: "X", url: process.env.NEXT_PUBLIC_SOCIAL_X },
  { name: "YouTube", url: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE }
]
  .map((profile) => ({ name: profile.name, url: (profile.url || "").trim() }))
  .filter((profile) => profile.url);
