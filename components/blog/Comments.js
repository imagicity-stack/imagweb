import { useEffect, useState } from "react";
import { formatDate } from "../../lib/blog";

// Public comments for a blog post. Loads existing comments client-side (so the
// statically cached page always shows fresh discussion) and posts new ones via
// /api/comments. Comments are plain text and rendered with text interpolation
// (never HTML), so they're safe by construction.
export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", body: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/comments?postId=${encodeURIComponent(postId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && data.ok) setComments(data.comments || []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [postId]);

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setDone(false);
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, ...form })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Could not post your comment.");
        return;
      }
      if (data.comment) setComments((prev) => [data.comment, ...prev]);
      setForm({ name: "", body: "", website: "" });
      setDone(true);
    } catch (err) {
      setError("Could not post your comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const count = comments.length;

  return (
    <section className="news-comments" id="comments">
      <div className="news-section-rule">
        <span>{count ? `${count} comment${count === 1 ? "" : "s"}` : "Comments"}</span>
      </div>

      <form className="news-comment-form" onSubmit={submit}>
        <input
          type="text"
          required
          placeholder="Your name"
          aria-label="Your name"
          value={form.name}
          onChange={update("name")}
          maxLength={80}
        />
        {/* Honeypot: hidden from humans, catches bots. */}
        <input
          type="text"
          className="news-comment-hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.website}
          onChange={update("website")}
        />
        <textarea
          required
          rows={4}
          placeholder="Share your thoughts…"
          aria-label="Comment"
          value={form.body}
          onChange={update("body")}
          maxLength={4000}
        />
        {error ? <p className="news-comment-error">{error}</p> : null}
        {done ? <p className="news-comment-done">Thanks — your comment is live.</p> : null}
        <div className="news-comment-actions">
          <button type="submit" className="news-btn" disabled={submitting}>
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="news-comment-empty">Loading comments…</p>
      ) : count === 0 ? (
        <p className="news-comment-empty">Be the first to comment.</p>
      ) : (
        <ul className="news-comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="news-comment">
              <div className="news-comment-avatar" aria-hidden="true">
                {(comment.name || "A").slice(0, 1).toUpperCase()}
              </div>
              <div className="news-comment-main">
                <div className="news-comment-head">
                  <span className="news-comment-name">{comment.name}</span>
                  {comment.createdAt ? (
                    <time className="news-comment-date" dateTime={comment.createdAt}>
                      {formatDate(comment.createdAt)}
                    </time>
                  ) : null}
                </div>
                <p className="news-comment-text">{comment.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
