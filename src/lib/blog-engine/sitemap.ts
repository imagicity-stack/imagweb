import { Post } from "./models";

const getSiteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "https://imagweb.example";

export const buildSitemapXml = (posts: Post[]) => {
  const domain = getSiteUrl().replace(/\/$/, "");
  const urls = posts
    .filter((post) => post.status === "Published")
    .map((post) => {
      const lastmod = new Date(post.updatedAt || post.publishDate || post.createdAt).toISOString();
      return `  <url>\n    <loc>${domain}/blog/${post.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
};

export const writeSitemap = async (xml: string) => {
  if (typeof window !== "undefined") return null;

  const [{ writeFile }, path] = await Promise.all([
    import("fs/promises"),
    import("path")
  ]);

  const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
  await writeFile(sitemapPath, xml, "utf8");
  return sitemapPath;
};
