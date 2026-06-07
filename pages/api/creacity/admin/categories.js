// List + create Creacity categories. Admin only.

import { verifyAdminRequest, handleApiError } from "../../../../lib/adminAuth";
import { getCategories, ensureCategories } from "../../../../lib/creacityServer";

export default async function handler(req, res) {
  try {
    await verifyAdminRequest(req);

    if (req.method === "GET") {
      const categories = await getCategories();
      return res.status(200).json({ ok: true, categories });
    }

    if (req.method === "POST") {
      const name = String(req.body?.name || "").trim().slice(0, 80);
      if (!name) {
        return res.status(400).json({ ok: false, error: "A category name is required." });
      }
      await ensureCategories([name]);
      const categories = await getCategories();
      return res.status(201).json({ ok: true, categories });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  } catch (error) {
    return handleApiError(res, error);
  }
}
