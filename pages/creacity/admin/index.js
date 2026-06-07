import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import AdminAuthGate, { useAdminAuth } from "../../../components/admin/AdminAuthGate";
import PostEditorModal from "../../../components/admin/PostEditorModal";
import { ThemeProvider, useTheme, ThemeToggle } from "../../../components/admin/ThemeProvider";
import { formatDate } from "../../../lib/blog";

const EDITOR_CONFIG = {
  apiBase: "/api/creacity/admin/posts",
  categoriesApi: "/api/creacity/admin/categories",
  storageFolder: "creacity",
  publicBase: "/creacity"
};

const numberFmt = new Intl.NumberFormat("en-US");
const fmt = (value) => numberFmt.format(Number(value) || 0);

function topEntries(map, max = 6) {
  return Object.entries(map || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, max);
}

function Dashboard() {
  const { user, getToken, signOut } = useAdminAuth();
  const [view, setView] = useState("posts");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [catInput, setCatInput] = useState("");
  const [catBusy, setCatBusy] = useState(false);
  const [catError, setCatError] = useState("");

  const authedFetch = async (url, options = {}) => {
    const token = await getToken();
    return fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` }
    });
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authedFetch("/api/creacity/admin/posts");
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

  const loadComments = async () => {
    setCommentsLoading(true);
    setCommentsError("");
    try {
      const response = await authedFetch("/api/creacity/admin/comments");
      const data = await response.json();
      if (!response.ok) {
        setCommentsError(data.error || "Could not load comments.");
        return;
      }
      setComments(data.comments || []);
      setCommentsLoaded(true);
    } catch (err) {
      setCommentsError(err.message || "Could not load comments.");
    } finally {
      setCommentsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await authedFetch("/api/creacity/admin/categories");
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories || []);
        setCategoriesLoaded(true);
      }
    } catch (err) {
      /* ignore */
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (view === "comments" && !commentsLoaded && !commentsLoading) loadComments();
    if (view === "categories" && !categoriesLoaded) loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const addCategory = async (event) => {
    event.preventDefault();
    if (!catInput.trim()) return;
    setCatBusy(true);
    setCatError("");
    try {
      const response = await authedFetch("/api/creacity/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catInput.trim() })
      });
      const data = await response.json();
      if (!response.ok) {
        setCatError(data.error || "Could not add category.");
        return;
      }
      setCategories(data.categories || []);
      setCatInput("");
    } catch (err) {
      setCatError(err.message || "Could not add category.");
    } finally {
      setCatBusy(false);
    }
  };

  const deleteComment = async (comment) => {
    if (!window.confirm(`Delete this comment from ${comment.name}?`)) return;
    try {
      const response = await authedFetch(`/api/creacity/admin/comments/${comment.id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (!response.ok) {
        setCommentsError(data.error || "Could not delete comment.");
        return;
      }
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (err) {
      setCommentsError(err.message || "Could not delete comment.");
    }
  };

  const handleSaved = (post, deletedId) => {
    setPosts((prev) => {
      if (deletedId) return prev.filter((item) => item.id !== deletedId);
      const index = prev.findIndex((item) => item.id === post.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], ...post };
        return next;
      }
      return [post, ...prev];
    });
  };

  const stats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status !== "published").length,
      views: posts.reduce((sum, p) => sum + (Number(p.views) || 0), 0)
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

  const insights = useMemo(
    () =>
      posts
        .filter((p) => (Number(p.views) || 0) > 0)
        .sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0)),
    [posts]
  );

  const openNew = () => {
    setEditingPost(null);
    setEditorOpen(true);
  };
  const openEdit = (post) => {
    setEditingPost(post);
    setEditorOpen(true);
  };

  const navTabs = [
    { id: "posts", label: "Lessons" },
    { id: "comments", label: "Comments" },
    { id: "insights", label: "Insights" },
    { id: "categories", label: "Categories" }
  ];

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-brand">
            <span className="admin-brand-mark">✦</span>
            <div>
              <strong>Creacity Studio</strong>
              <span>Tips &amp; tricks manager</span>
            </div>
          </div>
          <div className="admin-user">
            <ThemeToggle />
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
        <nav className="admin-nav admin-nav-primary" aria-label="Sections">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={view === tab.id ? "active" : ""}
              onClick={() => setView(tab.id)}
            >
              {tab.label}
              {tab.id === "comments" && commentsLoaded ? (
                <span className="admin-nav-count">{comments.length}</span>
              ) : null}
              {tab.id === "categories" && categoriesLoaded ? (
                <span className="admin-nav-count">{categories.length}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {view === "posts" ? (
          <>
            <div className="admin-head">
              <div>
                <h1>Lessons</h1>
                <p>
                  {stats.total} total · {stats.published} published · {stats.drafts} drafts ·{" "}
                  {fmt(stats.views)} views
                </p>
              </div>
              <button type="button" className="btn btn-glow" onClick={openNew}>
                + New lesson
              </button>
            </div>

            <div className="admin-controls">
              <input
                type="search"
                className="admin-search"
                placeholder="Search lessons, categories, tags…"
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
                <p>Loading lessons…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="admin-empty">
                <h3>No lessons found</h3>
                <p>
                  {posts.length === 0
                    ? "Create your first tip or trick to get started."
                    : "Try a different search or filter."}
                </p>
                {posts.length === 0 ? (
                  <button type="button" className="btn btn-glow" onClick={openNew}>
                    + Write your first lesson
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
                        <span aria-hidden="true">{(post.title || "C").slice(0, 1)}</span>
                      )}
                    </div>
                    <div className="admin-post-info">
                      <div className="admin-post-title">{post.title || "Untitled"}</div>
                      <div className="admin-post-meta">
                        <span className={`status-pill ${post.status}`}>{post.status}</span>
                        {post.category ? <span>{post.category}</span> : null}
                        <span>{post.readingTimeMinutes} min</span>
                        <span title="Views">👁 {fmt(post.views)}</span>
                        <span>
                          {formatDate(post.updatedAt || post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="admin-post-actions">
                      {post.status === "published" ? (
                        <a
                          href={`/creacity/${post.slug}`}
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
          </>
        ) : null}

        {view === "comments" ? (
          <>
            <div className="admin-head">
              <div>
                <h1>Comments</h1>
                <p>Auto-published. Delete anything you don&apos;t want public.</p>
              </div>
              <button
                type="button"
                className="admin-refresh"
                onClick={loadComments}
                disabled={commentsLoading}
              >
                ↻ Refresh
              </button>
            </div>

            {commentsError ? <div className="admin-error">{commentsError}</div> : null}

            {commentsLoading ? (
              <div className="admin-loader inline">
                <span className="admin-spinner" />
                <p>Loading comments…</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="admin-empty">
                <h3>No comments yet</h3>
                <p>Comments left on your lessons will appear here for moderation.</p>
              </div>
            ) : (
              <ul className="admin-comment-list">
                {comments.map((comment) => (
                  <li key={comment.id} className="admin-comment">
                    <div className="admin-comment-avatar" aria-hidden="true">
                      {(comment.name || "A").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="admin-comment-main">
                      <div className="admin-comment-head">
                        <strong>{comment.name}</strong>
                        {comment.country ? (
                          <span className="admin-comment-loc">{comment.country}</span>
                        ) : null}
                        <span className="admin-comment-date">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="admin-comment-text">{comment.body}</p>
                      <div className="admin-comment-foot">
                        {comment.postSlug ? (
                          <a
                            href={`/creacity/${comment.postSlug}#comments`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            on “{comment.postTitle || comment.postSlug}” ↗
                          </a>
                        ) : (
                          <span>on “{comment.postTitle || "lesson"}”</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="admin-comment-delete"
                      onClick={() => deleteComment(comment)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}

        {view === "insights" ? (
          <>
            <div className="admin-head">
              <div>
                <h1>Insights</h1>
                <p>
                  {fmt(stats.views)} total views across {insights.length} lesson
                  {insights.length === 1 ? "" : "s"}
                </p>
              </div>
              <button type="button" className="admin-refresh" onClick={load} disabled={loading}>
                ↻ Refresh
              </button>
            </div>

            {loading ? (
              <div className="admin-loader inline">
                <span className="admin-spinner" />
                <p>Loading insights…</p>
              </div>
            ) : insights.length === 0 ? (
              <div className="admin-empty">
                <h3>No views yet</h3>
                <p>Once people start reading your lessons, view counts and locations show up here.</p>
              </div>
            ) : (
              <div className="admin-insight-list">
                {insights.map((post) => {
                  const countries = topEntries(post.byCountry, 6);
                  const cities = topEntries(post.byCity, 6);
                  return (
                    <div key={post.id} className="admin-insight">
                      <div className="admin-insight-top">
                        <div className="admin-insight-title">{post.title || "Untitled"}</div>
                        <div className="admin-insight-views">
                          <strong>{fmt(post.views)}</strong> views
                        </div>
                      </div>
                      <div className="admin-insight-cols">
                        <div className="admin-insight-col">
                          <h4>Top countries</h4>
                          {countries.length ? (
                            <ul>
                              {countries.map(([key, value]) => (
                                <li key={key}>
                                  <span>{key}</span>
                                  <span>{fmt(value)}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="admin-insight-empty">No location data yet.</p>
                          )}
                        </div>
                        <div className="admin-insight-col">
                          <h4>Top cities</h4>
                          {cities.length ? (
                            <ul>
                              {cities.map(([key, value]) => (
                                <li key={key}>
                                  <span>{key}</span>
                                  <span>{fmt(value)}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="admin-insight-empty">No city data yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : null}

        {view === "categories" ? (
          <>
            <div className="admin-head">
              <div>
                <h1>Categories</h1>
                <p>Create your own topics. They&apos;re suggested in the editor and power filters.</p>
              </div>
            </div>

            <form className="cat-add" onSubmit={addCategory}>
              <input
                type="text"
                className="admin-search"
                placeholder="New category name…"
                value={catInput}
                onChange={(e) => setCatInput(e.target.value)}
                maxLength={80}
              />
              <button type="submit" className="btn btn-glow" disabled={catBusy || !catInput.trim()}>
                {catBusy ? "Adding…" : "+ Add category"}
              </button>
            </form>
            {catError ? <div className="admin-error">{catError}</div> : null}

            {categories.length === 0 ? (
              <p className="admin-insight-empty">No categories yet — add your first above.</p>
            ) : (
              <div className="cat-chips">
                {categories.map((name) => (
                  <span key={name} className="pop-chip">
                    {name}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : null}
      </main>

      {editorOpen ? (
        <PostEditorModal
          key={editingPost?.id || "new"}
          post={editingPost}
          config={EDITOR_CONFIG}
          onClose={() => setEditorOpen(false)}
          onSaved={handleSaved}
        />
      ) : null}
    </div>
  );
}

function AdminRoot() {
  const { theme } = useTheme();
  return (
    <div className="admin-root" data-theme={theme}>
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
  );
}

export default function CreacityAdminPage() {
  return (
    <>
      <Head>
        <title>Creacity Studio · Imagicity</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider defaultTheme="light">
        <AdminRoot />
      </ThemeProvider>
    </>
  );
}
