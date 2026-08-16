import type { Metadata } from "next";
import Link from "next/link";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { SiteShell } from "@/components/SiteChrome";
import { CheckoutRequest } from "@/components/LmsActions";
import { getCourseBySlug } from "@/lib/lms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Course Enrollment", robots: { index: false, follow: false } };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const { course: slug = "" } = await searchParams;
  const user = await requireChatGPTUser(`/checkout?course=${encodeURIComponent(slug)}`);
  const course = await getCourseBySlug(slug);
  return <SiteShell><main><section className="section section-soft"><div className="container narrow">{course ? <div className="checkout-card"><p className="eyebrow">Course enrollment</p><h1>{course.title}</h1><p>{course.description}</p><div className="checkout-line"><span>Course fee</span><strong>{course.priceInr===0?"FREE":`₹${course.priceInr.toLocaleString("en-IN")}`}</strong></div><div className="checkout-note"><strong>{course.priceInr===0?"Instant access":"Secure enrollment request"}</strong><p>{course.priceInr===0?"Submit your details to enroll and open the classroom instantly.":"Your request is saved in the admin dashboard. Manual WhatsApp confirmation is active while your online gateway is connected."}</p></div><CheckoutRequest slug={course.slug} name={user.displayName||""} email={user.email} free={course.priceInr===0}/></div> : <div className="checkout-card"><h1>Course not found</h1><Link className="button button-primary" href="/courses">Back to Courses</Link></div>}</div></section></main></SiteShell>;
}
