"use client";

import { useEffect, useState } from "react";
import type { BlogPost } from "@/types/blog";

interface Props {
  onSelect: (blog: BlogPost) => void;
}

export function BlogList({ onSelect }: Props) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filters, setFilters] = useState<{ status?: string; category?: string; authorId?: string }>({});

  const load = async () => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.category) params.set("category", filters.category);
    if (filters.authorId) params.set("authorId", filters.authorId);
    const res = await fetch(`/api/blogs?${params.toString()}`);
    const data = await res.json();
    setBlogs(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.category, filters.authorId]);

  return (
    <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-white">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <h2 className="text-lg font-semibold">Blog Library</h2>
        <select
          className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          value={filters.status || ""}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}
        >
          <option value="">All status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="private">Private</option>
        </select>
        <input
          className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          placeholder="Category"
          value={filters.category || ""}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value || undefined }))}
        />
        <input
          className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          placeholder="Author ID"
          value={filters.authorId || ""}
          onChange={(e) => setFilters((f) => ({ ...f, authorId: e.target.value || undefined }))}
        />
        <button className="ml-auto text-xs text-orange-200 hover:underline" onClick={load}>
          Refresh
        </button>
      </div>
      <div className="divide-y divide-slate-800">
        {blogs.map((blog) => (
          <button
            key={blog.id}
            onClick={() => onSelect(blog)}
            className="flex w-full items-center justify-between py-3 text-left hover:text-orange-200"
          >
            <div>
              <p className="font-semibold">{blog.title}</p>
              <p className="text-xs text-slate-400">{blog.status} · {blog.category} · {blog.tags?.slice(0, 3).join(", ")}</p>
            </div>
            <div className="text-xs text-slate-400">{blog.publishDate?.slice(0, 10)}</div>
          </button>
        ))}
        {!blogs.length && <p className="py-4 text-sm text-slate-400">No posts yet. Create the first one!</p>}
      </div>
    </div>
  );
}
