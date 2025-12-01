import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  if (!adminStorage) return NextResponse.json([], { status: 200 });
  const blogId = req.nextUrl.searchParams.get("blogId");
  if (!blogId) return NextResponse.json({ error: "blogId required" }, { status: 400 });
  const [files] = await adminStorage.bucket().getFiles({ prefix: `blogs/${blogId}/media/` });
  const signedUrls = await Promise.all(files.map((file) => file.getSignedUrl({ action: "read", expires: Date.now() + 3600 * 1000 })));
  return NextResponse.json(
    signedUrls.map(([url], idx) => ({
      name: files[idx].name,
      url
    }))
  );
}
