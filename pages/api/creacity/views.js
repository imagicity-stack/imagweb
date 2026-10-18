// Public, fire-and-forget view counter, called once per post view. View
// counts are a best-effort vanity metric, so this never surfaces errors.
// Guarded so it can't be used to inflate counts or flood the database: ids
// must look like real post ids (and the post must exist, checked in
// recordView), and each visitor counts at most once per post per 30 minutes.

import { recordView } from "../../../lib/creacityServer";
import { getRequestGeo, getRequestIp } from "../../../lib/geo";
import { createRateLimiter } from "../../../lib/rateLimit";
import { isValidPostId } from "../../../lib/blog";

export const config = { api: { bodyParser: { sizeLimit: "4kb" } } };

const seenRecently = createRateLimiter({ windowMs: 30 * 60 * 1000, max: 1 });
const tooManyOverall = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 60 });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false });
  }

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const postId = String(body.postId || "");
    const ip = getRequestIp(req);
    if (
      isValidPostId(postId) &&
      !tooManyOverall(ip) &&
      !seenRecently(ip ? `${ip}:${postId}` : "")
    ) {
      await recordView({
        postId,
        slug: String(body.slug || "").slice(0, 200),
        geo: getRequestGeo(req)
      });
    }
  } catch (error) {
    // Non-critical — swallow.
  }

  return res.status(200).json({ ok: true });
}
