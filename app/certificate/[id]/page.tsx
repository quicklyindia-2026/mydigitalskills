import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { certificates, courses } from "@/db/schema";
import { PrintCertificateButton } from "@/components/LmsActions";
import { isLmsAdmin } from "@/lib/lms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Certificate", robots: { index: false, follow: false } };

export default async function Certificate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireChatGPTUser(`/certificate/${id}`);
  const [row] = await getDb().select({ certificate: certificates, course: courses }).from(certificates).innerJoin(courses, eq(certificates.courseId, courses.id)).where(eq(certificates.id, id));
  if (!row || (!isLmsAdmin(user.email) && row.certificate.userEmail.toLowerCase() !== user.email.toLowerCase())) notFound();
  const { certificate: c, course } = row;
  return <main className={`certificate-page ${c.certificateType}`}><div className="certificate-sheet"><div className="certificate-brand">MY<span>DIGITAL</span>SKILLS</div><p className="eyebrow">Certificate of Completion</p><h1>{c.certificateType === "premium" ? "Premium Professional Certificate" : "Achievement Certificate"}</h1><p>This certifies that</p><h2>{c.studentName}</h2><p>has successfully completed</p><h3>{course.title}</h3><div className="certificate-meta"><span>Final Score<br/><strong>{c.score}%</strong></span><span>Issued<br/><strong>{new Date(c.issuedAt).toLocaleDateString("en-IN")}</strong></span><span>Certificate No.<br/><strong>{c.certificateNo}</strong></span></div><p className="certificate-sign">Lambodar Patra<br/><small>Digital Growth Partner · MyDigitalSkills</small></p><PrintCertificateButton/></div></main>;
}
