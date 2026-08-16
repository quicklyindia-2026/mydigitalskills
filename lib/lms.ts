import { and, asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { courseSections, courses, enrollments, lessonProgress, lessons, paymentSettings, quizQuestions } from "@/db/schema";

export const LMS_ADMIN_EMAIL = "connect@mydigitalskills.in";

export const fallbackCourses = [
  { id: "course-dm", slug: "digital-marketing-mastery", title: "Digital Marketing Growth Mastery", description: "Build a complete growth system across search, content, social media, websites, leads and reporting.", level: "Beginner to Intermediate", coverImage: "/images/blog-digital-growth-system.webp", ebookUrl: "/ebooks/digital-marketing-growth-playbook.pdf", priceInr: 1499, status: "published", createdAt: "2026-08-12T00:00:00.000Z" },
  { id: "course-meta", slug: "meta-ads-lead-generation", title: "Meta Ads Lead Generation Masterclass", description: "Plan campaigns, improve lead quality, test creatives and scale with confident reporting.", level: "Intermediate", coverImage: "/images/blog-meta-ads-lead-quality.webp", ebookUrl: "/ebooks/meta-ads-lead-generation-blueprint.pdf", priceInr: 1999, status: "published", createdAt: "2026-08-12T00:00:00.000Z" },
  { id: "course-word", slug: "word-for-professional-work", title: "Microsoft Word for Professional Work", description: "Create business letters, proposals, reports and reusable documents with a clean workflow.", level: "Beginner", coverImage: "/images/learning-digital-skills.webp", ebookUrl: "/ebooks/microsoft-word-essentials.pdf", priceInr: 499, status: "published", createdAt: "2026-08-12T00:00:00.000Z" },
  { id: "course-excel", slug: "excel-for-business", title: "Microsoft Excel for Business", description: "Organize data, use practical formulas and create useful reports for day-to-day business.", level: "Beginner", coverImage: "/images/learning-digital-skills.webp", ebookUrl: "/ebooks/microsoft-excel-essentials.pdf", priceInr: 799, status: "published", createdAt: "2026-08-12T00:00:00.000Z" },
  { id: "course-powerpoint", slug: "powerpoint-presentation-mastery", title: "PowerPoint Presentation Mastery", description: "Turn ideas into clear business stories, professional slides and confident presentations.", level: "Beginner", coverImage: "/images/learning-digital-skills.webp", ebookUrl: "/ebooks/microsoft-powerpoint-essentials.pdf", priceInr: 599, status: "published", createdAt: "2026-08-12T00:00:00.000Z" },
  { id: "course-ai-tools", slug: "ai-tools-for-work", title: "AI Tools for Work & Business", description: "Use practical AI tools for research, writing, design, analysis and repeatable business workflows.", level: "Beginner", coverImage: "/images/learning-digital-skills.webp", ebookUrl: "/ebooks/ai-tools-for-work-and-business.pdf", priceInr: 999, status: "published", createdAt: "2026-08-12T00:00:00.000Z" },
  { id: "course-ai-prompt", slug: "practical-ai-prompting", title: "Practical AI Prompting", description: "Give AI better context, control the output, verify facts and create reusable prompt workflows.", level: "Beginner to Intermediate", coverImage: "/images/learning-digital-skills.webp", ebookUrl: "/ebooks/how-to-use-ai-practical-guide.pdf", priceInr: 799, status: "published", createdAt: "2026-08-12T00:00:00.000Z" },
];

export function isLmsAdmin(email: string) {
  return email.trim().toLowerCase() === LMS_ADMIN_EMAIL;
}

export async function getPublishedCourses() {
  try {
    return await getDb().select().from(courses).where(eq(courses.status, "published")).orderBy(asc(courses.title));
  } catch {
    return fallbackCourses;
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    const [course] = await getDb().select().from(courses).where(and(eq(courses.slug, slug), eq(courses.status, "published"))).limit(1);
    return course ?? fallbackCourses.find((item) => item.slug === slug) ?? null;
  } catch {
    return fallbackCourses.find((item) => item.slug === slug) ?? null;
  }
}

export async function getStudentCourses(email: string) {
  return getDb().select({ enrollment: enrollments, course: courses }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(eq(enrollments.userEmail, email.toLowerCase())).orderBy(asc(courses.title));
}

export async function getCourseLessons(courseId: string) {
  return getDb().select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(asc(lessons.sortOrder));
}

export async function getCurriculum(courseId: string) {
  const [sections, items] = await Promise.all([getDb().select().from(courseSections).where(eq(courseSections.courseId, courseId)).orderBy(asc(courseSections.sortOrder)), getCourseLessons(courseId)]);
  return sections.map((section) => ({ ...section, lessons: items.filter((lesson) => lesson.sectionId === section.id) }));
}

export async function getQuiz(courseId: string) { return getDb().select().from(quizQuestions).where(eq(quizQuestions.courseId, courseId)).orderBy(asc(quizQuestions.sortOrder)); }
export async function getPaymentSettings() { try { return (await getDb().select().from(paymentSettings).where(eq(paymentSettings.id, "primary")).limit(1))[0] ?? { provider: "manual", mode: "test", publicKey: null, merchantLabel: "MyDigitalSkills", enabled: false }; } catch { return { provider: "manual", mode: "test", publicKey: null, merchantLabel: "MyDigitalSkills", enabled: false }; } }

export async function recalculateProgress(email: string, courseId: string) {
  const db = getDb();
  const [{ count: total }] = await db.select({ count: sql<number>`count(*)` }).from(lessons).where(eq(lessons.courseId, courseId));
  const [{ count: done }] = await db.select({ count: sql<number>`count(*)` }).from(lessonProgress).innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id)).where(and(eq(lessonProgress.userEmail, email.toLowerCase()), eq(lessonProgress.completed, true), eq(lessons.courseId, courseId)));
  const percent = total ? Math.round((Number(done) / Number(total)) * 100) : 0;
  await db.update(enrollments).set({ progressPercent: percent }).where(and(eq(enrollments.userEmail, email.toLowerCase()), eq(enrollments.courseId, courseId)));
  return percent;
}
