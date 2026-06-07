import { useMemo, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import NewsCard from "../../components/blog/NewsCard";
import { getPublishedPosts } from "../../lib/creacityServer";
import { formatDate } from "../../lib/blog";
import { SITE_NAME, SITE_URL, absoluteUrl } from "../../lib/site";

const PAGE_DESCRIPTION =
  "Creacity is your go-to marketing learning school — practical tips, tricks, design, branding and business playbooks to help you grow.";

export default function CreacityIndex({ posts }) {
  const featured = useMemo(
    () => posts.find((post) => post.featured) || posts[0] || null,
    [posts]
  );

  const categories = useMemo(() => {
    const set = new Set();
    posts.forEach((post) => post.category && set.add(post.category));
    return ["All", ...Array.from(set)];
  }, [posts]);

  const [activeCategory, setActiveCategory] = useState("All");

  const listed = useMemo(() => {
    const rest = featured ? posts.filter((post) => post.id !== featured.id) : posts;
    if (activeCategory === "All") return rest;
    return rest.filter((post) => post.category === activeCategory);
  }, [posts, featured, activeCategory]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Creacity · ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    url: absoluteUrl("/creacity"),
    publisher: { "@id": `${SITE_URL}/#organization` }
  };

  return (
    <Layout
      title="Creacity — Marketing Tips & Tricks"
      description={PAGE_DESCRIPTION}
      keywords="marketing tips, marketing tricks, branding, design, business, social media, growth, learning"
      jsonLd={jsonLd}
    >
      <div className="news">
        <div className="news-masthead creacity-masthead">
          <span className="news-kicker accent">Tips &amp; Tricks</span>
          <h1>
            Creacity — your own go-to{" "}
            <span className="creacity-accent">marketing learning school</span>.
          </h1>
          <p>{PAGE_DESCRIPTION}</p>
        </div>

        {posts.length === 0 ? (
          <div className="news-empty">
            <h2>Lessons are on the way.</h2>
            <p>We&apos;re putting together our first tips and tricks. Check back soon.</p>
            <Link href="/contact" className="news-btn">
              Work with us
            </Link>
          </div>
        ) : (
          <>
            {featured ? (
              <Link href={`/creacity/${featured.slug}`} className="news-lead">
                <div className="news-lead-media">
                  {featured.coverImage?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.coverImage.url}
                      alt={featured.coverImage.alt || featured.title}
                    />
                  ) : (
                    <span className="ncard-fallback large" aria-hidden="true">
                      {(featured.title || "C").slice(0, 1)}
                    </span>
                  )}
                </div>
                <div className="news-lead-body">
                  <span className="news-kicker accent">{featured.category || "Featured"}</span>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <div className="news-lead-meta">
                    <span>{featured.author?.name || SITE_NAME}</span>
                    <span aria-hidden="true">·</span>
                    <time>{formatDate(featured.publishedAt || featured.createdAt)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{featured.readingTimeMinutes} min read</span>
                  </div>
                </div>
              </Link>
            ) : null}

            {categories.length > 1 ? (
              <div className="news-filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={activeCategory === category ? "active" : ""}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            ) : (
              <div className="news-section-rule">
                <span>Latest lessons</span>
              </div>
            )}

            {listed.length === 0 ? (
              <p className="news-empty-inline">Nothing in this topic yet.</p>
            ) : (
              <div className="news-grid">
                {listed.map((post) => (
                  <NewsCard key={post.id} post={post} basePath="/creacity" />
                ))}
              </div>
            )}
          </>
        )}

        <div className="news-cta-band">
          <h2>Want us to run the playbook for you?</h2>
          <p>Turn these ideas into a marketing system built around your brand and goals.</p>
          <div className="news-cta-actions">
            <Link href="/contact" className="news-btn">
              Start a project
            </Link>
            <Link href="/services" className="news-btn ghost">
              Explore services
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await getPublishedPosts();
  return {
    props: { posts },
    revalidate: 60
  };
}
