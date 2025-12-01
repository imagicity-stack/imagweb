import { NextRequest, NextResponse } from "next/server";
import { fetchInternalSuggestions } from "@/lib/server/blogAdmin";

export async function GET(req: NextRequest) {
  const queryText = req.nextUrl.searchParams.get("q") || undefined;
  const links = await fetchInternalSuggestions(queryText);
  return NextResponse.json(links);
}
