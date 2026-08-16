import { NextResponse } from "next/server";
import { readUpload } from "@/lib/file-storage";
export async function GET(request: Request, { params }: { params: Promise<{ courseId: string; kind: string }> }) {
  const { kind } = await params;
  if (!["cover", "ebook"].includes(kind)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const key = new URL(request.url).searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const object = await readUpload(key);
  if (!object) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new Response(object.data, { headers: { "content-type": object.type, "cache-control": kind === "cover" ? "public, max-age=86400" : "private, max-age=3600" } });
}
