import { NextRequest, NextResponse } from "next/server";
import { createBlog, fetchBlogs } from "@/lib/server/blogAdmin";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") || undefined;
  const category = req.nextUrl.searchParams.get("category") || undefined;
  const authorId = req.nextUrl.searchParams.get("authorId") || undefined;
  const blogs = await fetchBlogs({ status, category, authorId });
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const created = await createBlog(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create blog";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
