import { projects } from "@/data/content";
import { fetchPublishedPosts } from "@/lib/blogService";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const formatDate = (date: Date) => date.toISOString();

const buildUrlEntry = (loc: string, lastmod: Date) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${formatDate(lastmod)}</lastmod>\n  </url>`;

export async function GET() {
  const posts = await fetchPublishedPosts();
  const now = new Date();

  const baseEntries = [
    { loc: `${siteUrl}/`, lastmod: now },
    { loc: `${siteUrl}/about`, lastmod: now },
    { loc: `${siteUrl}/services`, lastmod: now },
    { loc: `${siteUrl}/work`, lastmod: now },
    { loc: `${siteUrl}/contact`, lastmod: now },
    { loc: `${siteUrl}/blog`, lastmod: now }
  ];

  const workEntries = projects.map((project) => ({
    loc: `${siteUrl}/work/${project.slug}`,
    lastmod: now
  }));

  const blogEntries = posts.map((post) => ({
    loc: `${siteUrl}/blog/${post.slug}`,
    lastmod: post.updatedAt ? new Date(post.updatedAt) : post.publishDate ? new Date(post.publishDate) : now
  }));

  const urls = [...baseEntries, ...workEntries, ...blogEntries]
    .map(({ loc, lastmod }) => buildUrlEntry(loc, lastmod))
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
