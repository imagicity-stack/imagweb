// Public comments API.
//   GET  /api/comments?postId=…  → published comments for a post (newest first)
//   POST /api/comments           → create a comment (auto-published)
// Anti-spam: hidden honeypot field, per-IP rate limit, and a link cap. All
// input is stripped to plain text before storage.

import { createComment, getPublishedComments } from "../../../lib/commentsServer";
import { getRequestGeo, getRequestIp } from "../../../lib/geo";
import { sanitizePlainText } from "../../../lib/sanitize";

const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 4;
// Best-effort, per-instance rate limit (serverless instances are ephemeral, so
// this is a light deterrent rather than a hard guarantee).
const hits = new Map();

function rateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const tooManyLinks = (text) => (text.match(/https?:\/\//gi) || []).length > 2;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const postId = String(req.query.postId || "");
    if (!postId) return res.status(400).json({ ok: false, error: "postId is required." });
    const comments = await getPublishedComments(postId);
    return res.status(200).json({ ok: true, comments });
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};

      // Honeypot — bots fill hidden fields; humans never do. Pretend success.
      if (body.website) return res.status(200).json({ ok: true, comment: null });

      if (rateLimited(getRequestIp(req))) {
        return res
          .status(429)
          .json({ ok: false, error: "You're commenting too fast — please wait a moment." });
      }

      const name = sanitizePlainText(body.name, 80);
      const text = sanitizePlainText(body.body, 4000);
      const postId = String(body.postId || "");

      if (!postId) return res.status(400).json({ ok: false, error: "Missing post reference." });
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
      if (status >= 500) console.error("[comments]", error);
      return res.status(status).json({ ok: false, error: error.message || "Could not post comment." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ ok: false, error: "Method not allowed." });
}
