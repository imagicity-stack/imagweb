import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import withAdminAuth from "@/components/admin/withAdminAuth";
import AdminBlogForm from "@/components/blog/AdminBlogForm";
import type { BlogPost, BlogPostInput } from "@/lib/blogService";
import {
  createBlogPost,
  deleteBlogPost,
  fetchAllPosts,
  updateBlogPost
} from "@/lib/blogService";
import { auth } from "@/lib/firebase";

const Dashboard = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [active, setActive] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const data = await fetchAllPosts();
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPosts();
  }, [loadPosts]);

  const handleSubmit = async (data: BlogPostInput) => {
    if (active?.id) {
      await updateBlogPost(active.id, data);
    } else {
      await createBlogPost(data);
    }
    setActive(null);
    await loadPosts();
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteBlogPost(id);
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Head>
        <title>Admin Dashboard | Imagweb</title>
      </Head>
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
        <div>
          <p className="text-sm text-slate-400">Imagweb Blog Admin</p>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        </div>
        <button
          onClick={() => (auth ? signOut(auth) : router.replace("/admin/login"))}
          className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-cyan-400"
        >
          Sign out
        </button>
      </header>

      <main className="grid lg:grid-cols-3 gap-6 p-6">
        <section className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">{active ? "Edit Blog" : "Create New Blog"}</h2>
          <AdminBlogForm onSubmit={handleSubmit} activePost={active} onCancelEdit={() => setActive(null)} />
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Existing Posts</h2>
            {loading && <span className="text-xs text-cyan-300">Loading...</span>}
          </div>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 flex items-start gap-3"
              >
                {post.featuredImageUrl && (
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.title}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-800"
                  />
                )}
                <div className="flex-1">
                  <p className="text-xs text-slate-400">{post.category}</p>
                  <p className="font-semibold text-white">{post.title}</p>
                  <p className="text-xs text-slate-500">{post.isPublished ? "Published" : "Draft"}</p>
                  <div className="flex gap-3 mt-2 text-sm">
                    <button
                      className="text-cyan-300 hover:text-cyan-200"
                      onClick={() => setActive(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-rose-400 hover:text-rose-300"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!posts.length && !loading && <p className="text-sm text-slate-400">No posts yet. Create one!</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default withAdminAuth(Dashboard);
