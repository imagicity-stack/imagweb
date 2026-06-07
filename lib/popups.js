// Client-safe popup constants + helpers (no Firebase imports, so this is safe
// to bundle in the browser for both the admin builder and the public popup).

export const POPUPS_COLLECTION = "popups";

export const POPUP_PAGES = [
  { id: "all", label: "All pages" },
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Work" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" }
];

export const POPUP_TRIGGERS = [
  { id: "delay", label: "After a delay" },
  { id: "exit", label: "On exit intent" },
  { id: "immediate", label: "Immediately" }
];

export const POPUP_FREQUENCIES = [
  { id: "session", label: "Once per browsing session" },
  { id: "daily", label: "Once every 24 hours" },
  { id: "always", label: "Every page load" }
];

export const POPUP_THEMES = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "accent", label: "Accent" }
];

// Maps a Next.js router pathname to a popup page key.
export function pathToPageKey(pathname = "/") {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/portfolio")) return "portfolio";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/contact")) return "contact";
  return "other";
}
