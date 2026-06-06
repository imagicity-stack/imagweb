import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "../../components/Layout";
import Reveal from "../../components/Reveal";
import BlogCard from "../../components/blog/BlogCard";
import {
  getPostBySlug,
  getPublishedSlugs,
  getRelatedPosts
} from "../../lib/blogServer";
import { formatDate } from "../../lib/blog";
import { SITE_NAME, SITE_URL, absoluteUrl } from "../../lib/site";

export default function BlogPost({ post, related }) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(`/blog/${post.slug}`);
  const publishedLabel = formatDate(post.publishedAt || post.createdAt);
  const metaDescription = post.seo.description || post.excerpt;
  const ogImage = post.seo.ogImage || post.coverImage?.url || "";

  const keywords = [post.seo.focusKeyword, ...(post.tags || [])]
    .filter(Boolean)
    .join(", ");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: post.title.slice(0, 110),
      description: metaDescription,
      ...(post.coverImage?.url ? { image: [post.coverImage.url] } : {}),
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt || post.publishedAt || post.createdAt,
      author: { "@type": "Person", name: post.author?.name || SITE_NAME },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: absoluteUrl("/ICONS/SSA.png") }
      },
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
        { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
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
      label: "X",
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
      <article className="post">
        <div className="container post-container">
          <Reveal>
            <nav className="post-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog">Blog</Link>
              <span aria-hidden="true">/</span>
              <span className="current">{post.category || "Article"}</span>
            </nav>
          </Reveal>

          <header className="post-header">
            <Reveal delay={60}>
              {post.category ? (
                <span className="badge violet">{post.category}</span>
              ) : null}
            </Reveal>
            <Reveal delay={120}>
              <h1 className="h-display post-title">{post.title}</h1>
            </Reveal>
            {post.excerpt ? (
              <Reveal delay={180}>
                <p className="post-lede">{post.excerpt}</p>
              </Reveal>
            ) : null}
            <Reveal delay={240}>
              <div className="post-byline">
                <div className="post-author">
                  {post.author?.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.author.picture}
                      alt={post.author.name}
                      className="post-author-avatar"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span className="post-author-avatar fallback" aria-hidden="true">
                      {(post.author?.name || "I").slice(0, 1)}
                    </span>
                  )}
                  <span>{post.author?.name || SITE_NAME}</span>
                </div>
                <span className="dot" aria-hidden="true">
                  ·
                </span>
                {publishedLabel ? (
                  <time dateTime={post.publishedAt || post.createdAt || undefined}>
                    {publishedLabel}
                  </time>
                ) : null}
                <span className="dot" aria-hidden="true">
                  ·
                </span>
                <span>{post.readingTimeMinutes} min read</span>
              </div>
            </Reveal>
          </header>

          {post.coverImage?.url ? (
            <Reveal variant="scale" delay={120} className="post-cover">
              <Image
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 880px"
                className="post-cover-img"
              />
            </Reveal>
          ) : null}

          <div
            className="post-content"
            // Content is sanitized server-side before being stored in Firestore.
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags?.length ? (
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="post-tag">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="post-share">
            <span className="post-share-label">Share</span>
            {shareLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="post-share-btn"
              >
                {item.label}
              </a>
            ))}
            <button type="button" className="post-share-btn" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>

          {post.author?.bio ? (
            <div className="post-author-card">
              {post.author.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.author.picture}
                  alt={post.author.name}
                  className="post-author-card-avatar"
                />
              ) : (
                <span className="post-author-card-avatar fallback" aria-hidden="true">
                  {(post.author?.name || "I").slice(0, 1)}
                </span>
              )}
              <div>
                <span className="post-author-card-label">Written by</span>
                <h3>{post.author.name}</h3>
                <p>{post.author.bio}</p>
              </div>
            </div>
          ) : null}
        </div>
      </article>

      {related?.length ? (
        <section className="section tight">
          <div className="container">
            <div className="section-head">
              <Reveal>
                <span className="eyebrow">Keep reading</span>
              </Reveal>
              <Reveal delay={80}>
                <h2>Related articles</h2>
              </Reveal>
            </div>
            <div className="blog-grid">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={(index % 3) * 80}>
                  <BlogCard post={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section tight">
        <div className="container">
          <Reveal variant="scale" className="cta-band">
            <h2>Let&apos;s build your growth engine.</h2>
            <p>
              Tell us about your goals and we&apos;ll shape a marketing system
              around your brand and market.
            </p>
            <div className="cta-actions">
              <Link href="/contact" className="btn btn-glow">
                Make a request →
              </Link>
              <Link href="/blog" className="btn btn-outline">
                Back to blog
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
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
