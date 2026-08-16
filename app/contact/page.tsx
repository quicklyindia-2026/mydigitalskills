import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteChrome";
import { ConsultationForm } from "@/components/ConsultationForm";

export const metadata: Metadata = { title: "Free Consultation", description: "Contact Lambodar Patra for a free website and digital growth consultation." };

export default function ContactPage() {
  return <SiteShell><main>
    <section className="page-hero"><div className="container"><p className="eyebrow">Let’s talk</p><h1>Start with a free <span>website consultation.</span></h1><p>Tell me what you are building, what is not working, or where you want to grow. I’ll help you identify the right next step.</p></div></section>
    <section className="section"><div className="container contact-grid">
      <aside className="contact-panel"><p className="eyebrow">Direct contact</p><h2>MyDigitalSkills</h2><p>For websites, Meta Ads, digital marketing, GMB, automation and business growth solutions.</p><div className="contact-list"><a href="tel:+918128729003">Call: +91 81287 29003</a><a href="mailto:connect@mydigitalskills.in">connect@mydigitalskills.in</a><a href="https://www.instagram.com/mydigitalskills.in/" target="_blank" rel="noreferrer">@mydigitalskills.in</a><span>Noida, India</span></div></aside>
      <ConsultationForm />
    </div></section>
  </main></SiteShell>;
}
