import { NextRequest, NextResponse } from "next/server";
import { deletePost, getPostById, updatePost } from "@/lib/blog-engine/repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const post = await getPostById(id);
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Failed to fetch post", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const payload = await request.json();
    const updated = await updatePost(id, payload);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Failed to update post", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete post", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
