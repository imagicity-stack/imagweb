"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import slugify from "slugify";
import type {
  BlogPostDocument,
  BlogPostInput,
  RobotsFollow,
  RobotsIndex,
  SchemaType
} from "@/lib/blog-engine/models";
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
  active?: BlogPostDocument | null;
  onSubmit: (payload: BlogPostInput) => Promise<void> | void;
}

const formatDate = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);

const useCharacterCount = (value: string) => ({ count: value.length, remaining: Math.max(0, 160 - value.length) });

const defaultOg = {
  title: "",
  description: ""
};

const PostForm = ({ active, onSubmit }: Props) => {
  const [form, setForm] = useState<BlogPostInput>({
    title: "",
    slug: "",
    excerpt: "",
    contentHtml: "",
    featuredImage: { url: "", alt: "" },
    category: "",
    tags: [],
    status: "draft",
    authorId: authors[0].id,
    publishedAt: new Date().toISOString(),
    schemaType: "BlogPosting",
    tableOfContentsEnabled: true,
    readingTimeMinutes: 1,
    seo: {
      seoTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      robots: { index: "index", follow: "follow" },
      openGraph: defaultOg
    },
    internalLinks: [],
    redirectFrom: []
  });
  const [suggestions, setSuggestions] = useState<BlogPostDocument[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ ...active });
  }, [active]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setSuggestions(data.data || []))
      .catch(() => setSuggestions([]));
  }, []);

  const seoCount = useCharacterCount(form.seo?.metaDescription || "");
  const seoTitleCount = useCharacterCount(form.seo?.seoTitle || "");

  const headingPreview = useMemo(() => generateTocFromHtml(form.contentHtml || ""), [form.contentHtml]);

  const updateField = (key: keyof BlogPostInput, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    setForm((prev) => ({ ...prev, tags: Array.from(new Set([...(prev.tags || []), tag.trim()])).slice(0, 8) }));
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: (prev.tags || []).filter((t) => t !== tag) }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const readingTime = estimateReadingTime(form.contentHtml || "");
    const slug = slugify(form.slug || form.title || "", { lower: true, strict: true });

    const payload: BlogPostInput = {
      ...form,
      slug,
      readingTimeMinutes: readingTime,
      toc: form.tableOfContentsEnabled ? headingPreview : [],
      publishedAt: form.publishedAt || new Date().toISOString(),
      overrideSlug: form.slug
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const addInternalLink = (slug: string) => {
    setForm((prev) => ({ ...prev, internalLinks: Array.from(new Set([...(prev.internalLinks || []), slug])).slice(0, 5) }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-400">Content</p>
            <h1 className="text-2xl font-semibold">Title & URL</h1>
          </div>
          <span className="text-xs text-slate-400">H1 enforced</span>
        </div>
        <input
          required
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="H1 title"
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-white"
        />
        <div className="grid md:grid-cols-2 gap-3">
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">Slug (manual override)</span>
            <input
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="custom-url-slug"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">Canonical URL</span>
            <input
              value={form.canonicalUrl || ""}
              onChange={(e) => updateField("canonicalUrl", e.target.value)}
              placeholder="https://domain.com/blog/post"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Body</h2>
            <span className="text-xs text-slate-400">Supports H2/H3, lists, embeds</span>
          </div>
          <textarea
            required
            value={form.contentHtml}
            onChange={(e) => updateField("contentHtml", e.target.value)}
            rows={12}
            placeholder="Write clean HTML or markdown-rendered HTML..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
          />
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Reading time: ~{estimateReadingTime(form.contentHtml || "")} min</span>
            <span className="w-px h-4 bg-slate-700" />
            <span>TOC items: {headingPreview.length}</span>
            <label className="flex items-center gap-2 text-slate-200">
              <input
                type="checkbox"
                checked={form.tableOfContentsEnabled}
                onChange={(e) => updateField("tableOfContentsEnabled", e.target.checked)}
                className="accent-orange-400"
              />
              Auto-generate table of contents
            </label>
          </div>
        </div>
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="font-semibold">Featured Image</h3>
          <input
            type="url"
            required
            value={form.featuredImage?.url || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, featuredImage: { ...(prev.featuredImage || {}), url: e.target.value } }))
            }
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
          />
          <input
            type="text"
            required
            value={form.featuredImage?.alt || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, featuredImage: { ...(prev.featuredImage || {}), alt: e.target.value } }))
            }
            placeholder="Alt text (required)"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
          />
          <p className="text-xs text-slate-400">Provide compressed assets; replacing the URL overwrites the previous image.</p>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">Primary category</span>
            <select
              required
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
            >
              <option value="" disabled>
                Choose one
              </option>
              {primaryCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">Author</span>
            <select
              required
              value={form.authorId}
              onChange={(e) => updateField("authorId", e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">Publish date</span>
            <input
              type="datetime-local"
              value={formatDate(form.publishedAt)}
              onChange={(e) => updateField("publishedAt", e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">Schema type</span>
            <select
              value={form.schemaType}
              onChange={(e) => updateField("schemaType", e.target.value as SchemaType)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
            >
              {schemaOptions.map((schema) => (
                <option key={schema} value={schema}>
                  {schema}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Tags (4-8)</span>
              <span className="text-xs text-slate-500">{form.tags?.length || 0}/8</span>
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
              />
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.tags || []).map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="rounded-full border border-orange-400/70 bg-orange-500/10 px-3 py-1 text-xs text-orange-100"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">Excerpt</span>
            <textarea
              required
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
            />
            <span className="text-xs text-slate-500">Aim for 40-260 characters.</span>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">Status</span>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="private">Private</option>
            </select>
          </label>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-200">
              <span>SEO title</span>
              <span className="text-xs text-slate-500">{seoTitleCount.count}/70</span>
            </div>
            <input
              value={form.seo?.seoTitle || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  seo: { ...(prev.seo || {}), seoTitle: e.target.value }
                }))
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            />
            <div className="flex items-center justify-between text-sm text-slate-200">
              <span>Meta description</span>
              <span className="text-xs text-slate-500">{seoCount.count}/160</span>
            </div>
            <textarea
              value={form.seo?.metaDescription || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  seo: { ...(prev.seo || {}), metaDescription: e.target.value }
                }))
              }
              rows={3}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            />
            <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300">
              <p className="font-semibold text-slate-100">Snippet preview</p>
              <p className="text-orange-200">{form.seo?.seoTitle || form.title}</p>
              <p>{form.seo?.metaDescription || form.excerpt}</p>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <span className="text-slate-300">Open Graph</span>
            <input
              placeholder="OG title"
              value={form.seo?.openGraph?.title || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  seo: { ...(prev.seo || {}), openGraph: { ...(prev.seo?.openGraph || defaultOg), title: e.target.value } }
                }))
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            />
            <input
              placeholder="OG description"
              value={form.seo?.openGraph?.description || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  seo: {
                    ...(prev.seo || {}),
                    openGraph: { ...(prev.seo?.openGraph || defaultOg), description: e.target.value }
                  }
                }))
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            />
            <input
              placeholder="OG image URL"
              value={form.seo?.openGraph?.image?.url || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  seo: {
                    ...(prev.seo || {}),
                    openGraph: {
                      ...(prev.seo?.openGraph || defaultOg),
                      image: { ...(prev.seo?.openGraph?.image || {}), url: e.target.value }
                    }
                  }
                }))
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            />
            <input
              placeholder="OG image alt text"
              value={form.seo?.openGraph?.image?.alt || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  seo: {
                    ...(prev.seo || {}),
                    openGraph: {
                      ...(prev.seo?.openGraph || defaultOg),
                      image: { ...(prev.seo?.openGraph?.image || {}), alt: e.target.value }
                    }
                  }
                }))
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            />
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="font-semibold">Robots</h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            <label className="space-y-1">
              <span>Index</span>
              <select
                value={form.seo?.robots.index}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: {
                      ...(prev.seo || {}),
                      robots: { ...(prev.seo?.robots || {}), index: e.target.value as RobotsIndex }
                    }
                  }))
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
              >
                <option value="index">Index</option>
                <option value="noindex">Noindex</option>
              </select>
            </label>
            <label className="space-y-1">
              <span>Follow</span>
              <select
                value={form.seo?.robots.follow}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: {
                      ...(prev.seo || {}),
                      robots: { ...(prev.seo?.robots || {}), follow: e.target.value as RobotsFollow }
                    }
                  }))
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
              >
                <option value="follow">Follow</option>
                <option value="nofollow">Nofollow</option>
              </select>
            </label>
          </div>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">Reading time</span>
            <input
              type="number"
              min={1}
              value={form.readingTimeMinutes}
              onChange={(e) => updateField("readingTimeMinutes", Number(e.target.value))}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            />
          </label>
        </div>
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="font-semibold">Internal Links</h3>
          <div className="space-y-2 text-sm">
            <p className="text-slate-400">Tap to add suggestions (max 5).</p>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {suggestions.map((post) => (
                <button
                  type="button"
                  key={post.id}
                  onClick={() => addInternalLink(post.slug)}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-left hover:border-orange-400"
                >
                  <span className="block text-slate-100">{post.title}</span>
                  <span className="text-xs text-slate-500">/{post.slug}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.internalLinks || []).map((link) => (
                <span
                  key={link}
                  className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-100 border border-orange-400/60"
                >
                  {link}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="font-semibold">Versioning</h3>
          <p className="text-sm text-slate-400">New versions are created on each save. Slug changes create 301 redirects automatically.</p>
          <div className="space-y-2 text-xs text-slate-400">
            <p>Previous slugs will be stored as redirects:</p>
            <div className="flex flex-wrap gap-2">
              {(form.redirectFrom || []).map((slug) => (
                <span key={slug} className="rounded-full bg-slate-800 px-3 py-1 text-orange-100 border border-orange-400/50">
                  /{slug}
                </span>
              ))}
              {!form.redirectFrom?.length && <span className="text-slate-500">No legacy slugs yet.</span>}
            </div>
          </div>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">Status control</span>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="private">Private</option>
            </select>
          </label>
        </div>
      </section>

      {error && <p className="text-sm text-rose-300">{error}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white">
          Save post
        </button>
        <span className="text-xs text-slate-400">Slug redirects and sitemap updates run automatically.</span>
      </div>
    </form>
  );
};

export default PostForm;
