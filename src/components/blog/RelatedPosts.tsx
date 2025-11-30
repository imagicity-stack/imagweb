import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blogService";

interface Props {
  posts: BlogPost[];
}

const RelatedPosts = ({ posts }: Props) => {
  if (!posts.length) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
      <h3 className="text-xl font-semibold text-white">Related posts</h3>
      <div className="space-y-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <div className="flex items-start gap-3">
              {post.featuredImageUrl && (
                <Image
                  src={post.featuredImageUrl}
                  alt={post.title}
                  width={80}
                  height={64}
                  className="w-20 h-16 object-cover rounded-lg border border-slate-800"
                />
              )}
              <div>
                <p className="text-sm text-slate-400">{post.category}</p>
                <p className="text-white font-semibold group-hover:text-cyan-300">{post.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
