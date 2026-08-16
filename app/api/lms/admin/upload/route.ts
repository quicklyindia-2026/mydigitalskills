import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { lessons } from "@/db/schema";
import { isLmsAdmin } from "@/lib/lms";
import { saveUpload } from "@/lib/file-storage";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user || !isLmsAdmin(user.email)) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const form = await request.formData();
  const file = form.get("file");
  const courseId = String(form.get("courseId") ?? "");
  const title = String(form.get("title") ?? "").trim();
  if (!(file instanceof File) || !courseId || !title) return NextResponse.json({ error: "Course, title and video file are required." }, { status: 400 });
  if (!file.type.startsWith("video/")) return NextResponse.json({ error: "Please upload a video file." }, { status: 400 });
  if (file.size > 200 * 1024 * 1024) return NextResponse.json({ error: "Video must be 200 MB or smaller." }, { status: 400 });
  const lessonId = crypto.randomUUID();
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-80);
  const key = `lessons/${courseId}/${lessonId}-${safeName}`;
  await saveUpload(key, file);
  await getDb().insert(lessons).values({ id: lessonId, courseId, title, lessonType: "video", contentUrl: key, notes: String(form.get("notes") ?? "") || null, durationMinutes: Math.max(0, Number(form.get("durationMinutes")) || 0), sortOrder: Math.max(1, Number(form.get("sortOrder")) || 1), isPreview: form.get("isPreview") === "on", createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, lessonId });
}
