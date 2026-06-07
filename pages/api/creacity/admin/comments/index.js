// List all Creacity comments for moderation. Admin only.

import { verifyAdminRequest, handleApiError } from "../../../../../lib/adminAuth";
import { getAllComments } from "../../../../../lib/creacityServer";

export default async function handler(req, res) {
  try {
    await verifyAdminRequest(req);
    if (req.method === "GET") {
      const comments = await getAllComments({ max: 300 });
      return res.status(200).json({ ok: true, comments });
    }
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  } catch (error) {
    return handleApiError(res, error);
  }
}
