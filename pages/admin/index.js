import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import AdminAuthGate, { useAdminAuth } from "../../components/admin/AdminAuthGate";
import PostEditorModal from "../../components/admin/PostEditorModal";
import { formatDate } from "../../lib/blog";

function Dashboard() {
  const { user, getToken, signOut } = useAdminAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const response = await fetch("/api/admin/posts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not load posts.");
        return;
      }
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message || "Could not load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaved = (post, deletedId) => {
    setPosts((prev) => {
      if (deletedId) return prev.filter((item) => item.id !== deletedId);
      const index = prev.findIndex((item) => item.id === post.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = post;
        return next;
      }
      return [post, ...prev];
    });
  };

  const stats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status !== "published").length
    }),
    [posts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (filter === "published" && post.status !== "published") return false;
      if (filter === "draft" && post.status === "published") return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        (post.category || "").toLowerCase().includes(q) ||
        (post.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [posts, query, filter]);

  const openNew = () => {
    setEditingPost(null);
    setEditorOpen(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setEditorOpen(true);
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-brand">
            <span className="admin-brand-mark">✦</span>
            <div>
              <strong>Imagicity Studio</strong>
              <span>Blog manager</span>
            </div>
          </div>
          <div className="admin-user">
            {user?.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.picture} alt={user.name || user.email} />
            ) : (
              <span className="admin-user-avatar" aria-hidden="true">
                {(user?.name || user?.email || "A").slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="admin-user-name">{user?.name || user?.email}</span>
            <button type="button" className="admin-signout" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-head">
          <div>
            <h1>Posts</h1>
            <p>
              {stats.total} total · {stats.published} published · {stats.drafts} drafts
            </p>
          </div>
          <button type="button" className="btn btn-glow" onClick={openNew}>
            + New post
          </button>
        </div>

        <div className="admin-controls">
          <input
            type="search"
            className="admin-search"
            placeholder="Search posts, categories, tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="admin-filter-tabs">
            {[
              { id: "all", label: "All" },
              { id: "published", label: "Published" },
              { id: "draft", label: "Drafts" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={filter === tab.id ? "active" : ""}
                onClick={() => setFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button type="button" className="admin-refresh" onClick={load} disabled={loading}>
            ↻ Refresh
          </button>
        </div>

        {error ? <div className="admin-error">{error}</div> : null}

        {loading ? (
          <div className="admin-loader inline">
            <span className="admin-spinner" />
            <p>Loading posts…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <h3>No posts found</h3>
            <p>
              {posts.length === 0
                ? "Create your first SEO-optimized post to get started."
                : "Try a different search or filter."}
            </p>
            {posts.length === 0 ? (
              <button type="button" className="btn btn-glow" onClick={openNew}>
                + Write your first post
              </button>
            ) : null}
          </div>
        ) : (
          <div className="admin-post-list">
            {filtered.map((post) => (
              <button
                key={post.id}
                type="button"
                className="admin-post-row"
                onClick={() => openEdit(post)}
              >
                <div className="admin-post-thumb">
                  {post.coverImage?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage.url} alt="" />
                  ) : (
                    <span aria-hidden="true">{(post.title || "I").slice(0, 1)}</span>
                  )}
                </div>
                <div className="admin-post-info">
                  <div className="admin-post-title">{post.title || "Untitled"}</div>
                  <div className="admin-post-meta">
                    <span className={`status-pill ${post.status}`}>{post.status}</span>
                    {post.category ? <span>{post.category}</span> : null}
                    <span>{post.readingTimeMinutes} min</span>
                    <span>
                      {formatDate(post.updatedAt || post.publishedAt || post.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="admin-post-actions">
                  {post.status === "published" ? (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View ↗
                    </a>
                  ) : null}
                  <span className="admin-post-edit">Edit →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {editorOpen ? (
        <PostEditorModal
          key={editingPost?.id || "new"}
          post={editingPost}
          onClose={() => setEditorOpen(false)}
          onSaved={handleSaved}
        />
      ) : null}
    </div>
  );
}

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Studio · Imagicity</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="admin-root">
        <div className="bg-mesh" aria-hidden="true">
          <span className="orb orb-violet" />
          <span className="orb orb-pink" />
          <span className="orb orb-aqua" />
          <span className="grain" />
        </div>
        <AdminAuthGate>
          <Dashboard />
        </AdminAuthGate>
      </div>
    </>
  );
}
