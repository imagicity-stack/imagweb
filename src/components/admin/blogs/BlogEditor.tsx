"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { BlogPost, BlogStatus, SchemaType } from "@/types/blog";
import { createSlug, generateTableOfContents, getReadingTime, getWordCount } from "@/lib/cms/utils";
import { uploadImage, listBlogMedia } from "@/lib/cms/storage";
import {
  CollapsibleCard,
  FieldGroup,
  Panel,
  PillButton,
  TextArea,
  TextInput,
  ToolbarButton
} from "./AdminUI";

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
    <div className="space-y-6 text-slate-100">
      <Panel
        title="Blog Editor"
        description="Auto-save every 10s. Reading time, TOC, and internal links update automatically."
        action={
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input type="checkbox" checked={autosaveEnabled} onChange={(e) => setAutosaveEnabled(e.target.checked)} />
            Auto-save
          </label>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="rounded-full bg-slate-800 px-3 py-1">Words: {readingMetrics.wordCount}</span>
            <span className="rounded-full bg-slate-800 px-3 py-1">Reading time: {readingMetrics.readingTime} min</span>
            <span className="rounded-full bg-slate-800 px-3 py-1">TOC entries: {readingMetrics.tableOfContents.length}</span>
            {uploading && <span className="text-orange-300">Uploading image...</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <PillButton onClick={() => handleSave(false)} disabled={saving} className="!border-orange-400 !text-orange-200">
              {saving ? "Saving..." : "Save draft"}
            </PillButton>
            <PillButton onClick={handleDuplicate} disabled={!blog.id}>
              Duplicate
            </PillButton>
            <PillButton onClick={handleDelete} disabled={!blog.id} className="!border-red-500 !text-red-200">
              Delete
            </PillButton>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          <Panel title="Content" description="Craft the article basics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldGroup label="Title (H1)" description="Primary headline for the article">
                <TextInput
                  value={blog.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateField("title", value);
                    if (!blog.slug) updateField("slug", createSlug(value));
                  }}
                  placeholder="Headline"
                />
              </FieldGroup>
              <FieldGroup label="Slug" description="Auto-generated, editable for redirects">
                <TextInput value={blog.slug} onChange={(e) => handleSlugChange(createSlug(e.target.value))} />
              </FieldGroup>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel
                title="Featured image"
                description="Upload a hero image or paste an existing URL"
                className="space-y-3"
              >
                <div className="grid gap-3">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await handleImageInsert(file);
                      if (url) updateField("featuredImage", url);
                    }}
                  />
                  <TextInput
                    placeholder="Paste image URL"
                    value={blog.featuredImage}
                    onChange={(e) => updateField("featuredImage", e.target.value)}
                  />
                  {blog.featuredImage && (
                    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={blog.featuredImage} alt={blog.featuredImageAlt || blog.title} className="h-40 w-full object-cover" />
                    </div>
                  )}
                </div>
              </Panel>
              <Panel title="Featured image alt" description="Required for accessibility">
                <TextInput
                  value={blog.featuredImageAlt}
                  onChange={(e) => updateField("featuredImageAlt", e.target.value)}
                  required
                />
              </Panel>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <FieldGroup label="Category" description="Organize the post">
                <TextInput value={blog.category} onChange={(e) => updateField("category", e.target.value)} />
              </FieldGroup>
              <FieldGroup label="Tags (4-8)" description="Comma separated or quick-select">
                <div className="space-y-2">
                  <TextInput
                    value={blog.tags.join(", ")}
                    onChange={(e) =>
                      updateField(
                        "tags",
                        e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                  <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                    {["design", "seo", "tutorial", "growth", "case-study", "how-to", "review", "news"].map((tag) => (
                      <PillButton key={tag} type="button" active={blog.tags.includes(tag)} onClick={() => toggleTag(tag)}>
                        {tag}
                      </PillButton>
                    ))}
                  </div>
                </div>
              </FieldGroup>
              <FieldGroup label="Author" description="Owner of the article">
                <TextInput value={blog.authorId} onChange={(e) => updateField("authorId", e.target.value)} placeholder="Author ID" />
              </FieldGroup>
            </div>

            <FieldGroup label="Excerpt" description="Short teaser for previews">
              <TextArea value={blog.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} rows={3} />
            </FieldGroup>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <ToolbarButton label="H2" onClick={() => handleContentCommand("formatBlock", "H2")} />
                <ToolbarButton label="H3" onClick={() => handleContentCommand("formatBlock", "H3")} />
                <ToolbarButton label="Paragraph" onClick={() => handleContentCommand("formatBlock", "P")} />
                <ToolbarButton label="Bullet" onClick={() => handleContentCommand("insertUnorderedList")} />
                <ToolbarButton label="Number" onClick={() => handleContentCommand("insertOrderedList")} />
                <ToolbarButton label="Quote" onClick={() => handleContentCommand("formatBlock", "BLOCKQUOTE")} />
                <ToolbarButton label="Link" onClick={() => handleContentCommand("createLink", prompt("Enter URL") || "")} />
                <ToolbarButton label="Bold" onClick={() => handleContentCommand("bold")} />
                <ToolbarButton label="Italic" onClick={() => handleContentCommand("italic")} />
                <ToolbarButton label="Underline" onClick={() => handleContentCommand("underline")} />
                <ToolbarButton label="Image" onClick={() => document.getElementById("image-upload")?.click()} />
              </div>
              <div
                id="blog-editor"
                className="min-h-[420px] rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-inner focus:outline-none"
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setContent((e.target as HTMLElement).innerHTML)}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Table of Contents" description="Auto-generated headings" className="space-y-3">
                <ul className="space-y-2 text-sm text-slate-200">
                  {readingMetrics.tableOfContents.map((item) => (
                    <li key={item.id} className="flex gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                      <span className="text-orange-300">{item.level === 2 ? "H2" : "H3"}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                  {!readingMetrics.tableOfContents.length && <p className="text-slate-400">Start typing to build the outline.</p>}
                </ul>
              </Panel>
              <MediaLibraryCard mediaLibrary={mediaLibrary} blogId={blog.id} />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <CollapsibleCard title="SEO Panel" description="Meta data and social previews">
            <div className="space-y-3">
              {(
                [
                  ["seoTitle", "SEO Title"],
                  ["metaDescription", "Meta Description"],
                  ["focusKeyword", "Focus Keyword"],
                  ["secondaryKeywords", "Secondary Keywords (comma)"] as const,
                  ["canonicalUrl", "Canonical URL"],
                  ["openGraphTitle", "OG Title"],
                  ["openGraphDescription", "OG Description"],
                  ["openGraphImage", "OG Image URL"],
                  ["twitterTitle", "Twitter Title"],
                  ["twitterDescription", "Twitter Description"],
                  ["twitterImage", "Twitter Image URL"]
                ] as const
              ).map(([key, label]) => (
                <FieldGroup key={key} label={label}>
                  <TextInput
                    value={Array.isArray(blog.seo[key as keyof typeof blog.seo])
                      ? (blog.seo[key as keyof typeof blog.seo] as string[]).join(", ")
                      : (blog.seo[key as keyof typeof blog.seo] as string)}
                    onChange={(e) =>
                      updateField("seo", {
                        ...blog.seo,
                        [key]: key === "secondaryKeywords"
                          ? e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean)
                          : e.target.value
                      })
                    }
                  />
                </FieldGroup>
              ))}
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="Internal Linking Panel" description="Suggested posts and manual selection">
            <div className="space-y-3">
              <div className="grid gap-2 text-sm text-slate-300">
                {internalSuggestions.map((post) => (
                  <PillButton
                    key={post.id}
                    type="button"
                    active={blog.internalLinks.includes(post.slug)}
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
                  </PillButton>
                ))}
                {!internalSuggestions.length && <p className="text-xs text-slate-500">Add a title or category to see suggestions.</p>}
              </div>
              <FieldGroup label="Manual link selector" description="Add slugs manually if needed">
                <TextInput
                  value={blog.internalLinks.join(", ")}
                  onChange={(e) =>
                    updateField(
                      "internalLinks",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </FieldGroup>
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="Schema Panel" description="Choose the schema type">
            <FieldGroup label="Schema type">
              <select
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white shadow-inner"
                value={blog.schemaType}
                onChange={(e) => updateField("schemaType", e.target.value as SchemaType)}
              >
                {schemaOptions.map((schema) => (
                  <option key={schema} value={schema}>
                    {schema}
                  </option>
                ))}
              </select>
            </FieldGroup>
          </CollapsibleCard>

          <CollapsibleCard title="CTA Panel" description="Control the call-to-action module">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={blog.cta?.ctaEnabled}
                  onChange={(e) => updateField("cta", { ...blog.cta, ctaEnabled: e.target.checked })}
                />
                CTA Enabled
              </label>
              <FieldGroup label="CTA Text">
                <TextInput value={blog.cta?.ctaText || ""} onChange={(e) => updateField("cta", { ...blog.cta, ctaText: e.target.value })} />
              </FieldGroup>
              <FieldGroup label="CTA Link">
                <TextInput value={blog.cta?.ctaLink || ""} onChange={(e) => updateField("cta", { ...blog.cta, ctaLink: e.target.value })} />
              </FieldGroup>
              <FieldGroup label="Newsletter Embed" description="Optional embed HTML">
                <TextArea
                  value={blog.cta?.newsletterEmbed || ""}
                  onChange={(e) => updateField("cta", { ...blog.cta, newsletterEmbed: e.target.value })}
                  rows={3}
                />
              </FieldGroup>
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="Publish Panel" description="Status, schedule, and actions">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FieldGroup label="Status">
                  <select
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white shadow-inner"
                    value={blog.status}
                    onChange={(e) => updateField("status", e.target.value as BlogStatus)}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </FieldGroup>
                <FieldGroup label="Publish date">
                  <TextInput
                    type="datetime-local"
                    value={blog.publishDate ? blog.publishDate.slice(0, 16) : ""}
                    onChange={(e) => updateField("publishDate", e.target.value)}
                  />
                </FieldGroup>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <PillButton onClick={() => handleSave(false)} disabled={saving} className="!border-orange-400 !text-orange-200">
                  {saving ? "Saving..." : "Save draft"}
                </PillButton>
                <PillButton
                  onClick={() => handleSave(false)}
                  className="!border-green-400 !text-green-200"
                  disabled={saving}
                >
                  {blog.status === "published" ? "Update" : "Publish"}
                </PillButton>
                <PillButton onClick={handleDuplicate} disabled={!blog.id}>
                  Duplicate
                </PillButton>
                <PillButton onClick={handleDelete} disabled={!blog.id} className="!border-red-500 !text-red-200">
                  Delete
                </PillButton>
              </div>
            </div>
          </CollapsibleCard>
        </div>
      </div>
    </div>
  );
}

function MediaLibraryCard({ mediaLibrary, blogId }: { mediaLibrary: string[]; blogId?: string }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search.trim()) return mediaLibrary;
    return mediaLibrary.filter((url) => url.toLowerCase().includes(search.toLowerCase()));
  }, [mediaLibrary, search]);

  return (
    <Panel
      title="Media Manager"
      description="Browse uploaded assets for this blog"
      action={
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="hidden sm:inline">Filter</span>
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images"
            className="h-8 min-w-[140px]"
          />
        </div>
      }
    >
      {blogId ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="media" className="h-24 w-full object-cover transition group-hover:scale-[1.02]" loading="lazy" />
              <div className="px-3 py-2 text-[11px] text-slate-400 line-clamp-2">{url}</div>
            </a>
          ))}
          {!filtered.length && <p className="text-sm text-slate-400">No media found for this search.</p>}
        </div>
      ) : (
        <p className="text-sm text-slate-400">Save the draft to load media library.</p>
      )}
    </Panel>
  );
}
