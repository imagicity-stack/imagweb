// Public, fire-and-forget view counter. Called once per post view from the
// blog post page. View counts are a best-effort vanity metric, so this never
// surfaces errors to the client.

import { recordView } from "../../lib/statsServer";
import { getRequestGeo } from "../../lib/geo";

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
    // Non-critical — swallow.
  }

  return res.status(200).json({ ok: true });
}
