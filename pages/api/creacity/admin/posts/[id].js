// Read, update and delete a single Creacity post. Admin only.

import { verifyAdminRequest, handleApiError } from "../../../../../lib/adminAuth";
import {
  getPostById,
  updatePostFromPayload,
  deletePost,
  revalidateCreacity
} from "../../../../../lib/creacityServer";
import { normalizeIncomingPost } from "../../../../../lib/postWrite";

export const config = { api: { bodyParser: { sizeLimit: "2mb" } } };

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const user = await verifyAdminRequest(req);

    if (req.method === "GET") {
      const post = await getPostById(id);
      if (!post) return res.status(404).json({ ok: false, error: "Post not found." });
      return res.status(200).json({ ok: true, post });
    }

    if (req.method === "PUT") {
      const data = normalizeIncomingPost(req.body || {});
      if (!data.title) {
        return res.status(400).json({ ok: false, error: "A title is required." });
      }
      const { post, slugs } = await updatePostFromPayload(id, data, user);
      await revalidateCreacity(res, slugs);
      return res.status(200).json({ ok: true, post });
    }

    if (req.method === "DELETE") {
      const { slug } = await deletePost(id);
      await revalidateCreacity(res, [slug]);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  } catch (error) {
    return handleApiError(res, error);
  }
}
