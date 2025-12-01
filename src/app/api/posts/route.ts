import { NextResponse } from "next/server";
import { createPost, fetchPosts } from "@/lib/blog-engine/repository";

export async function GET() {
  try {
    const posts = await fetchPosts();
    return NextResponse.json({ data: posts });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const post = await createPost(payload);
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
