// Update + delete a single popup. Admin only.

import { verifyAdminRequest, handleApiError } from "../../../../lib/adminAuth";
import { updatePopup, deletePopup, normalizePopup } from "../../../../lib/popupsServer";

export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

export default async function handler(req, res) {
  try {
    await verifyAdminRequest(req);
    const { id } = req.query;

    if (req.method === "PUT") {
      const data = normalizePopup(req.body || {});
      const popup = await updatePopup(id, data);
      return res.status(200).json({ ok: true, popup });
    }

    if (req.method === "DELETE") {
      await deletePopup(id);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  } catch (error) {
    return handleApiError(res, error);
  }
}
