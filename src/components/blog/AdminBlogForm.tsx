import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BlogPost, BlogPostInput } from "@/lib/blogService";
import { createSlug, uploadBlogImage } from "@/lib/blogService";

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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setUploadError(null);
    try {
      const url = await uploadBlogImage(file, form.title ? createSlug(form.title) : "image");
      setForm((prev) => ({ ...prev, featuredImageUrl: url }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      setUploadError(error instanceof Error ? error.message : "Unable to upload image");
    } finally {
      setUploading(false);
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const computedSlug = form.title ? createSlug(form.title) : form.slug || slug;
    await onSubmit({ ...form, slug: computedSlug });
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
            className="w-full text-sm text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500 file:px-3 file:py-2 file:text-black file:font-semibold"
            disabled={uploading}
            ref={fileInputRef}
          />
          <button
            type="button"
            onClick={openFilePicker}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white transition hover:border hover:border-cyan-300"
          >
            {uploading ? "Uploading..." : form.featuredImageUrl ? "Replace Image" : "Upload featured image"}
          </button>
          {uploading && <p className="text-xs text-cyan-300">Uploading image...</p>}
          {uploadError && <p className="text-xs text-rose-400">{uploadError}</p>}
          {form.featuredImageUrl && (
            <div className="relative mt-2 h-40 w-full overflow-hidden rounded-xl border border-slate-700">
              <Image
                src={form.featuredImageUrl}
                alt={form.title || "Uploaded blog image"}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 420px, 100vw"
              />
            </div>
          )}
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
