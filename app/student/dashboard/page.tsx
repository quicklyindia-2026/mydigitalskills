import type { Metadata } from "next";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { requireChatGPTUser, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { SiteShell } from "@/components/SiteChrome";
import { LessonProgressButton, QuizPanel } from "@/components/LmsActions";
import { getDb } from "@/db";
import { certificates, lessonProgress } from "@/db/schema";
import { getCurriculum, getQuiz, getStudentCourses } from "@/lib/lms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Student Dashboard", robots: { index: false, follow: false } };

export default async function StudentDashboard() {
  const user = await requireChatGPTUser("/student/dashboard");
  let data: Awaited<ReturnType<typeof getStudentCourses>> = [];
  let ready = true;
  try { data = await getStudentCourses(user.email); } catch { ready = false; }
  return <SiteShell><main><section className="admin-hero"><div className="container"><p className="eyebrow">Student Classroom</p><h1>Welcome, {user.displayName}</h1><p>Learn section by section, pass the final quiz and earn your certificate.</p><div className="hero-actions"><Link className="button button-primary" href="/courses">Browse Courses</Link><a className="button button-light" href={chatGPTSignOutPath("/")}>Sign out</a></div></div></section><section className="section section-soft"><div className="container narrow">{!ready ? <div className="checkout-card"><h2>Your dashboard is being prepared</h2></div> : data.length ? <div className="student-courses">{await Promise.all(data.map(async ({ enrollment, course }) => {
    const curriculum = await getCurriculum(course.id); const quiz=await getQuiz(course.id);
    const progressRows = await getDb().select().from(lessonProgress).where(and(eq(lessonProgress.userEmail, user.email.toLowerCase()), eq(lessonProgress.completed, true)));
    const completedIds = new Set(progressRows.map((item) => item.lessonId));
    const [cert]=await getDb().select().from(certificates).where(and(eq(certificates.userEmail,user.email.toLowerCase()),eq(certificates.courseId,course.id)));
    return <article className="student-course" key={course.id}><div className="student-course-head"><div><p className="eyebrow">Enrolled course</p><h2>{course.title}</h2></div><strong>{enrollment.progressPercent}%</strong></div><div className="progress-track"><span style={{ width: `${enrollment.progressPercent}%` }} /></div>{curriculum.map((section)=><section className="curriculum-block" key={section.id}><h3>{section.title}</h3><div className="lesson-list">{section.lessons.map((lesson,index)=><div className="lesson-row" key={lesson.id}><span>{String(index+1).padStart(2,"0")}</span><div><strong>{lesson.title}</strong><p>{lesson.notes||`${lesson.durationMinutes} minute ${lesson.lessonType} lesson`}</p>{lesson.lessonType==="video"&&lesson.contentUrl&&<video className="lesson-video" controls preload="metadata" src={lesson.contentUrl.startsWith("http")?lesson.contentUrl:`/api/lms/media/${lesson.id}`}/>} {lesson.lessonType==="ebook"&&lesson.contentUrl&&<a className="card-link" href={lesson.contentUrl}>Open eBook →</a>}</div><LessonProgressButton lessonId={lesson.id} completed={completedIds.has(lesson.id)}/></div>)}</div></section>)}{cert?<Link className="button button-primary" href={`/certificate/${cert.id}`}>View My Certificate →</Link>:enrollment.progressPercent===100&&quiz.length>0?<QuizPanel courseId={course.id} questions={quiz} passScore={course.passScore}/>:<p className="checkout-note">Complete every lesson to unlock the final quiz and certificate.</p>}</article>;
  }))}</div> : <div className="checkout-card"><p className="eyebrow">No active class yet</p><h2>Choose your first course</h2><p>Free courses activate instantly; paid courses appear after payment confirmation.</p><Link className="button button-primary" href="/courses">Explore Courses →</Link></div>}</div></section></main></SiteShell>;
}
