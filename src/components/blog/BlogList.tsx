import { useMemo, useState } from "react";
import BlogCard from "./BlogCard";
import type { BlogPost } from "@/lib/blogService";
import PaginationControls from "./PaginationControls";

interface Props {
  posts: BlogPost[];
  pageSize?: number;
}

const BlogList = ({ posts, pageSize = 6 }: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return posts.slice(start, start + pageSize);
  }, [page, pageSize, posts]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginated.map((post) => (
          <BlogCard key={post.id || post.slug} post={post} />
        ))}
      </div>
      {totalPages > 1 && <PaginationControls current={page} total={totalPages} onChange={setPage} />}
    </div>
  );
};

export default BlogList;
