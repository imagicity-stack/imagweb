// Dynamic XML sitemap covering static pages, service pages and every
// published blog post. Replaces the old static public/sitemap.xml so new
// posts appear automatically.

import { getPublishedPosts } from "../lib/blogServer";
import { getPublishedPosts as getCreacityPosts } from "../lib/creacityServer";
import { services } from "../lib/services";
import { SITE_URL } from "../lib/site";

function toEntry({ path, lastmod, changefreq, priority }) {
  const date = (lastmod || new Date().toISOString()).split("T")[0];
  return [
    "  <url>",
    `    <loc>${SITE_URL}${path}</loc>`,
    `    <lastmod>${date}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>"
  ].join("\n");
}

export async function getServerSideProps({ res }) {
  const [posts, creacityPosts] = await Promise.all([
    getPublishedPosts(),
    getCreacityPosts()
  ]);

  const staticPages = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/about", changefreq: "monthly", priority: "0.8" },
    { path: "/services", changefreq: "weekly", priority: "0.9" },
    { path: "/portfolio", changefreq: "monthly", priority: "0.8" },
    { path: "/blog", changefreq: "daily", priority: "0.9" },
    { path: "/creacity", changefreq: "daily", priority: "0.9" },
    { path: "/contact", changefreq: "monthly", priority: "0.6" },
    { path: "/privacy", changefreq: "yearly", priority: "0.3" },
    { path: "/terms", changefreq: "yearly", priority: "0.3" }
  ];

  const creacityPages = creacityPosts.map((post) => ({
    path: `/creacity/${post.slug}`,
    lastmod: post.updatedAt || post.publishedAt,
    changefreq: "weekly",
    priority: post.featured ? "0.8" : "0.7"
  }));

  const servicePages = services.map((service) => ({
    path: `/services/${service.slug}`,
    changefreq: "monthly",
    priority: "0.7"
  }));

  const postPages = posts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastmod: post.updatedAt || post.publishedAt,
    changefreq: "weekly",
    priority: post.featured ? "0.8" : "0.7"
  }));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    [...staticPages, ...servicePages, ...postPages, ...creacityPages].map(toEntry).join("\n"),
    "</urlset>"
  ].join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.write(xml);
  res.end();

  return { props: {} };
}

export default function SiteMap() {
  return null;
}
