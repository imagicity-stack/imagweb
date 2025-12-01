import { NextRequest, NextResponse } from "next/server";
import { deleteBlog, fetchBlogById, updateBlog } from "@/lib/server/blogAdmin";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await fetchBlogById(id);
  return NextResponse.json(blog);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await req.json();
    const updated = await updateBlog(id, payload);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteBlog(id);
  return NextResponse.json({ ok: true });
}
