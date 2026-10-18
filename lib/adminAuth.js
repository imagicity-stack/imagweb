// Server-side authorization guard for admin API routes.
// Verifies a Firebase ID token (rejecting revoked or disabled accounts) and
// confirms the caller's VERIFIED email is in the ADMIN_EMAILS allowlist. The
// allowlist is the single source of truth: the `admin` custom claim only exists
// so Storage rules can authorize uploads, and it is removed from anyone who is
// no longer allowlisted.

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
    // checkRevoked: a disabled user or revoked session is refused immediately,
    // not only once the current one-hour token expires.
    decoded = await getAdminAuth().verifyIdToken(token, true);
  } catch (verifyError) {
    const error = new Error("Your session is invalid or has expired. Please sign in again.");
    error.statusCode = 401;
    throw error;
  }

  const allowlist = getAllowedAdminEmails();
  const email = (decoded.email || "").trim().toLowerCase();
  const emailListed = allowlist.length > 0 && Boolean(email) && allowlist.includes(email);
  // An unverified address proves nothing: anyone can register an account with
  // someone else's email. Google sign-ins always arrive verified.
  const isAllowlisted = emailListed && decoded.email_verified === true;

  if (!isAllowlisted) {
    // Someone removed from the allowlist loses the claim (and their sessions).
    // A listed-but-unverified admin keeps theirs so they can verify and return.
    if (decoded.admin === true && !emailListed) await dropStaleAdminClaim(decoded.uid);
    const error = new Error(
      allowlist.length === 0
        ? "No admins are configured. Set the ADMIN_EMAILS environment variable."
        : emailListed
          ? "Please verify your email address to access the admin area."
          : "This account is not authorized for the admin area."
    );
    error.statusCode = 403;
    if (emailListed) error.code = "email_unverified";
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

// Removes the admin claim from a user who is no longer allowlisted and signs
// them out everywhere, so Storage rules stop honouring them too. Best effort.
async function dropStaleAdminClaim(uid) {
  try {
    const auth = getAdminAuth();
    const user = await auth.getUser(uid);
    const { admin, ...rest } = user.customClaims || {};
    await auth.setCustomUserClaims(uid, Object.keys(rest).length ? rest : null);
    await auth.revokeRefreshTokens(uid);
  } catch (error) {
    console.error("[admin-auth] could not drop stale admin claim:", error.message);
  }
}

export function handleApiError(res, error) {
  const status = error.statusCode || 500;
  if (status >= 500) {
    console.error("[admin-api]", error);
  }
  res.status(status).json({
    ok: false,
    error: error.message || "Server error.",
    ...(error.code ? { code: error.code } : {})
  });
}
