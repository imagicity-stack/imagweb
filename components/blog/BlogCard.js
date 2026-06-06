import Link from "next/link";
import Image from "next/image";
import { formatDate } from "../../lib/blog";

export default function BlogCard({ post, featured = false }) {
  const href = `/blog/${post.slug}`;
  const date = formatDate(post.publishedAt || post.createdAt);

  return (
    <article className={`blog-card ${featured ? "featured" : ""}`}>
      <Link href={href} className="blog-card-media" aria-label={post.title}>
        {post.coverImage?.url ? (
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            sizes={featured ? "(max-width: 900px) 100vw, 600px" : "(max-width: 620px) 100vw, 380px"}
            className="blog-card-img"
          />
        ) : (
          <span className="blog-card-fallback" aria-hidden="true">
            {(post.title || "I").slice(0, 1)}
          </span>
        )}
        {post.category ? <span className="blog-card-cat">{post.category}</span> : null}
      </Link>

      <div className="blog-card-body">
        <h3 className="blog-card-title">
          <Link href={href}>{post.title}</Link>
        </h3>
        {post.excerpt ? <p className="blog-card-excerpt">{post.excerpt}</p> : null}
        <div className="blog-card-meta">
          {post.author?.name ? <span>{post.author.name}</span> : null}
          {date ? (
            <>
              <span className="dot" aria-hidden="true">
                ·
              </span>
              <time dateTime={post.publishedAt || post.createdAt || undefined}>{date}</time>
            </>
          ) : null}
          <span className="dot" aria-hidden="true">
            ·
          </span>
          <span>{post.readingTimeMinutes} min read</span>
        </div>
      </div>
    </article>
  );
}
