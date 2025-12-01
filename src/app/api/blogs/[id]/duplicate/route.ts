import { NextResponse } from "next/server";
import { duplicateBlog } from "@/lib/server/blogAdmin";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const duplicate = await duplicateBlog(params.id);
    return NextResponse.json(duplicate, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to duplicate";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
