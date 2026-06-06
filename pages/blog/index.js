import { useMemo, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import Reveal from "../../components/Reveal";
import BlogCard from "../../components/blog/BlogCard";
import { getPublishedPosts } from "../../lib/blogServer";
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
    const withoutFeatured = featured
      ? posts.filter((post) => post.id !== featured.id)
      : posts;
    if (activeCategory === "All") return withoutFeatured;
    return withoutFeatured.filter((post) => post.category === activeCategory);
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
    <Layout
      title="Blog"
      description={PAGE_DESCRIPTION}
      keywords="marketing blog, brand strategy, performance marketing, SEO, content marketing, growth"
      jsonLd={jsonLd}
    >
      <section className="hero-compact">
        <div className="container">
          <Reveal>
            <span className="eyebrow">The Imagicity Journal</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="h-display">
              Ideas that help brands <span className="gradient-text">grow louder</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p>{PAGE_DESCRIPTION}</p>
          </Reveal>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="section tight">
          <div className="container">
            <div className="blog-empty">
              <h2>No posts published yet.</h2>
              <p>
                We&apos;re busy crafting our first stories. Check back soon for fresh
                marketing playbooks and insights.
              </p>
              <Link href="/contact" className="btn btn-glow">
                Work with us →
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          {featured ? (
            <section className="section tight">
              <div className="container">
                <Reveal>
                  <Link href={`/blog/${featured.slug}`} className="blog-feature">
                    <div className="blog-feature-media">
                      {featured.coverImage?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={featured.coverImage.url}
                          alt={featured.coverImage.alt || featured.title}
                          loading="eager"
                        />
                      ) : (
                        <span className="blog-card-fallback large" aria-hidden="true">
                          {(featured.title || "I").slice(0, 1)}
                        </span>
                      )}
                    </div>
                    <div className="blog-feature-body">
                      <span className="badge violet">
                        {featured.category || "Featured"}
                      </span>
                      <h2>{featured.title}</h2>
                      <p>{featured.excerpt}</p>
                      <span className="blog-feature-cta">Read article →</span>
                    </div>
                  </Link>
                </Reveal>
              </div>
            </section>
          ) : null}

          <section className="section tight">
            <div className="container">
              {categories.length > 1 ? (
                <div className="blog-filters">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`blog-filter ${activeCategory === category ? "active" : ""}`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ) : null}

              {listed.length === 0 ? (
                <p className="blog-empty-inline">No posts in this category yet.</p>
              ) : (
                <div className="blog-grid">
                  {listed.map((post, index) => (
                    <Reveal key={post.id} delay={(index % 3) * 80}>
                      <BlogCard post={post} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <section className="section tight">
        <div className="container">
          <Reveal variant="scale" className="cta-band">
            <h2>Want results like these for your brand?</h2>
            <p>
              Let&apos;s turn these ideas into a marketing system built around your
              goals.
            </p>
            <div className="cta-actions">
              <Link href="/contact" className="btn btn-glow">
                Start a project →
              </Link>
              <Link href="/services" className="btn btn-outline">
                Explore services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
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
