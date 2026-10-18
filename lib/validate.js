// Input helpers shared by the public API routes. Everything a visitor sends is
// untrusted: coerce to the expected type first, then bound its size.

// Plain single address: no spaces, quotes, angle brackets, commas or
// semicolons (so it can't smuggle extra recipients), a real-looking domain,
// and within the RFC 5321 length limits.
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,63}$/;

export function isValidEmail(value) {
  const email = String(value || "").trim();
  return email.length <= 254 && EMAIL_RE.test(email);
}

// Returns a trimmed string, or "" for anything that isn't a string (numbers,
// arrays and objects are rejected instead of crashing `.trim()`).
export function cleanString(value, max) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return max ? trimmed.slice(0, max) : trimmed;
}
