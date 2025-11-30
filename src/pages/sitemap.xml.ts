import { GetServerSideProps } from "next";
import { fetchPublishedPosts } from "@/lib/blogService";

const buildSitemap = (urls: string[]) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `<url>
  <loc>${url}</loc>
</url>`
  )
  .join("\n")}
</urlset>`;

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const posts = await fetchPublishedPosts();
  const staticPages = ["/", "/work", "/blog", "/admin/login", "/admin/dashboard"];
  const urls = [
    ...staticPages.map((path) => `${siteUrl}${path}`),
    ...posts.map((post) => `${siteUrl}/blog/${post.slug}`)
  ];

  res.setHeader("Content-Type", "text/xml");
  res.write(buildSitemap(urls));
  res.end();

  return { props: {} };
};

export default Sitemap;
