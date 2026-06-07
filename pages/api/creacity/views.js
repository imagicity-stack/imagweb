// Public, fire-and-forget Creacity view counter.

import { recordView } from "../../../lib/creacityServer";
import { getRequestGeo } from "../../../lib/geo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false });
  }
  try {
    const { postId, slug } = req.body || {};
    if (postId) {
      await recordView({
        postId: String(postId).slice(0, 200),
        slug: String(slug || "").slice(0, 200),
        geo: getRequestGeo(req)
      });
    }
  } catch (error) {
    /* non-critical */
  }
  return res.status(200).json({ ok: true });
}
