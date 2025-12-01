import { NextRequest, NextResponse } from "next/server";
import { createPost, getAllPosts } from "@/lib/blog-engine/repository";

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json({ data: posts });
  } catch (error) {
    console.error("Failed to list posts", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const post = await createPost(payload);
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
