"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";
import type { BlogPost } from "@/lib/blogService";
import { fetchPublishedPosts } from "@/lib/blogService";

const HomeBlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchPublishedPosts();
      setPosts(data.slice(0, 3));
      setLoading(false);
    };

    void load();
  }, []);

  return (
    <section id="blog" className="px-4 py-20 sm:px-8 lg:px-16 bg-gradient-to-b from-slate-950 via-slate-900/80 to-black">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Journal</p>
            <h2 className="text-3xl font-semibold sm:text-4xl text-white">Latest thinking</h2>
            <p className="text-white/70 max-w-2xl">
              Fresh drops from the studio covering launches, motion craft, GTM playbooks, and behind-the-scenes builds that sync
              directly with the admin panel.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/70 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cyan-400/10"
          >
            Read the blog
            <span aria-hidden className="text-lg">
              →
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-64 animate-pulse rounded-2xl bg-slate-800/60 border border-slate-800"
              />
            ))}
          </div>
        ) : posts.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id || post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-300">
            No published posts yet. Add one from the admin dashboard to populate this section automatically.
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeBlogSection;
