"use client";

import { useState } from "react";
import { BlogEditor } from "@/components/admin/blogs/BlogEditor";
import { BlogList } from "@/components/admin/blogs/BlogList";
import type { BlogPost } from "@/types/blog";

export default function BlogAdminPage() {
  const [selected, setSelected] = useState<BlogPost | null>(null);

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-10">
      <h1 className="text-3xl font-bold text-white">Blog CMS</h1>
      <p className="text-sm text-slate-400">Full-stack SEO-focused blog system with Firebase.</p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
        <BlogList onSelect={setSelected} />
        <BlogEditor
          selectedBlog={selected}
          onSaved={(blog) => setSelected(blog)}
          onDuplicated={(blog) => setSelected(blog)}
          onDeleted={() => setSelected(null)}
        />
      </div>
    </div>
  );
}
