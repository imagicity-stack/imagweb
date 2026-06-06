// Verifies an admin sign-in and grants the `admin` custom claim so that
// Firestore/Storage security rules can authorize direct client uploads.

import { verifyAdminRequest, handleApiError } from "../../../lib/adminAuth";
import { getAdminAuth } from "../../../lib/firebase/admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  try {
    const user = await verifyAdminRequest(req);
    const claimUpdated = user.claims.admin !== true;
    if (claimUpdated) {
      await getAdminAuth().setCustomUserClaims(user.uid, { admin: true });
    }
    return res.status(200).json({
      ok: true,
      admin: true,
      claimUpdated,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error) {
    return handleApiError(res, error);
  }
}
