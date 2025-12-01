"use client";

import { useEffect, useState } from "react";
import PostForm from "@/components/blog-admin/PostForm";
import type { BlogPostDocument, BlogPostInput } from "@/lib/blog-engine/models";

const AdminPostsPage = () => {
  const [active, setActive] = useState<BlogPostDocument | null>(null);
  const [posts, setPosts] = useState<BlogPostDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    const res = await fetch("/api/posts");
    const json = await res.json();
    setPosts(json.data || []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPosts();
  }, []);

  const savePost = async (payload: BlogPostInput) => {
    setMessage(null);
    const method = payload.id ? "PUT" : "POST";
    const endpoint = payload.id ? `/api/posts/${payload.id}` : "/api/posts";
    const res = await fetch(endpoint, {
      method,
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Unable to save post");
    }
    setMessage("Saved with SEO, redirects, and sitemap updates");
    setActive(null);
    await loadPosts();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
        <div>
          <p className="text-xs text-slate-400">Imagweb CMS</p>
          <h1 className="text-2xl font-semibold">Blog Publishing Hub</h1>
          <p className="text-sm text-slate-400">SEO-first layout, redirects, and TOC automation.</p>
        </div>
        <span className="text-xs text-orange-300">{loading ? "Syncing posts..." : "Up to date"}</span>
      </header>

      <main className="grid lg:grid-cols-3 gap-6 p-6">
        <section className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{active ? "Edit post" : "Create new post"}</h2>
            {message && <span className="text-xs text-emerald-300">{message}</span>}
          </div>
          <PostForm active={active} onSubmit={savePost} />
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Versioned posts</h2>
            {loading && <span className="text-xs text-orange-300">Loading...</span>}
          </div>
          <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">{post.category}</p>
                    <p className="font-semibold text-white">{post.title}</p>
                    <p className="text-xs text-slate-500">/{post.slug}</p>
                  </div>
                  <span className="text-xs text-slate-400">v{post.version}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Status: {post.status}</span>
                  <span className="w-px h-3 bg-slate-800" />
                  <span>{post.tags?.slice(0, 3).join(", ")}</span>
                  <span className="w-px h-3 bg-slate-800" />
                  <span>{post.readingTimeMinutes} min read</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <button
                    className="text-orange-300 hover:text-orange-200"
                    onClick={() => setActive(post)}
                  >
                    Edit
                  </button>
                </div>
              </article>
            ))}
            {!posts.length && !loading && <p className="text-sm text-slate-400">No posts yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPostsPage;
