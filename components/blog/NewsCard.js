import Link from "next/link";
import { formatDate } from "../../lib/blog";

export default function NewsCard({ post }) {
  const href = `/blog/${post.slug}`;
  const date = formatDate(post.publishedAt || post.createdAt);

  return (
    <article className="ncard">
      <Link href={href} className="ncard-media" aria-label={post.title}>
        {post.coverImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage.url} alt={post.coverImage.alt || post.title} loading="lazy" />
        ) : (
          <span className="ncard-fallback" aria-hidden="true">
            {(post.title || "I").slice(0, 1)}
          </span>
        )}
      </Link>
      <div className="ncard-body">
        {post.category ? <span className="ncard-kicker">{post.category}</span> : null}
        <h3 className="ncard-title">
          <Link href={href}>{post.title}</Link>
        </h3>
        {post.excerpt ? <p className="ncard-excerpt">{post.excerpt}</p> : null}
        <div className="ncard-meta">
          {post.author?.name ? <span>{post.author.name}</span> : null}
          {date ? (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt || post.createdAt || undefined}>{date}</time>
            </>
          ) : null}
          <span aria-hidden="true">·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </div>
      </div>
    </article>
  );
}
