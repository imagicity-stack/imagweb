import { useMemo, useState } from "react";
import Link from "next/link";
import NewsLayout from "../../components/blog/NewsLayout";
import NewsCard from "../../components/blog/NewsCard";
import { getPublishedPosts } from "../../lib/blogServer";
import { formatDate } from "../../lib/blog";
import { SITE_NAME, absoluteUrl } from "../../lib/site";

const PAGE_DESCRIPTION =
  "Marketing strategy, brand building, performance and growth insights from the Imagicity team — practical playbooks to help bold brands grow.";

export default function BlogIndex({ posts }) {
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
    name: `${SITE_NAME} Blog`,
    description: PAGE_DESCRIPTION,
    url: absoluteUrl("/blog"),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/ICONS/SSA.png") }
    },
    blogPost: posts.slice(0, 12).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.publishedAt || post.createdAt,
      image: post.coverImage?.url || undefined,
      author: { "@type": "Person", name: post.author?.name || SITE_NAME }
    }))
  };

  return (
    <NewsLayout
      title="The Journal"
      description={PAGE_DESCRIPTION}
      keywords="marketing blog, brand strategy, performance marketing, SEO, content marketing, growth"
      jsonLd={jsonLd}
    >
      <div className="news-masthead">
        <span className="news-kicker">The Imagicity Journal</span>
        <h1>Ideas that help brands grow louder.</h1>
        <p>{PAGE_DESCRIPTION}</p>
      </div>

      {posts.length === 0 ? (
        <div className="news-empty">
          <h2>No stories published yet.</h2>
          <p>We&apos;re crafting our first features. Check back soon.</p>
          <Link href="/contact" className="news-btn">
            Work with us
          </Link>
        </div>
      ) : (
        <>
          {featured ? (
            <Link href={`/blog/${featured.slug}`} className="news-lead">
              <div className="news-lead-media">
                {featured.coverImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.coverImage.url}
                    alt={featured.coverImage.alt || featured.title}
                  />
                ) : (
                  <span className="ncard-fallback large" aria-hidden="true">
                    {(featured.title || "I").slice(0, 1)}
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
              <span>Latest stories</span>
            </div>
          )}

          {listed.length === 0 ? (
            <p className="news-empty-inline">No stories in this section yet.</p>
          ) : (
            <div className="news-grid">
              {listed.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      )}

      <div className="news-cta-band">
        <h2>Want results like these for your brand?</h2>
        <p>Let&apos;s turn these ideas into a marketing system built around your goals.</p>
        <div className="news-cta-actions">
          <Link href="/contact" className="news-btn">
            Start a project
          </Link>
          <Link href="/services" className="news-btn ghost">
            Explore services
          </Link>
        </div>
      </div>
    </NewsLayout>
  );
}

export async function getStaticProps() {
  const posts = await getPublishedPosts();
  return {
    props: { posts },
    revalidate: 60
  };
}
