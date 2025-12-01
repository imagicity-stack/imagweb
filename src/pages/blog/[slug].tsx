import Head from "next/head";
import Image from "next/image";
import { GetServerSideProps } from "next";
import TableOfContents from "@/components/blog/TableOfContents";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import RelatedPosts from "@/components/blog/RelatedPosts";
import type { BlogPost } from "@/lib/blogService";
import { fetchPostBySlug, fetchRelatedPosts } from "@/lib/blogService";

interface Props {
  post: BlogPost;
  related: BlogPost[];
  siteUrl: string;
}

const createBlogJsonLd = (post: BlogPost, siteUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.seo?.seoTitle || post.title,
  image: post.featuredImageUrl,
  description: post.seo?.metaDescription || post.intro,
  author: {
    "@type": "Person",
    name: post.authorId || "Imagweb"
  },
  url: `${siteUrl}/blog/${post.slug}`,
  datePublished: post.createdAt,
  dateModified: post.updatedAt
});

const BlogPostPage = ({ post, related, siteUrl }: Props) => {
  const canonical = `${siteUrl}/blog/${post.slug}`;
  const jsonLd = createBlogJsonLd(post, siteUrl);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-10">
      <Head>
        <title>{post.seo?.seoTitle || post.title}</title>
        <meta name="description" content={post.seo?.metaDescription || post.intro} />
        <meta property="og:title" content={post.seo?.openGraphTitle || post.title} />
        <meta property="og:description" content={post.seo?.openGraphDescription || post.intro} />
        <meta property="og:image" content={post.featuredImageUrl} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <article className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-sm text-orange-300 uppercase tracking-wide">{post.category}</p>
          <h1 className="text-4xl font-bold text-white">{post.title}</h1>
          <p className="text-slate-400 text-sm">
            {post.authorId && <span className="mr-2">By {post.authorId}</span>}
            {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
          </p>
          <div className="flex justify-center gap-3 text-sm text-slate-300">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${canonical}`} className="hover:text-orange-300">
              Share on X
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${canonical}`} className="hover:text-orange-300">
              LinkedIn
            </a>
          </div>
        </div>

        {post.featuredImageUrl && (
          <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative aspect-[16/9]">
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 960px, 100vw"
            />
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          <div className="space-y-6">
            <MarkdownRenderer content={post.contentHtml} />
          </div>
          <div className="space-y-4">
            <TableOfContents content={post.contentHtml} />
            <RelatedPosts posts={related} />
          </div>
        </div>
      </article>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await fetchPostBySlug(slug);
  if (!post) {
    return { notFound: true };
  }
  const related = await fetchRelatedPosts(post.category, post.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    props: {
      post,
      related,
      siteUrl
    }
  };
};

export default BlogPostPage;
