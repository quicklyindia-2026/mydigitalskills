import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { enrollments, lessonProgress, lessons } from "@/db/schema";
import { recalculateProgress } from "@/lib/lms";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const lessonId = String(body.lessonId ?? "");
  const db = getDb();
  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  if (!lesson) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  const email = user.email.toLowerCase();
  const [enrollment] = await db.select().from(enrollments).where(and(eq(enrollments.userEmail, email), eq(enrollments.courseId, lesson.courseId))).limit(1);
  if (!enrollment) return NextResponse.json({ error: "Enrollment required." }, { status: 403 });
  await db.insert(lessonProgress).values({ id: crypto.randomUUID(), userEmail: email, lessonId, completed: Boolean(body.completed), updatedAt: new Date().toISOString() }).onDuplicateKeyUpdate({ set: { completed: Boolean(body.completed), updatedAt: new Date().toISOString() } });
  return NextResponse.json({ ok: true, progressPercent: await recalculateProgress(email, lesson.courseId) });
}
