import { useEffect, useMemo, useState } from "react";
import type { BlogPost, BlogPostInput } from "@/lib/blogService";
import { createSlug, uploadFeaturedImage } from "@/lib/blogService";

interface Props {
  onSubmit: (data: BlogPostInput, id?: string) => Promise<void>;
  activePost?: BlogPost | null;
  onCancelEdit: () => void;
}

const defaultState: BlogPostInput = {
  title: "",
  metaTitle: "",
  metaDescription: "",
  featuredImageUrl: "",
  category: "General",
  tags: [],
  intro: "",
  content: "",
  author: "",
  isPublished: false
};

const AdminBlogForm = ({ onSubmit, activePost, onCancelEdit }: Props) => {
  const [form, setForm] = useState<BlogPostInput>(defaultState);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (activePost) {
      setForm({ ...activePost });
    } else {
      setForm(defaultState);
    }
  }, [activePost]);

  const slug = useMemo(() => (form.title ? createSlug(form.title) : ""), [form.title]);

  const handleChange = <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFeaturedImage(file, form.title ? createSlug(form.title) : "image");
      setForm((prev) => ({ ...prev, featuredImageUrl: url }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await onSubmit({ ...form, slug: form.slug || slug });
    if (!activePost) {
      setForm(defaultState);
    }
    setBusy(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Title</span>
          <input
            required
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Meta Title</span>
          <input
            value={form.metaTitle}
            onChange={(e) => handleChange("metaTitle", e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-slate-300">Meta Description</span>
          <textarea
            value={form.metaDescription}
            onChange={(e) => handleChange("metaDescription", e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white"
            rows={2}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Category</span>
          <input
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Tags (comma separated)</span>
          <input
            value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}
            onChange={(e) => handleChange("tags", e.target.value.split(",").map((t) => t.trim()))}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Author</span>
          <input
            value={form.author}
            onChange={(e) => handleChange("author", e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Intro</span>
          <textarea
            value={form.intro}
            onChange={(e) => handleChange("intro", e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white"
            rows={3}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Content (Markdown)</span>
          <textarea
            value={form.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white"
            rows={8}
          />
        </label>
        <div className="space-y-2">
          <span className="text-sm text-slate-300">Featured Image URL</span>
          <input
            value={form.featuredImageUrl}
            onChange={(e) => handleChange("featuredImageUrl", e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white"
            placeholder="Or upload below"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            className="text-sm text-slate-200"
            disabled={uploading}
          />
          {uploading && <p className="text-xs text-cyan-300">Uploading image...</p>}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => handleChange("isPublished", e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm text-slate-200">Published</span>
        </div>
        <div className="text-sm text-slate-400">Slug preview: <span className="text-cyan-300">{form.slug || slug}</span></div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-60"
        >
          {busy ? "Saving..." : activePost ? "Update Post" : "Create Post"}
        </button>
        {activePost && (
          <button type="button" onClick={onCancelEdit} className="text-slate-300 hover:text-white">
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default AdminBlogForm;
