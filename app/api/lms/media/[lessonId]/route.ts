import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { enrollments, lessons } from "@/db/schema";
import { readUpload } from "@/lib/file-storage";

export async function GET(_request: Request, context: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await context.params;
  const db = getDb();
  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  if (!lesson?.contentUrl || lesson.lessonType !== "video") return new Response("Video not found", { status: 404 });
  if (!lesson.isPreview) {
    const user = await getChatGPTUser();
    if (!user) return new Response("Sign in required", { status: 401 });
    const [enrollment] = await db.select().from(enrollments).where(and(eq(enrollments.userEmail, user.email.toLowerCase()), eq(enrollments.courseId, lesson.courseId))).limit(1);
    if (!enrollment) return new Response("Enrollment required", { status: 403 });
  }
  const object = await readUpload(lesson.contentUrl);
  if (!object) return new Response("Video not found", { status: 404 });
  const headers = new Headers({ "content-type": object.type });
  headers.set("cache-control", lesson.isPreview ? "public, max-age=3600" : "private, no-store");
  return new Response(object.data, { headers });
}
