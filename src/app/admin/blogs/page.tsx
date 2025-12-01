"use client";

import { useState } from "react";
import { BlogEditor } from "@/components/admin/blogs/BlogEditor";
import { BlogList } from "@/components/admin/blogs/BlogList";
import { Sidebar, Topbar } from "@/components/admin/blogs/AdminUI";
import type { BlogPost } from "@/types/blog";

export default function BlogAdminPage() {
  const [selected, setSelected] = useState<BlogPost | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar onNew={() => setSelected(null)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col gap-2 text-left text-slate-100">
              <h1 className="text-2xl font-semibold">Blog Admin</h1>
              <p className="text-sm text-slate-400">Manage posts, edit content, and publish updates.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
              <BlogList onSelect={setSelected} />
              <BlogEditor
                selectedBlog={selected}
                onSaved={(blog) => setSelected(blog)}
                onDuplicated={(blog) => setSelected(blog)}
                onDeleted={() => setSelected(null)}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
