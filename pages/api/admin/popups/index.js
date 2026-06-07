// List + create popups. Admin only.

import { verifyAdminRequest, handleApiError } from "../../../../lib/adminAuth";
import { getAllPopups, createPopup, normalizePopup } from "../../../../lib/popupsServer";

export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

export default async function handler(req, res) {
  try {
    await verifyAdminRequest(req);

    if (req.method === "GET") {
      const popups = await getAllPopups();
      return res.status(200).json({ ok: true, popups });
    }

    if (req.method === "POST") {
      const data = normalizePopup(req.body || {});
      const popup = await createPopup(data);
      return res.status(201).json({ ok: true, popup });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  } catch (error) {
    return handleApiError(res, error);
  }
}
