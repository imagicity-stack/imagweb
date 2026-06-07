// Dynamic /llms.txt — a concise, link-first map of the site for LLMs and AI
// crawlers (see https://llmstxt.org). Generated from the same data as the
// sitemap so it never drifts out of sync.

import { getPublishedPosts } from "../lib/blogServer";
import { services } from "../lib/services";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  LOCATIONS
} from "../lib/site";

export async function getServerSideProps({ res }) {
  let posts = [];
  try {
    posts = await getPublishedPosts();
  } catch (error) {
    posts = [];
  }

  const corePages = [
    ["Home", "/", "Overview of how Imagicity blends strategy, creative and performance."],
    ["About", "/about", "Who we are, how we think, and the way we partner with brands."],
    ["Services", "/services", "The full range of marketing services, grouped by discipline."],
    ["Work", "/portfolio", "Selected projects and outcomes for the brands we've grown."],
    ["Blog", "/blog", "The Imagicity Journal — playbooks on strategy, branding, performance and growth."],
    ["Contact", "/contact", "Start a project or make a request."]
  ];

  const link = (label, path, note) =>
    `- [${label}](${SITE_URL}${path})${note ? `: ${note}` : ""}`;

  const sections = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `Imagicity partners with founders and marketing teams across ${LOCATIONS.join(
      ", "
    )} to build complete marketing systems — not one-off deliverables. We combine go-to-market strategy, brand positioning, creative, content, performance marketing and automation to help ambitious brands build authority, acquire customers and scale with clarity.`,
    "",
    "## Core pages",
    ...corePages.map(([label, path, note]) => link(label, path, note)),
    "",
    "## Services",
    ...services.map((service) =>
      link(service.title, `/services/${service.slug}`, service.tagline)
    )
  ];

  if (posts.length) {
    sections.push(
      "",
      "## Latest from the blog",
      ...posts
        .slice(0, 15)
        .map((post) =>
          link(post.title, `/blog/${post.slug}`, post.excerpt || undefined)
        )
    );
  }

  sections.push(
    "",
    "## Contact",
    `- Email: ${CONTACT_EMAIL}`,
    `- Phone: ${CONTACT_PHONE}`,
    `- Locations: ${LOCATIONS.join(" · ")}`,
    "",
    "## More",
    `- [XML sitemap](${SITE_URL}/sitemap.xml)`,
    ""
  );

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.write(sections.join("\n"));
  res.end();

  return { props: {} };
}

export default function LlmsTxt() {
  return null;
}
