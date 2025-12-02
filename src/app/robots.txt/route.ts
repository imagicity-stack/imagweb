const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
Host: ${siteUrl}
`;

export function GET() {
  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
