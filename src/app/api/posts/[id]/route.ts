import { NextResponse } from "next/server";
import { fetchPostById, updatePost } from "@/lib/blog-engine/repository";

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const post = await fetchPostById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: post });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const payload = await request.json();
    const updated = await updatePost(params.id, payload);
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
