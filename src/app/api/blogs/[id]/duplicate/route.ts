import { NextRequest, NextResponse } from "next/server";
import { duplicateBlog } from "@/lib/server/blogAdmin";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const duplicate = await duplicateBlog(id);
    return NextResponse.json(duplicate, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to duplicate";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
