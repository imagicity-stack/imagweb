import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "";
  const path = searchParams.get("path") || "";

  if (!adminDb || (!slug && !path)) {
    return NextResponse.json({ destination: null }, { status: 200 });
  }

  const redirectsRef = adminDb.collection("redirects");

  const snapshot = await redirectsRef.where("oldSlug", "==", slug).orderBy("timestamp", "desc").limit(1).get();
  let redirectDoc = snapshot.docs[0]?.data();

  if (!redirectDoc) {
    const altSnap = await redirectsRef.where("oldSlug", "==", path).orderBy("timestamp", "desc").limit(1).get();
    redirectDoc = altSnap.docs[0]?.data();
  }

  const destination = redirectDoc?.newSlug || null;
  return NextResponse.json({ destination }, { status: 200 });
}
