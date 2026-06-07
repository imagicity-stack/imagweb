// Delete a single Creacity comment. Admin only.

import { verifyAdminRequest, handleApiError } from "../../../../../lib/adminAuth";
import { deleteComment } from "../../../../../lib/creacityServer";

export default async function handler(req, res) {
  try {
    await verifyAdminRequest(req);
    const { id } = req.query;
    if (req.method === "DELETE") {
      await deleteComment(id);
      return res.status(200).json({ ok: true });
    }
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  } catch (error) {
    return handleApiError(res, error);
  }
}
