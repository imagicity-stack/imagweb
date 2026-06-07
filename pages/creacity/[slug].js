import { useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import NewsCard from "../../components/blog/NewsCard";
import Comments from "../../components/blog/Comments";
import ViewBeacon from "../../components/blog/ViewBeacon";
import {
  getPostBySlug,
  getPublishedSlugs,
  getRelatedPosts
} from "../../lib/creacityServer";
import { formatDate } from "../../lib/blog";
import { SITE_NAME, SITE_URL, absoluteUrl } from "../../lib/site";

export default function CreacityPost({ post, related }) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(`/creacity/${post.slug}`);
  const publishedLabel = formatDate(post.publishedAt || post.createdAt);
  const metaDescription = post.seo.description || post.excerpt;
  const ogImage = post.seo.ogImage || post.coverImage?.url || "";
  const keywords = [post.seo.focusKeyword, ...(post.tags || [])].filter(Boolean).join(", ");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: post.title.slice(0, 110),
      description: metaDescription,
      ...(post.coverImage?.url ? { image: [post.coverImage.url] } : {}),
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt || post.publishedAt || post.createdAt,
      author: { "@type": "Person", name: post.author?.name || SITE_NAME },
      publisher: { "@id": `${SITE_URL}/#organization` },
      ...(keywords ? { keywords } : {}),
      ...(post.category ? { articleSection: post.category } : {}),
      wordCount: post.wordCount || undefined,
      url
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Creacity", item: absoluteUrl("/creacity") },
        { "@type": "ListItem", position: 3, name: post.title, item: url }
      ]
    }
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      /* clipboard unavailable */
    }
  };

  const shareLinks = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }
  ];

  return (
    <Layout
      title={post.seo.title || post.title}
      description={metaDescription}
      canonical={post.seo.canonicalUrl || url}
      ogType="article"
      ogImage={ogImage}
      keywords={keywords}
      noindex={post.seo.noindex}
      article={{
        publishedTime: post.publishedAt || post.createdAt,
        modifiedTime: post.updatedAt || post.publishedAt || post.createdAt,
        author: post.author?.name || SITE_NAME,
        section: post.category,
        tags: post.tags
      }}
      jsonLd={jsonLd}
    >
      <div className="news">
        <ViewBeacon postId={post.id} slug={post.slug} api="/api/creacity/views" />
        <article className="news-article" style={{ paddingTop: "clamp(28px, 4vw, 52px)" }}>
          <nav className="news-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/creacity">Creacity</Link>
            <span aria-hidden="true">/</span>
            <span className="current">{post.category || "Lesson"}</span>
          </nav>

          <header className="news-article-head">
            {post.category ? (
              <span className="news-kicker accent">{post.category}</span>
            ) : null}
            <h1 className="news-headline">{post.title}</h1>
            {post.excerpt ? <p className="news-standfirst">{post.excerpt}</p> : null}

            <div className="news-byline">
              <div className="news-byline-author">
                {post.author?.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.author.picture} alt={post.author.name} />
                ) : (
                  <span className="news-avatar-fallback" aria-hidden="true">
                    {(post.author?.name || "C").slice(0, 1)}
                  </span>
                )}
                <div>
                  <span className="news-byline-name">{post.author?.name || SITE_NAME}</span>
                  <span className="news-byline-sub">
                    {publishedLabel ? (
                      <time dateTime={post.publishedAt || post.createdAt || undefined}>
                        {publishedLabel}
                      </time>
                    ) : null}
                    {publishedLabel ? <span aria-hidden="true"> · </span> : null}
                    {post.readingTimeMinutes} min read
                  </span>
                </div>
              </div>
            </div>
          </header>

          {post.coverImage?.url ? (
            <figure className="news-hero-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                className="news-hero-img"
              />
              {post.coverImage.alt ? <figcaption>{post.coverImage.alt}</figcaption> : null}
            </figure>
          ) : null}

          <div
            className="news-article-body"
            // Content is sanitized server-side before being stored in Firestore.
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags?.length ? (
            <div className="news-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="news-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="news-share">
            <span className="news-share-label">Share this lesson</span>
            <div className="news-share-links">
              {shareLinks.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              ))}
              <button type="button" onClick={handleCopy}>
                {copied ? "Link copied" : "Copy link"}
              </button>
            </div>
          </div>

          {post.author?.bio ? (
            <aside className="news-author-card">
              {post.author.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.author.picture} alt={post.author.name} />
              ) : (
                <span className="news-avatar-fallback large" aria-hidden="true">
                  {(post.author?.name || "C").slice(0, 1)}
                </span>
              )}
              <div>
                <span className="news-author-label">Written by</span>
                <h3>{post.author.name}</h3>
                <p>{post.author.bio}</p>
              </div>
            </aside>
          ) : null}
        </article>

        <Comments postId={post.id} api="/api/creacity/comments" />

        {related?.length ? (
          <section className="news-related">
            <div className="news-section-rule">
              <span>More lessons</span>
            </div>
            <div className="news-grid">
              {related.map((item) => (
                <NewsCard key={item.id} post={item} basePath="/creacity" />
              ))}
            </div>
          </section>
        ) : null}

        <div className="news-cta-band">
          <h2>Let&apos;s build your growth engine.</h2>
          <p>Tell us about your goals and we&apos;ll shape a marketing system around your brand.</p>
          <div className="news-cta-actions">
            <Link href="/contact" className="news-btn">
              Make a request
            </Link>
            <Link href="/creacity" className="news-btn ghost">
              Back to Creacity
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = await getPublishedSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: "blocking"
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post || post.status !== "published") {
    return { notFound: true, revalidate: 30 };
  }
  const related = await getRelatedPosts(post, 3);
  return {
    props: { post, related },
    revalidate: 60
  };
}
