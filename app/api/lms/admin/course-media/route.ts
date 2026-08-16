import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { courses } from "@/db/schema";
import { isLmsAdmin } from "@/lib/lms";
import { saveUpload } from "@/lib/file-storage";

export async function POST(r: Request) {
  const u = await getChatGPTUser();
  if (!u || !isLmsAdmin(u.email)) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const f = await r.formData(), file = f.get("file"), courseId = String(f.get("courseId") || ""), kind = String(f.get("kind") || "");
  if (!(file instanceof File) || !courseId || !["cover", "ebook"].includes(kind)) return NextResponse.json({ error: "Course, media type and file required." }, { status: 400 });
  if (kind === "cover" && !file.type.startsWith("image/")) return NextResponse.json({ error: "Cover must be an image." }, { status: 400 });
  if (kind === "ebook" && file.type !== "application/pdf") return NextResponse.json({ error: "eBook must be a PDF." }, { status: 400 });
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: "File must be 25 MB or smaller." }, { status: 400 });
  const key = `courses/${courseId}/${kind}-${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]+/g, "-")}`;
  await saveUpload(key, file);
  const url = `/api/lms/course-media/${courseId}/${kind}?key=${encodeURIComponent(key)}`;
  await getDb().update(courses).set(kind === "cover" ? { coverImage: url } : { ebookUrl: url }).where(eq(courses.id, courseId));
  return NextResponse.json({ ok: true, url });
}
