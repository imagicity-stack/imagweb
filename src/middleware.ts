import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (!pathname.startsWith("/blog/")) {
    return NextResponse.next();
  }

  const slugOnly = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
  const slugPath = pathname.replace(/^\//, "").replace(/\/$/, "");

  const lookupUrl = new URL("/api/redirect", req.url);
  lookupUrl.searchParams.set("slug", slugOnly);
  lookupUrl.searchParams.set("path", slugPath);

  try {
    const res = await fetch(lookupUrl.toString(), { cache: "no-store" });
    if (!res.ok) return NextResponse.next();

    const data = (await res.json()) as { destination?: string | null };
    if (!data.destination) return NextResponse.next();

    const destination = data.destination.startsWith("/") ? data.destination : `/${data.destination}`;
    return NextResponse.redirect(new URL(destination, req.url), 301);
  } catch (error) {
    console.error("Redirect middleware failed", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/blog/:path*"]
};
