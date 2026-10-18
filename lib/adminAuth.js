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
    // Nobody who fails this check keeps the claim (Storage uploads trust it).
    // Someone removed from the allowlist is also signed out everywhere; a
    // listed-but-unverified user stays signed in to finish verifying, and the
    // session route grants the claim again once they have. An empty allowlist
    // is a misconfigured deployment, not a removal, so nobody is touched then.
    if (decoded.admin === true && allowlist.length > 0) {
      await dropAdminClaim(decoded.uid, { signOut: !emailListed });
    }
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

// Removes the admin claim (keeping any other claims) so Storage rules stop
// honouring it, optionally signing the user out everywhere. Best effort.
async function dropAdminClaim(uid, { signOut }) {
  try {
    const auth = getAdminAuth();
    const user = await auth.getUser(uid);
    const { admin, ...rest } = user.customClaims || {};
    await auth.setCustomUserClaims(uid, Object.keys(rest).length ? rest : null);
    if (signOut) await auth.revokeRefreshTokens(uid);
  } catch (error) {
    console.error("[admin-auth] could not drop admin claim:", error.message);
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
