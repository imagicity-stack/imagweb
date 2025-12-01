"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { BlogPost, BlogStatus, SchemaType } from "@/types/blog";
import { createSlug, generateTableOfContents, getReadingTime, getWordCount } from "@/lib/cms/utils";
import { uploadImage, listBlogMedia } from "@/lib/cms/storage";

const defaultBlog: BlogPost = {
  title: "",
  slug: "",
  featuredImage: "",
  featuredImageAlt: "",
  category: "General",
  tags: [],
  excerpt: "",
  authorId: "",
  status: "draft",
  publishDate: new Date().toISOString(),
  contentHtml: "",
  tableOfContents: [],
  readingTime: 1,
  wordCount: 0,
  seo: {
    seoTitle: "",
    metaDescription: "",
    focusKeyword: "",
    secondaryKeywords: [],
    canonicalUrl: "",
    openGraphTitle: "",
    openGraphDescription: "",
    openGraphImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: ""
  },
  schemaType: "BlogPosting",
  internalLinks: [],
  cta: { ctaEnabled: false, ctaLink: "", ctaText: "", newsletterEmbed: "" }
};

const statusOptions: BlogStatus[] = ["draft", "scheduled", "published", "private"];
const schemaOptions: SchemaType[] = ["Article", "BlogPosting", "FAQ", "HowTo", "CaseStudy", "Review"];

const ToolbarButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded border border-slate-700 px-2 py-1 text-xs text-white hover:border-orange-400 hover:text-orange-200"
  >
    {label}
  </button>
);

interface Props {
  selectedBlog?: BlogPost | null;
  onSaved?: (blog: BlogPost) => void;
  onDeleted?: (id: string) => void;
  onDuplicated?: (blog: BlogPost) => void;
  suggestions?: BlogPost[];
}

export function BlogEditor({ selectedBlog, onSaved, onDeleted, onDuplicated, suggestions = [] }: Props) {
  const [blog, setBlog] = useState<BlogPost>(selectedBlog || defaultBlog);
  const [content, setContent] = useState(selectedBlog?.contentHtml || "");
  const [internalSuggestions, setInternalSuggestions] = useState<BlogPost[]>(suggestions);
  const [saving, setSaving] = useState(false);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const [mediaLibrary, setMediaLibrary] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setBlog(selectedBlog || defaultBlog);
    setContent(selectedBlog?.contentHtml || "");
  }, [selectedBlog]);

  useEffect(() => {
    if (!blog.id) return;
    listBlogMedia(blog.id).then(setMediaLibrary).catch(() => setMediaLibrary([]));
  }, [blog.id]);

  const readingMetrics = useMemo(() => {
    const wordCount = getWordCount(content);
    return {
      wordCount,
      readingTime: getReadingTime(wordCount),
      tableOfContents: generateTableOfContents(content)
    };
  }, [content]);

  useEffect(() => {
    const queryText = `${blog.title} ${blog.category} ${blog.tags.join(" ")}`.trim();
    if (!queryText) return;
    const controller = new AbortController();
    fetch(`/api/internal-links?q=${encodeURIComponent(queryText)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then(setInternalSuggestions)
      .catch(() => undefined);
    return () => controller.abort();
  }, [blog.title, blog.category, blog.tags]);

  const handleSave = useCallback(async (isAutosave = false) => {
    if (!blog.title) return;
    setSaving(true);
    const payload: BlogPost = {
      ...blog,
      slug: blog.slug || createSlug(blog.title),
      contentHtml: content,
      ...readingMetrics,
      status: blog.status || "draft",
      tableOfContents: readingMetrics.tableOfContents,
      readingTime: readingMetrics.readingTime,
      wordCount: readingMetrics.wordCount
    };

    const method = blog.id ? "PUT" : "POST";
    const endpoint = blog.id ? `/api/blogs/${blog.id}` : "/api/blogs";
    const res = await fetch(endpoint, {
      method,
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to save blog");
    const saved = (await res.json()) as BlogPost;
    setBlog(saved);
    setContent(saved.contentHtml);
    onSaved?.(saved);
    if (!isAutosave && !mediaLibrary.length && saved.id) {
      listBlogMedia(saved.id).then(setMediaLibrary);
    }
    setSaving(false);
  }, [blog, content, mediaLibrary.length, onSaved, readingMetrics]);

  useEffect(() => {
    if (!autosaveEnabled) return;
    const interval = setInterval(() => {
      handleSave(true).catch(() => undefined);
    }, 10000);
    return () => clearInterval(interval);
  }, [autosaveEnabled, handleSave]);

  const updateField = <K extends keyof BlogPost>(key: K, value: BlogPost[K]) => {
    setBlog((prev) => ({ ...prev, [key]: value }));
  };

  const handleContentCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    const newContent = (document.getElementById("blog-editor")?.innerHTML || "").trim();
    setContent(newContent);
  };

  const handleImageInsert = async (file: File) => {
    try {
      setUploading(true);
      const targetId = blog.id || blog.slug || "draft";
      const url = await uploadImage(file, targetId, `${createSlug(file.name)}-${Date.now()}`);
      const imgHtml = `<img src="${url}" alt="${blog.featuredImageAlt || blog.title}" loading="lazy" decoding="async" />`;
      setContent((prev) => `${prev}\n${imgHtml}`);
      return url;
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!blog.id) return;
    await fetch(`/api/blogs/${blog.id}`, { method: "DELETE" });
    onDeleted?.(blog.id);
    setBlog(defaultBlog);
    setContent("");
  };

  const handleDuplicate = async () => {
    if (!blog.id) return;
    const res = await fetch(`/api/blogs/${blog.id}/duplicate`, { method: "POST" });
    const dup = await res.json();
    onDuplicated?.(dup);
  };

  const handleSlugChange = (value: string) => {
    if (blog.id && blog.slug !== value) {
      const confirmChange = window.confirm("Changing the slug will create a redirect. Proceed?");
      if (!confirmChange) return;
    }
    updateField("slug", value);
  };

  const toggleTag = (tag: string) => {
    setBlog((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag]
    }));
  };

  return (
    <div className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Blog Editor</h2>
          <p className="text-sm text-slate-400">Auto-save every 10s. Reading time and TOC auto-generated.</p>
          <label className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <input type="checkbox" checked={autosaveEnabled} onChange={(e) => setAutosaveEnabled(e.target.checked)} /> Auto-save
          </label>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => handleSave(false)}
            className="rounded bg-orange-400 px-4 py-2 font-semibold text-black hover:bg-orange-300"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleDuplicate}
            className="rounded border border-slate-700 px-4 py-2 hover:border-orange-300"
            disabled={!blog.id}
          >
            Duplicate
          </button>
          <button
            onClick={handleDelete}
            className="rounded border border-red-500 px-4 py-2 text-red-200 hover:bg-red-500/20"
            disabled={!blog.id}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Title (H1)</span>
          <input
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            value={blog.title}
            onChange={(e) => {
              const value = e.target.value;
              updateField("title", value);
              if (!blog.slug) updateField("slug", createSlug(value));
            }}
            placeholder="Headline"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Slug</span>
          <input
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            value={blog.slug}
            onChange={(e) => handleSlugChange(createSlug(e.target.value))}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Featured Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await handleImageInsert(file);
              if (url) updateField("featuredImage", url);
            }}
          />
          <input
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="or paste URL"
            value={blog.featuredImage}
            onChange={(e) => updateField("featuredImage", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Featured Image Alt (required)</span>
          <input
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            value={blog.featuredImageAlt}
            onChange={(e) => updateField("featuredImageAlt", e.target.value)}
            required
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span>Category</span>
          <input
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            value={blog.category}
            onChange={(e) => updateField("category", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Tags (4-8)</span>
          <input
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            value={blog.tags.join(", ")}
            onChange={(e) => updateField("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
          />
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            {["design", "seo", "tutorial", "growth", "case-study", "how-to", "review", "news"].map((tag) => (
              <button
                type="button"
                key={tag}
                className={`rounded-full border px-2 py-1 ${blog.tags.includes(tag) ? "border-orange-400 text-orange-200" : "border-slate-700"}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </label>
        <label className="space-y-1 text-sm">
          <span>Author</span>
          <input
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            value={blog.authorId}
            onChange={(e) => updateField("authorId", e.target.value)}
            placeholder="Author ID"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span>Status</span>
          <select
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            value={blog.status}
            onChange={(e) => updateField("status", e.target.value as BlogStatus)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span>Publish Date</span>
          <input
            type="datetime-local"
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            value={blog.publishDate ? blog.publishDate.slice(0, 16) : ""}
            onChange={(e) => updateField("publishDate", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Schema</span>
          <select
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            value={blog.schemaType}
            onChange={(e) => updateField("schemaType", e.target.value as SchemaType)}
          >
            {schemaOptions.map((schema) => (
              <option key={schema} value={schema}>
                {schema}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-1 text-sm">
        <span>Excerpt</span>
        <textarea
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
          value={blog.excerpt}
          onChange={(e) => updateField("excerpt", e.target.value)}
          rows={3}
        />
      </label>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <ToolbarButton label="H2" onClick={() => handleContentCommand("formatBlock", "H2")} />
          <ToolbarButton label="H3" onClick={() => handleContentCommand("formatBlock", "H3")} />
          <ToolbarButton label="Paragraph" onClick={() => handleContentCommand("formatBlock", "P")} />
          <ToolbarButton label="Bullet" onClick={() => handleContentCommand("insertUnorderedList")} />
          <ToolbarButton label="Number" onClick={() => handleContentCommand("insertOrderedList")} />
          <ToolbarButton label="Quote" onClick={() => handleContentCommand("formatBlock", "BLOCKQUOTE")} />
          <ToolbarButton label="Link" onClick={() => handleContentCommand("createLink", prompt("Enter URL") || "")} />
          <label className="cursor-pointer rounded border border-slate-700 px-2 py-1 text-xs text-white hover:border-orange-400">
            Inline Image
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageInsert(e.target.files[0])} />
          </label>
          {uploading && <span className="text-orange-200">Uploading...</span>}
          <span className="ml-auto text-slate-400">{readingMetrics.wordCount} words · {readingMetrics.readingTime} min read</span>
        </div>
        <div
          id="blog-editor"
          className="min-h-[240px] w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 prose prose-invert"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded border border-slate-800 bg-slate-950 p-4">
          <h3 className="text-lg font-semibold">SEO</h3>
          {(
            [
              ["seoTitle", "SEO Title"],
              ["metaDescription", "Meta Description"],
              ["focusKeyword", "Focus Keyword"],
              ["secondaryKeywords", "Secondary Keywords (comma)"],
              ["canonicalUrl", "Canonical URL"],
              ["openGraphTitle", "OG Title"],
              ["openGraphDescription", "OG Description"],
              ["openGraphImage", "OG Image URL"],
              ["twitterTitle", "Twitter Title"],
              ["twitterDescription", "Twitter Description"],
              ["twitterImage", "Twitter Image URL"]
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="space-y-1 text-sm">
              <span>{label}</span>
              <input
                className="w-full rounded border border-slate-800 bg-slate-900 px-3 py-2"
                value={Array.isArray(blog.seo[key as keyof typeof blog.seo]) ? (blog.seo[key as keyof typeof blog.seo] as string[]).join(", ") : (blog.seo[key as keyof typeof blog.seo] as string)}
                onChange={(e) =>
                  updateField("seo", {
                    ...blog.seo,
                    [key]: key === "secondaryKeywords" ? e.target.value.split(",").map((t) => t.trim()).filter(Boolean) : e.target.value
                  })
                }
              />
            </label>
          ))}
        </div>

        <div className="space-y-2 rounded border border-slate-800 bg-slate-950 p-4">
          <h3 className="text-lg font-semibold">CTAs & Marketing</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={blog.cta?.ctaEnabled}
              onChange={(e) => updateField("cta", { ...blog.cta, ctaEnabled: e.target.checked })}
            />
            Enable CTA
          </label>
          <label className="space-y-1 text-sm">
            <span>CTA Text</span>
            <input
              className="w-full rounded border border-slate-800 bg-slate-900 px-3 py-2"
              value={blog.cta?.ctaText || ""}
              onChange={(e) => updateField("cta", { ...blog.cta, ctaText: e.target.value })}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>CTA Link</span>
            <input
              className="w-full rounded border border-slate-800 bg-slate-900 px-3 py-2"
              value={blog.cta?.ctaLink || ""}
              onChange={(e) => updateField("cta", { ...blog.cta, ctaLink: e.target.value })}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Newsletter Embed</span>
            <textarea
              className="w-full rounded border border-slate-800 bg-slate-900 px-3 py-2"
              value={blog.cta?.newsletterEmbed || ""}
              onChange={(e) => updateField("cta", { ...blog.cta, newsletterEmbed: e.target.value })}
              rows={3}
            />
          </label>
          <div className="space-y-2 rounded border border-slate-800 bg-slate-900 p-3 text-sm">
            <div className="font-semibold text-orange-200">Internal Links</div>
            <div className="flex flex-wrap gap-2">
              {internalSuggestions.map((post) => (
                <button
                  type="button"
                  key={post.id}
                  className={`rounded-full border px-3 py-1 ${blog.internalLinks.includes(post.slug) ? "border-orange-400 text-orange-200" : "border-slate-700"}`}
                  onClick={() =>
                    updateField(
                      "internalLinks",
                      blog.internalLinks.includes(post.slug)
                        ? blog.internalLinks.filter((s) => s !== post.slug)
                        : [...blog.internalLinks, post.slug]
                    )
                  }
                >
                  {post.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded border border-slate-800 bg-slate-950 p-4 text-sm">
          <h3 className="text-lg font-semibold">Table of Contents</h3>
          <ul className="space-y-1 text-slate-300">
            {readingMetrics.tableOfContents.map((item) => (
              <li key={item.id} className="flex gap-2">
                <span className="text-orange-300">{item.level === 2 ? "H2" : "H3"}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded border border-slate-800 bg-slate-950 p-4 text-sm">
          <h3 className="text-lg font-semibold">Media Library</h3>
          {blog.id ? (
            <div className="grid grid-cols-2 gap-2">
              {mediaLibrary.map((url) => (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="block rounded border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="media" className="h-24 w-full object-cover" loading="lazy" />
                </a>
              ))}
              {!mediaLibrary.length && <p className="text-slate-400">No media uploaded yet.</p>}
            </div>
          ) : (
            <p className="text-slate-400">Save the draft to load media library.</p>
          )}
        </div>
      </div>
    </div>
  );
}
