import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (!pathname.startsWith("/blog/")) {
    return NextResponse.next();
  }
  const slugOnly = pathname.replace(/^\/blog\//, "").replace(/\/$/, "");
  const slugPath = pathname.replace(/^\//, "").replace(/\/$/, "");
  if (!adminDb) return NextResponse.next();
  const redirectsRef = adminDb.collection("redirects");
  const snapshot = await redirectsRef.where("oldSlug", "==", slugOnly).orderBy("timestamp", "desc").limit(1).get();
  let redirectDoc = snapshot.docs[0]?.data();
  if (!redirectDoc) {
    const altSnap = await redirectsRef.where("oldSlug", "==", slugPath).orderBy("timestamp", "desc").limit(1).get();
    redirectDoc = altSnap.docs[0]?.data();
  }
  if (!redirectDoc) return NextResponse.next();
  const destination = redirectDoc.newSlug.startsWith("/") ? redirectDoc.newSlug : `/${redirectDoc.newSlug}`;
  return NextResponse.redirect(new URL(destination, req.url), 301);
}

export const config = {
  matcher: ["/blog/:path*"]
};
