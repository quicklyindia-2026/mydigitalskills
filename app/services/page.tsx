import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteChrome";
import { PagePortrait, PerformanceVisual } from "@/components/AnimatedVisuals";

export const metadata: Metadata = { title: "Digital Growth Services", description: "Websites, Meta Ads, social media, GMB, automation and branding services by MyDigitalSkills." };

const services = [
  ["Website & App Solutions", "Websites that look professional and help customers take action.", ["Corporate and service websites", "Landing pages and lead funnels", "Booking, billing and enquiry systems", "Business portals and dashboards", "Website redesign and maintenance"]],
  ["Meta Ads & Lead Generation", "Performance campaigns planned around lead quality, sales and practical follow-up.", ["Campaign strategy and setup", "Audience and location targeting", "Creative and copy planning", "Pixel and conversion tracking", "Optimization and reporting"]],
  ["Social Media Marketing", "Consistent brand communication supported by content, creative and paid reach.", ["Monthly content strategy", "Posts, reels and stories", "Event and offer promotions", "Community management", "Performance reporting"]],
  ["Google Business Profile", "Local presence designed to improve discovery, trust and enquiries.", ["Profile setup and audit", "Category and service optimization", "Posts and photo strategy", "Review growth system", "Multi-location support"]],
  ["Business Automation", "Simple systems that reduce manual follow-up and organize leads better.", ["CRM and lead pipelines", "WhatsApp workflows", "Booking and enquiry automation", "Staff and customer dashboards", "Marketing process improvement"]],
  ["Branding & Creative", "Sales-ready assets that keep your brand clear and consistent.", ["Company profiles and catalogues", "Ad and social creatives", "Presentations and proposals", "Brand direction", "Campaign concepts"]],
];

export default function ServicesPage() {
  return <SiteShell><main>
    <section className="page-hero visual-page-hero"><div className="container page-hero-split"><div><p className="eyebrow">Services</p><h1>Strategy, technology and marketing—built around <span>business growth.</span></h1><p>Choose one focused service or combine multiple capabilities into a complete digital growth plan.</p></div><PagePortrait pose="pointing"/></div></section>
    <section className="section"><div className="container card-grid">
      {services.map(([title, copy, items], i) => <article className="service-card" key={title as string}><div className="service-no">0{i + 1}</div><h3>{title as string}</h3><p>{copy as string}</p><ul>{(items as string[]).map(item => <li key={item}>{item}</li>)}</ul><a className="card-link" href="/contact">Discuss this service →</a></article>)}
    </div></section>
    <section className="section section-soft"><div className="container results-split"><div><p className="eyebrow">Performance visibility</p><h2>See what is working. Improve what is <span className="red-text">not.</span></h2><p className="lead-copy">A clear dashboard view connects campaign performance, website activity, leads and follow-up.</p></div><PerformanceVisual compact/></div></section>
    <section className="section"><div className="container cta-band"><p className="eyebrow">Not sure what you need?</p><h2>Start with a free consultation.</h2><p>Share your goal and current challenge. I’ll help you identify the right first step.</p><div className="hero-actions"><a className="button button-gold" href="/contact">Book Free Consultation →</a></div></div></section>
  </main></SiteShell>;
}
