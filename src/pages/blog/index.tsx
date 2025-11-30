import Head from "next/head";
import { GetStaticProps } from "next";
import BlogList from "@/components/blog/BlogList";
import type { BlogPost } from "@/lib/blogService";
import { fetchPublishedPosts } from "@/lib/blogService";

interface Props {
  posts: BlogPost[];
  siteUrl: string;
}

const BlogIndex = ({ posts, siteUrl }: Props) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-10">
      <Head>
        <title>Blog | Imagweb</title>
        <meta name="description" content="Insights, tutorials, and updates from the Imagweb team." />
        <link rel="canonical" href={`${siteUrl}/blog`} />
      </Head>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <p className="text-cyan-300 text-sm">Blog</p>
          <h1 className="text-4xl font-bold text-white">Latest articles</h1>
          <p className="text-slate-300">Stories, engineering notes, and marketing breakdowns from the agency.</p>
        </div>
        <BlogList posts={posts} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await fetchPublishedPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    props: {
      posts,
      siteUrl
    },
    revalidate: 60
  };
};

export default BlogIndex;
