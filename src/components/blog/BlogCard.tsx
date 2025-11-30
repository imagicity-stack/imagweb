import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blogService";

interface Props {
  post: BlogPost;
}

const BlogCard = ({ post }: Props) => {
  return (
    <article className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
      {post.featuredImageUrl && (
        <div className="h-56 overflow-hidden relative">
          <Image
            src={post.featuredImageUrl}
            alt={post.title}
            fill
            className="object-cover transition duration-500 hover:scale-105"
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 320px, 100vw"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-cyan-300">{post.category}</span>
          <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="text-2xl font-semibold text-white hover:text-cyan-300 transition">
          {post.title}
        </Link>
        <p className="text-slate-300 flex-1">{post.intro}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs uppercase tracking-wide text-cyan-200 bg-slate-800 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
