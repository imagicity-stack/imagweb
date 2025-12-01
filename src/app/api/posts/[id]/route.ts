import { NextRequest, NextResponse } from "next/server";
import { deletePost, getPostById, updatePost } from "@/lib/blog-engine/repository";

interface Params {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const post = await getPostById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Failed to fetch post", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const payload = await request.json();
    const updated = await updatePost(params.id, payload);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Failed to update post", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await deletePost(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete post", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
