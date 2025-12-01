"use client";

import { useState } from "react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import type { BlogPost } from "@/types/blog";
import { twMerge } from "tailwind-merge";

export function Sidebar() {
  const items = [
    "Dashboard",
    "Blogs",
    "Categories",
    "Media",
    "Redirects",
    "Settings",
    "Logout"
  ];

  return (
    <aside className="hidden h-screen w-60 shrink-0 border-r border-slate-800 bg-slate-950/80 px-4 py-6 lg:flex lg:flex-col lg:gap-6">
      <div className="text-lg font-semibold text-white">Admin</div>
      <nav className="flex flex-1 flex-col gap-2 text-sm text-slate-200">
        {items.map((item) => (
          <button
            key={item}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-800/80 hover:text-white"
            type="button"
          >
            <span className="text-slate-500">•</span>
            <span>{item}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export function Topbar({ onNew }: { onNew: () => void }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onNew}
          className="rounded-lg bg-orange-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:bg-orange-300"
        >
          New Blog
        </button>
        <span className="hidden text-xs text-slate-400 sm:inline">Autosave enabled · Draft saved…</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-200">
        <div className="h-8 w-8 rounded-full bg-slate-800" />
        <span>Admin User</span>
      </div>
    </header>
  );
}

export function Panel({
  title,
  description,
  children,
  action,
  className
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={twMerge("rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm", className)}>
      {(title || description || action) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-base font-semibold text-white">{title}</h3>}
            {description && <p className="text-sm text-slate-400">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function CollapsibleCard({
  title,
  description,
  children,
  defaultOpen = true
}: {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
        <span className="text-slate-400">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="border-t border-slate-800 px-4 py-4">{children}</div>}
    </div>
  );
}

export function FieldGroup({
  label,
  description,
  children,
  inline
}: {
  label: string;
  description?: string;
  children: ReactNode;
  inline?: boolean;
}) {
  return (
    <label className={twMerge("flex w-full flex-col gap-2 text-sm", inline ? "lg:flex-row lg:items-center lg:gap-4" : "")}> 
      <div className="min-w-[120px] space-y-1 text-left">
        <span className="block font-medium text-white">{label}</span>
        {description && <span className="block text-xs text-slate-400">{description}</span>}
      </div>
      {children}
    </label>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={twMerge(
        "w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white shadow-inner placeholder:text-slate-500 focus:border-orange-400 focus:outline-none",
        className
      )}
    />
  );
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={twMerge(
        "w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white shadow-inner placeholder:text-slate-500 focus:border-orange-400 focus:outline-none",
        className
      )}
    />
  );
}

export function PillButton({ active, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      className={twMerge(
        "rounded-full border px-3 py-1 text-xs transition hover:border-orange-400 hover:text-orange-200",
        active ? "border-orange-400 bg-orange-400/10 text-orange-200" : "border-slate-700 text-slate-200",
        props.className
      )}
    >
      {children}
    </button>
  );
}

export function ToolbarButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200 transition hover:border-orange-400 hover:text-orange-200"
    >
      {label}
    </button>
  );
}

export function BlogTable({
  blogs,
  onSelect,
  onRefresh
}: {
  blogs: BlogPost[];
  onSelect: (blog: BlogPost) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Blog Library</p>
          <p className="text-xs text-slate-400">Manage and filter your posts</p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-orange-300 hover:text-orange-200"
          onClick={onRefresh}
        >
          Refresh
        </button>
      </div>
      <div className="overflow-auto">
        <table className="w-full min-w-[640px] divide-y divide-slate-800 text-sm text-slate-200">
          <thead className="bg-slate-900/50">
            <tr>
              {["Title", "Status", "Category", "Updated", "Actions"].map((heading) => (
                <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-slate-800/50">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{blog.title}</div>
                  <div className="text-xs text-slate-400">{blog.tags?.slice(0, 3).join(", ")}</div>
                </td>
                <td className="px-4 py-3 text-xs capitalize text-slate-300">{blog.status}</td>
                <td className="px-4 py-3 text-xs text-slate-300">{blog.category}</td>
                <td className="px-4 py-3 text-xs text-slate-400">{blog.publishDate?.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <PillButton onClick={() => onSelect(blog)}>Edit</PillButton>
                    <PillButton onClick={() => onSelect(blog)} className="!border-slate-700 !text-slate-300">
                      Duplicate
                    </PillButton>
                    <PillButton onClick={() => onSelect(blog)} className="!border-slate-700 !text-slate-300">
                      Delete
                    </PillButton>
                  </div>
                </td>
              </tr>
            ))}
            {!blogs.length && (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-400" colSpan={5}>
                  No posts yet. Create the first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
