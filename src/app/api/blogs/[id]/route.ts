import { NextRequest, NextResponse } from "next/server";
import { deleteBlog, fetchBlogById, updateBlog } from "@/lib/server/blogAdmin";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const blog = await fetchBlogById(params.id);
  return NextResponse.json(blog);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await req.json();
    const updated = await updateBlog(params.id, payload);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await deleteBlog(params.id);
  return NextResponse.json({ ok: true });
}
