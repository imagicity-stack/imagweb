// Server-side authorization guard for admin API routes.
// Verifies a Firebase ID token and confirms the caller is an allowed admin
// (either via the ADMIN_EMAILS allowlist or an `admin` custom claim).

import { getAdminAuth, isAdminConfigured } from "./firebase/admin";

export function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export async function verifyAdminRequest(req) {
  if (!isAdminConfigured) {
    const error = new Error("Firebase Admin SDK is not configured on the server.");
    error.statusCode = 503;
    throw error;
  }

  const header = req.headers.authorization || req.headers.Authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    const error = new Error("Authentication required.");
    error.statusCode = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (verifyError) {
    const error = new Error("Your session is invalid or has expired. Please sign in again.");
    error.statusCode = 401;
    throw error;
  }

  const allowlist = getAllowedAdminEmails();
  const email = (decoded.email || "").toLowerCase();
  const isAllowlisted = allowlist.length > 0 && allowlist.includes(email);
  const isAdmin = decoded.admin === true || isAllowlisted;

  if (!isAdmin) {
    const error = new Error(
      allowlist.length === 0
        ? "No admins are configured. Set the ADMIN_EMAILS environment variable."
        : "This account is not authorized for the admin area."
    );
    error.statusCode = 403;
    throw error;
  }

  return {
    uid: decoded.uid,
    email: decoded.email || "",
    name: decoded.name || (decoded.email ? decoded.email.split("@")[0] : "Admin"),
    picture: decoded.picture || "",
    isAllowlisted,
    claims: decoded
  };
}

export function handleApiError(res, error) {
  const status = error.statusCode || 500;
  if (status >= 500) {
    console.error("[admin-api]", error);
  }
  res.status(status).json({ ok: false, error: error.message || "Server error." });
}
