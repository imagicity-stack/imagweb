// List + create Creacity posts. Admin only.

import { verifyAdminRequest, handleApiError } from "../../../../../lib/adminAuth";
import {
  getAllPostsForAdmin,
  getStatsMap,
  createPostFromPayload,
  revalidateCreacity
} from "../../../../../lib/creacityServer";
import { normalizeIncomingPost } from "../../../../../lib/postWrite";

export const config = { api: { bodyParser: { sizeLimit: "2mb" } } };

export default async function handler(req, res) {
  try {
    const user = await verifyAdminRequest(req);

    if (req.method === "GET") {
      const [posts, stats] = await Promise.all([getAllPostsForAdmin(), getStatsMap()]);
      const withStats = posts.map((post) => ({
        ...post,
        ...(stats[post.id] || { views: 0, byCountry: {}, byCity: {} })
      }));
      return res.status(200).json({ ok: true, posts: withStats });
    }

    if (req.method === "POST") {
      const data = normalizeIncomingPost(req.body || {});
      if (!data.title) {
        return res.status(400).json({ ok: false, error: "A title is required." });
      }
      const post = await createPostFromPayload(data, user);
      await revalidateCreacity(res, [post.slug]);
      return res.status(201).json({ ok: true, post });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  } catch (error) {
    return handleApiError(res, error);
  }
}
