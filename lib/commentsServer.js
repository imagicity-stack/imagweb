// Server-only blog comments (Admin SDK). Public visitors create comments
// through /api/comments (validated + sanitized there); the admin lists and
// deletes them. Comments are auto-published and stored as plain text.

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminConfigured } from "./firebase/admin";
import { COMMENTS_COLLECTION, POSTS_COLLECTION } from "./blog";

const toIso = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : null;
};

export function serializeComment(id, data = {}) {
  return {
    id,
    postId: data.postId || "",
    postSlug: data.postSlug || "",
    postTitle: data.postTitle || "",
    name: data.name || "Anonymous",
    body: data.body || "",
    status: data.status || "published",
    country: data.country || "",
    createdAt: toIso(data.createdAt)
  };
}

// Published comments for one post, newest first (sorted in memory so no
// composite index is required).
export async function getPublishedComments(postId) {
  if (!isAdminConfigured || !postId) return [];
  try {
    const snapshot = await getAdminDb()
      .collection(COMMENTS_COLLECTION)
      .where("postId", "==", String(postId))
      .get();
    return snapshot.docs
      .map((doc) => serializeComment(doc.id, doc.data()))
      .filter((comment) => comment.status === "published")
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  } catch (error) {
    console.error("getPublishedComments failed:", error.message);
    return [];
  }
}

// Every comment across all posts, newest first — for the admin moderation view.
export async function getAllComments({ max = 300 } = {}) {
  if (!isAdminConfigured) return [];
  const snapshot = await getAdminDb()
    .collection(COMMENTS_COLLECTION)
    .orderBy("createdAt", "desc")
    .limit(max)
    .get();
  return snapshot.docs.map((doc) => serializeComment(doc.id, doc.data()));
}

export async function createComment({ postId, name, body, geo }) {
  if (!isAdminConfigured) {
    const error = new Error("Comments are unavailable right now.");
    error.statusCode = 503;
    throw error;
  }

  // Only allow comments on real, published posts.
  const postDoc = await getAdminDb().collection(POSTS_COLLECTION).doc(String(postId)).get();
  if (!postDoc.exists || postDoc.data().status !== "published") {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }
  const post = postDoc.data();

  const ref = await getAdminDb()
    .collection(COMMENTS_COLLECTION)
    .add({
      postId: String(postId),
      postSlug: post.slug || "",
      postTitle: post.title || "",
      name,
      body,
      status: "published",
      country: (geo?.country || "").slice(0, 2),
      createdAt: FieldValue.serverTimestamp()
    });

  const saved = await ref.get();
  return serializeComment(saved.id, saved.data());
}

export async function deleteComment(id) {
  if (!isAdminConfigured || !id) return;
  await getAdminDb().collection(COMMENTS_COLLECTION).doc(String(id)).delete();
}
