import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { lessons } from "@/db/schema";
import { isLmsAdmin } from "@/lib/lms";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user || !isLmsAdmin(user.email)) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  if (!body.courseId || !body.title) return NextResponse.json({ error: "Course and lesson title are required." }, { status: 400 });
  await getDb().insert(lessons).values({ id: crypto.randomUUID(), courseId: String(body.courseId), sectionId:String(body.sectionId||"")||null, title: String(body.title), lessonType: String(body.lessonType ?? "video"), contentUrl: String(body.contentUrl || "") || null, notes: String(body.notes || "") || null, durationMinutes: Math.max(0, Number(body.durationMinutes) || 0), sortOrder: Math.max(1, Number(body.sortOrder) || 1), isPreview: Boolean(body.isPreview), createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
