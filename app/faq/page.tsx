import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Frequently Asked Questions", description: "Answers about MyDigitalSkills courses, certificates, learning access and digital growth services." };

const faqs = [
  ["Who can learn with MyDigitalSkills?", "Beginners, working professionals, business owners and anyone who wants practical digital skills can enrol."],
  ["Are free courses and eBooks available?", "Yes. The learning catalog includes free resources as well as paid, structured courses."],
  ["How does course access work?", "After enrolment, available lessons, videos, eBooks, progress and assessments appear in your learning dashboard."],
  ["Do courses include certificates?", "Eligible courses include a certificate after the required lessons and final assessment are completed."],
  ["Can I get help before purchasing?", "Yes. Contact us by WhatsApp, phone or email and we will help you choose the right learning path."],
  ["Do you also provide business services?", "Yes. MyDigitalSkills provides websites, Meta Ads, social media, GMB, automation and growth consulting."],
];

export default function FAQPage(){return <SiteShell><main><section className="page-hero"><div className="container"><p className="eyebrow">Help centre</p><h1>Frequently asked <span>questions.</span></h1><p>Clear answers about learning, certificates, access and services.</p></div></section><section className="section"><div className="container faq-home"><div className="faq-list">{faqs.map(([q,a])=><details className="faq-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section></main></SiteShell>}
