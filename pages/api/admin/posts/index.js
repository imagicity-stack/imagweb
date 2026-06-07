// List all posts (drafts + published) and create new posts. Admin only.

import { FieldValue } from "firebase-admin/firestore";
import { verifyAdminRequest, handleApiError } from "../../../../lib/adminAuth";
import { getAdminDb } from "../../../../lib/firebase/admin";
import {
  getAllPostsForAdmin,
  uniqueSlug,
  serializePost
} from "../../../../lib/blogServer";
import { getStatsMap } from "../../../../lib/statsServer";
import { ensureCategories } from "../../../../lib/categoriesServer";
import { notifyNewPost } from "../../../../lib/newsletterServer";
import { normalizeIncomingPost, revalidateBlog } from "../../../../lib/postWrite";
import { POSTS_COLLECTION } from "../../../../lib/blog";

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

      const slug = await uniqueSlug(data.requestedSlug);
      const now = FieldValue.serverTimestamp();
      const doc = {
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
          uid: user.uid,
          name: user.name,
          email: user.email,
          picture: user.picture,
          bio: data.authorBio
        },
        createdAt: now,
        updatedAt: now,
        publishedAt: data.status === "published" ? now : null
      };

      const ref = await getAdminDb().collection(POSTS_COLLECTION).add(doc);
      await revalidateBlog(res, [slug]);
      const saved = await ref.get();
      const savedPost = serializePost(saved.id, saved.data());

      if (savedPost.category) await ensureCategories([savedPost.category]);
      // Email subscribers the first time a post goes live.
      if (savedPost.status === "published") await notifyNewPost(savedPost);

      return res.status(201).json({ ok: true, post: savedPost });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  } catch (error) {
    return handleApiError(res, error);
  }
}
