"use client";

import { useEffect, useMemo, useState } from "react";
import { BlogTable, Panel, PillButton, TextInput } from "./AdminUI";
import type { BlogPost } from "@/types/blog";

interface Props {
  onSelect: (blog: BlogPost) => void;
}

export function BlogList({ onSelect }: Props) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
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

  const visibleBlogs = useMemo(() => {
    if (!search.trim()) return blogs;
    const query = search.toLowerCase();
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        blog.category?.toLowerCase().includes(query) ||
        blog.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [blogs, search]);

  return (
    <Panel
      title="Blog Dashboard"
      description="Search, filter, and open posts to edit"
      action={
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <PillButton onClick={load} className="!text-orange-200">
            Refresh
          </PillButton>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm shadow-inner">
          <span className="text-slate-500">🔍</span>
          <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, tags, category" />
        </div>
        <select
          className="min-w-[140px] rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white shadow-inner"
          value={filters.status || ""}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}
        >
          <option value="">All status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="private">Private</option>
        </select>
        <TextInput
          className="min-w-[140px]"
          placeholder="Category"
          value={filters.category || ""}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value || undefined }))}
        />
        <TextInput
          className="min-w-[140px]"
          placeholder="Author ID"
          value={filters.authorId || ""}
          onChange={(e) => setFilters((f) => ({ ...f, authorId: e.target.value || undefined }))}
        />
      </div>
      <BlogTable blogs={visibleBlogs} onSelect={onSelect} onRefresh={load} />
    </Panel>
  );
}
