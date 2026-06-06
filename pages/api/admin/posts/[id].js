// Read, update and delete a single post by document id. Admin only.

import { FieldValue } from "firebase-admin/firestore";
import { verifyAdminRequest, handleApiError } from "../../../../lib/adminAuth";
import { getAdminDb } from "../../../../lib/firebase/admin";
import { uniqueSlug, serializePost } from "../../../../lib/blogServer";
import { normalizeIncomingPost, revalidateBlog } from "../../../../lib/postWrite";
import { POSTS_COLLECTION } from "../../../../lib/blog";

export const config = { api: { bodyParser: { sizeLimit: "2mb" } } };

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const user = await verifyAdminRequest(req);
    const ref = getAdminDb().collection(POSTS_COLLECTION).doc(id);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      return res.status(404).json({ ok: false, error: "Post not found." });
    }
    const existing = snapshot.data();

    if (req.method === "GET") {
      return res.status(200).json({ ok: true, post: serializePost(snapshot.id, existing) });
    }

    if (req.method === "PUT") {
      const data = normalizeIncomingPost(req.body || {});
      if (!data.title) {
        return res.status(400).json({ ok: false, error: "A title is required." });
      }

      // Keep the existing slug unless the author changed it.
      let slug = existing.slug;
      if (data.requestedSlug && data.requestedSlug !== existing.slug) {
        slug = await uniqueSlug(data.requestedSlug, id);
      }

      // Set publishedAt the first time a post goes live; keep it afterwards.
      let publishedAt = existing.publishedAt || null;
      if (data.status === "published" && !existing.publishedAt) {
        publishedAt = FieldValue.serverTimestamp();
      }

      const update = {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        contentText: data.contentText,
        coverImage: data.coverImage,
        status: data.status,
        featured: data.featured,
        category: data.category,
        tags: data.tags,
        seo: data.seo,
        wordCount: data.wordCount,
        readingTimeMinutes: data.readingTimeMinutes,
        author: {
          ...(existing.author || {}),
          bio: data.authorBio || existing.author?.bio || "",
          lastEditedBy: user.email
        },
        updatedAt: FieldValue.serverTimestamp(),
        publishedAt
      };

      await ref.update(update);
      await revalidateBlog(res, [slug, existing.slug]);
      const saved = await ref.get();
      return res.status(200).json({ ok: true, post: serializePost(saved.id, saved.data()) });
    }

    if (req.method === "DELETE") {
      await ref.delete();
      await revalidateBlog(res, [existing.slug]);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  } catch (error) {
    return handleApiError(res, error);
  }
}
