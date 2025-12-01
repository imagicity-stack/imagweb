import Image from "next/image";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Link from "next/link";
import BlogList from "@/components/blog/BlogList";
import type { BlogPost } from "@/lib/blogService";
import { fetchPublishedPosts } from "@/lib/blogService";

interface Props {
  posts: BlogPost[];
  siteUrl: string;
}

const getCreatedAtValue = (value: BlogPost["createdAt"]) => {
  if (typeof value === "object" && value !== null && "seconds" in value) {
    const seconds = (value as { seconds?: number })?.seconds;
    return seconds ? seconds * 1000 : 0;
  }

  if (typeof value === "string") {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
  }

  return 0;
};

const BlogIndex = ({ posts, siteUrl }: Props) => {
  const sortedPosts = [...(posts ?? [])].sort((a, b) => getCreatedAtValue(b.createdAt) - getCreatedAtValue(a.createdAt));
  const [featured, ...rest] = sortedPosts;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Head>
        <title>Blog | Imagweb</title>
        <meta name="description" content="Insights, tutorials, and updates from the Imagweb team." />
        <link rel="canonical" href={`${siteUrl}/blog`} />
      </Head>

      <section className="relative overflow-hidden px-4 py-16 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,133,95,0.16),transparent_35%),radial-gradient(circle_at_80%_50%,rgba(244,114,182,0.2),transparent_35%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">Blog Menu</p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Stories from the studio</h1>
            <p className="max-w-2xl text-lg text-white/70">
              A marketing-first feed of our launches, experiments, growth breakdowns, and craft notes. All posts here sync
              directly with the admin blog dashboard.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-orange-300/70 px-3 py-1">Strategy</span>
              <span className="rounded-full border border-orange-300/70 px-3 py-1">Design</span>
              <span className="rounded-full border border-orange-300/70 px-3 py-1">Development</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="#latest"
                className="rounded-full bg-orange-400 px-5 py-2 text-black font-semibold shadow-lg shadow-orange-400/30 transition hover:-translate-y-0.5"
              >
                Dive into posts
              </Link>
              <Link
                href="/"
                className="rounded-full border border-white/20 px-5 py-2 text-white/80 transition hover:border-orange-300 hover:text-white"
              >
                Back to home
              </Link>
            </div>
          </div>

          {featured && (
            <article className="glass gradient-border relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl">
              {featured.featuredImageUrl && (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={featured.featuredImageUrl}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 540px, 100vw"
                    priority
                  />
                </div>
              )}
              <div className="space-y-3 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-orange-200">Featured</p>
                <Link href={`/blog/${featured.slug}`} className="text-2xl font-semibold text-white hover:text-orange-300">
                  {featured.title}
                </Link>
                <p className="text-slate-300">{featured.intro}</p>
                <div className="flex flex-wrap gap-2 text-xs text-orange-100">
                  {featured.category && <span className="rounded-full bg-slate-800 px-3 py-1">{featured.category}</span>}
                  {featured.tags?.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 uppercase">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      <section id="latest" className="px-4 pb-16 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="space-y-2">
            <p className="text-orange-300 text-sm">Latest articles</p>
            <h2 className="text-3xl font-semibold text-white">Browse every drop</h2>
            <p className="text-slate-300">Stories, engineering notes, and marketing breakdowns from the agency.</p>
          </div>
          {sortedPosts.length ? (
            <BlogList posts={rest} />
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-300">
              No articles yet. Publish from the admin dashboard to see them here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = (await fetchPublishedPosts()) || [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    props: {
      posts,
      siteUrl
    }
  };
};

export default BlogIndex;
