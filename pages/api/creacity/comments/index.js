// Public Creacity comments. GET (published for a post) + POST (auto-published).

import { createComment, getPublishedComments } from "../../../../lib/creacityServer";
import { getRequestGeo, getRequestIp } from "../../../../lib/geo";
import { sanitizePlainText } from "../../../../lib/sanitize";
import { createRateLimiter } from "../../../../lib/rateLimit";
import { isValidPostId } from "../../../../lib/blog";

export const config = { api: { bodyParser: { sizeLimit: "16kb" } } };

const rateLimited = createRateLimiter({ windowMs: 60 * 1000, max: 4 });

const tooManyLinks = (text) => (text.match(/https?:\/\//gi) || []).length > 2;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const postId = String(req.query.postId || "");
    if (!isValidPostId(postId)) return res.status(400).json({ ok: false, error: "postId is required." });
    const comments = await getPublishedComments(postId);
    return res.status(200).json({ ok: true, comments });
  }

  if (req.method === "POST") {
    try {
      const body = req.body && typeof req.body === "object" ? req.body : {};
      if (body.website) return res.status(200).json({ ok: true, comment: null });

      if (rateLimited(getRequestIp(req))) {
        return res
          .status(429)
          .json({ ok: false, error: "You're commenting too fast — please wait a moment." });
      }

      const name = sanitizePlainText(body.name, 80);
      const text = sanitizePlainText(body.body, 4000);
      const postId = String(body.postId || "");

      if (!isValidPostId(postId)) {
        return res.status(400).json({ ok: false, error: "Missing post reference." });
      }
      if (name.length < 2) return res.status(400).json({ ok: false, error: "Please enter your name." });
      if (text.length < 2) return res.status(400).json({ ok: false, error: "Please write a comment." });
      if (tooManyLinks(text)) {
        return res.status(400).json({ ok: false, error: "Please include at most two links." });
      }

      const comment = await createComment({
        postId,
        name,
        body: text,
        geo: getRequestGeo(req)
      });
      return res.status(201).json({ ok: true, comment });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("[creacity-comments]", error);
      // Only our own 4xx messages are shown; unexpected errors stay in the logs.
      return res.status(status).json({
        ok: false,
        error: status < 500 && error.message ? error.message : "Could not post comment."
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ ok: false, error: "Method not allowed." });
}
