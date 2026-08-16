import type { Metadata } from "next";
import { asc, desc, eq } from "drizzle-orm";
import { requireChatGPTUser, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { SiteShell } from "@/components/SiteChrome";
import { AdminLmsPanel } from "@/components/LmsActions";
import { BackendAdminPanel } from "@/components/BackendAdminPanel";
import { getDb } from "@/db";
import { blogPosts, certificates, courses, enquiries, orders, portfolioItems, studentProfiles } from "@/db/schema";
import { isLmsAdmin } from "@/lib/lms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "LMS Admin", robots: { index: false, follow: false } };

export default async function AdminLmsPage() {
  const user = await requireChatGPTUser("/admin/lms");
  if (!isLmsAdmin(user.email)) return <SiteShell><main><section className="section"><div className="container narrow"><div className="checkout-card"><p className="eyebrow">Restricted backend</p><h1>Admin access required</h1><p>Please sign in with <strong>connect@mydigitalskills.in</strong> to manage the LMS.</p><a className="button button-dark" href={chatGPTSignOutPath("/admin/lms")}>Sign out</a></div></div></section></main></SiteShell>;

  let allCourses: typeof courses.$inferSelect[] = [];
  let pending: Array<typeof orders.$inferSelect & { courseTitle: string }> = [];
  let students: typeof studentProfiles.$inferSelect[]=[];
  let leads:typeof enquiries.$inferSelect[]=[], blogs:typeof blogPosts.$inferSelect[]=[], portfolio:typeof portfolioItems.$inferSelect[]=[], allCertificates:typeof certificates.$inferSelect[]=[];
  let databaseReady = true;
  try {
    const db = getDb();
    [allCourses,students,leads,blogs,portfolio,allCertificates] = await Promise.all([db.select().from(courses).orderBy(asc(courses.title)),db.select().from(studentProfiles),db.select().from(enquiries).orderBy(desc(enquiries.createdAt)),db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)),db.select().from(portfolioItems).orderBy(asc(portfolioItems.sortOrder)),db.select().from(certificates)]);
    const orderRows = await db.select({ order: orders, courseTitle: courses.title }).from(orders).innerJoin(courses, eq(orders.courseId, courses.id)).where(eq(orders.status, "pending"));
    pending = orderRows.map((row) => ({ ...row.order, courseTitle: row.courseTitle }));
  } catch { databaseReady = false; }

  return <SiteShell><main><section className="admin-hero"><div className="container"><div><p className="eyebrow">MyDigitalSkills Backend</p><h1>Business & LMS Control Center</h1><p>Manage website content, leads, blogs, portfolio, courses, students, payments and certificates from one secure dashboard.</p><nav className="admin-quick-nav"><a href="#leads">Leads</a><a href="#content">Content</a><a href="#students">Students</a><a href="#lms">LMS Tools</a></nav></div><div className="admin-stats"><div><strong>{leads.length}</strong><span>Business Leads</span></div><div><strong>{students.length}</strong><span>Students</span></div><div><strong>{allCourses.length}</strong><span>Courses</span></div><div><strong>{allCertificates.length}</strong><span>Certificates</span></div></div></div></section><section className="section section-soft"><div className="container">{databaseReady ? <><BackendAdminPanel leads={leads.map(({id,name,phone,service,business,status,createdAt})=>({id,name,phone,service,business,status,createdAt}))} blogs={blogs.map(({id,title,status,category})=>({id,title,status,category}))} portfolio={portfolio.map(({id,title,sector,status})=>({id,title,sector,status}))}/><section className="admin-card" id="students"><div className="admin-title-row"><div><p className="eyebrow">Academy CRM</p><h2>Student Profiles</h2></div><span className="admin-count">{students.length}</span></div>{students.length?<div className="admin-list">{students.map(s=><div className="admin-row" key={s.accountEmail}><div><strong>{s.fullName}</strong><span>{s.mobile} · {s.contactEmail} · {s.city||"City not given"}</span></div></div>)}</div>:<p>New enrollment details will appear here.</p>}</section><div id="lms"><AdminLmsPanel courseOptions={allCourses.map(({ id, title }) => ({ id, title }))} pendingOrders={pending.map(({ id, userEmail, amountInr, status, courseTitle }) => ({ id, userEmail, amountInr, status, courseTitle }))} /></div></> : <div className="checkout-card"><h2>Database is being provisioned</h2><p>The complete admin interface is ready. Deploy this update to provision its new business-content tables.</p></div>}</div></section></main></SiteShell>;
}
