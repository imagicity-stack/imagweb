// Extracts coarse, aggregate-friendly visitor geo + IP from request headers.
// On Vercel the x-vercel-ip-* headers are populated automatically; in local dev
// they're absent, so callers fall back to "Unknown". We never store raw IPs —
// the IP is only used in-memory for light rate limiting.

function decode(value) {
  try {
    return decodeURIComponent(String(value || "")).trim();
  } catch (error) {
    return String(value || "").trim();
  }
}

export function getRequestGeo(req) {
  const h = req.headers || {};
  return {
    country: String(h["x-vercel-ip-country"] || "").toUpperCase().slice(0, 2),
    region: decode(h["x-vercel-ip-country-region"]).slice(0, 60),
    city: decode(h["x-vercel-ip-city"]).slice(0, 80)
  };
}

// Prefers the headers Vercel sets itself (clients cannot forge them there) and
// only falls back to the client-supplied X-Forwarded-For off-platform.
export function getRequestIp(req) {
  const h = req.headers || {};
  const first = (value) => String(value || "").split(",")[0].trim();
  return (
    first(h["x-vercel-forwarded-for"]) ||
    first(h["x-real-ip"]) ||
    first(h["x-forwarded-for"]) ||
    req.socket?.remoteAddress ||
    ""
  );
}
