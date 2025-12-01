"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import slugify from "slugify";
import type { Post, PostInput, RobotsFollow, RobotsIndex, SchemaType } from "@/lib/blog-engine/models";
import { estimateReadingTime } from "@/lib/blog-engine/readingTime";
import { generateTocFromHtml } from "@/lib/blog-engine/toc";

const primaryCategories = ["Strategy", "SEO", "Design", "Development", "Growth"];
const authors = [
  { id: "sara", name: "Sara Delgado" },
  { id: "matt", name: "Matt Kim" },
  { id: "casey", name: "Casey Bowen" }
];

const schemaOptions: SchemaType[] = ["Article", "BlogPosting", "FAQ", "HowTo"];

interface Props {
  active?: Post | null;
  onSubmit: (payload: PostInput) => Promise<void> | void;
}

const formatDate = (value?: Date | string) =>
  value ? new Date(value).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);

const useCharacterCount = (value: string) => ({ count: value.length, remaining: Math.max(0, 160 - value.length) });

const PostForm = ({ active, onSubmit }: Props) => {
  const [form, setForm] = useState<PostInput>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImageUrl: "",
    featuredImageAlt: "",
    category: "",
    tags: [],
    status: "Draft",
    authorId: authors[0].id,
    publishDate: new Date().toISOString(),
    schemaType: "BlogPosting",
    tocEnabled: true,
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: "",
    robotsIndex: "index",
    robotsFollow: "follow",
    redirects: []
  });
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active) return;
    setForm({
      ...active,
      publishDate: formatDate(active.publishDate),
      createdAt: undefined,
      updatedAt: undefined
    });
  }, [active]);

  const readingTime = useMemo(() => estimateReadingTime(form.content || ""), [form.content]);
  const toc = useMemo(() => (form.tocEnabled ? generateTocFromHtml(form.content || "") : []), [form.content, form.tocEnabled]);
  const metaCount = useCharacterCount(form.metaDescription || "");

  const addTag = () => {
    const next = tagInput.trim();
    if (!next) return;
    const tags = Array.from(new Set([...(form.tags || []), next])).slice(0, 8);
    setForm((prev) => ({ ...prev, tags }));
    setTagInput("");
  };

  const removeTag = (tag: string) => setForm((prev) => ({ ...prev, tags: (prev.tags || []).filter((t) => t !== tag) }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: PostInput = {
        ...form,
        slug: slugify(form.slug ?? form.title ?? "", { lower: true, strict: true }),
        readingTime,
        toc,
        isPublished: form.status === "Published",
        publishDate: form.publishDate ? new Date(form.publishDate) : new Date()
      };
      await onSubmit(payload);
      setForm((prev) => ({ ...prev, id: undefined }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && <div className="rounded-lg bg-red-900/30 border border-red-500 text-red-100 p-3 text-sm">{error}</div>}

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Title (H1)</label>
          <input
            type="text"
            className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                title: e.target.value,
                seoTitle: prev.seoTitle || e.target.value,
                slug: slugify(e.target.value, { lower: true, strict: true })
              }))
            }
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">URL Slug</label>
          <input
            type="text"
            className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value, { lower: true, strict: true }) }))}
            required
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Excerpt</label>
          <textarea
            className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
            value={form.excerpt}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            minLength={40}
            maxLength={260}
            required
          />
          <p className="text-xs text-slate-500">Manual excerpt for previews.</p>
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-slate-300">Featured image URL</label>
          <input
            type="url"
            className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
            value={form.featuredImageUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, featuredImageUrl: e.target.value }))}
            required
          />
          <label className="text-sm text-slate-300">Featured image alt text</label>
          <input
            type="text"
            className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
            value={form.featuredImageAlt}
            onChange={(e) => setForm((prev) => ({ ...prev, featuredImageAlt: e.target.value }))}
            required
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Content (HTML supported)</label>
          <textarea
            className="min-h-[220px] w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            required
          />
          <p className="text-xs text-slate-500">Supports H2/H3, lists, embeds. Reading time auto: {readingTime} min.</p>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm text-slate-300">Category</label>
            <select
              className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Select primary category</option>
              {primaryCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-slate-300">Tags (4-8)</label>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
              />
              <button type="button" className="rounded-lg bg-slate-800 px-3 text-orange-200" onClick={addTag}>
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.tags || []).map((tag) => (
                <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-orange-200">
                  {tag} <button type="button" className="ml-1" onClick={() => removeTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-slate-300">Author</label>
            <select
              className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
              value={form.authorId}
              onChange={(e) => setForm((prev) => ({ ...prev, authorId: e.target.value }))}
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-slate-300">Publish date</label>
            <input
              type="datetime-local"
              className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
              value={formatDate(form.publishDate as Date | string)}
              onChange={(e) => setForm((prev) => ({ ...prev, publishDate: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-300">Status</label>
              <select
                className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Post["status"] }))}
              >
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Published">Published</option>
                <option value="Private">Private</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300">Schema type</label>
              <select
                className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
                value={form.schemaType}
                onChange={(e) => setForm((prev) => ({ ...prev, schemaType: e.target.value as SchemaType }))}
              >
                {schemaOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-slate-300">SEO title</label>
          <input
            type="text"
            className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
            value={form.seoTitle}
            maxLength={70}
            onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
            required
          />
          <label className="text-sm text-slate-300">Meta description</label>
          <textarea
            className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
            value={form.metaDescription}
            maxLength={160}
            onChange={(e) => setForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
            required
          />
          <p className="text-xs text-slate-500">{metaCount.count} / 160 characters</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Canonical URL</label>
          <input
            type="url"
            className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
            value={form.canonicalUrl || ""}
            onChange={(e) => setForm((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
          />
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-300">Robots Index</label>
              <select
                className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
                value={form.robotsIndex}
                onChange={(e) => setForm((prev) => ({ ...prev, robotsIndex: e.target.value as RobotsIndex }))}
              >
                <option value="index">Index</option>
                <option value="noindex">Noindex</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300">Robots Follow</label>
              <select
                className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
                value={form.robotsFollow}
                onChange={(e) => setForm((prev) => ({ ...prev, robotsFollow: e.target.value as RobotsFollow }))}
              >
                <option value="follow">Follow</option>
                <option value="nofollow">Nofollow</option>
              </select>
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-slate-300">Open Graph title</label>
            <input
              type="text"
              className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
              value={form.ogTitle || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, ogTitle: e.target.value }))}
            />
            <label className="text-sm text-slate-300">Open Graph description</label>
            <textarea
              className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
              value={form.ogDescription || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, ogDescription: e.target.value }))}
            />
            <label className="text-sm text-slate-300">Open Graph image URL</label>
            <input
              type="url"
              className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-white"
              value={form.ogImageUrl || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, ogImageUrl: e.target.value }))}
            />
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-200">
        <div className="flex flex-col">
          <span>Reading time: {readingTime} min</span>
          <span>TOC enabled: {form.tocEnabled ? "Yes" : "No"}</span>
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.tocEnabled}
              onChange={(e) => setForm((prev) => ({ ...prev, tocEnabled: e.target.checked }))}
            />
            Auto-generate table of contents
          </label>
          <button
            type="submit"
            className="rounded-full bg-orange-400 px-5 py-2 text-black font-semibold shadow-lg shadow-orange-400/30 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : form.id ? "Update post" : "Publish post"}
          </button>
        </div>
      </section>
    </form>
  );
};

export default PostForm;
