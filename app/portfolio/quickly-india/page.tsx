import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Quickly India Business Directory Case Study",
  description:
    "Quickly India business directory and listing management system case study by Lambodar Patra.",
};

const platformAreas = [
  ["Business Listings", "Businesses can be organized by category, location and service type for easier customer discovery."],
  ["Services & Products", "Dedicated content paths for service providers and product-based businesses."],
  ["Jobs & Events", "Additional discovery categories for local jobs, business events and customer opportunities."],
  ["Travel & Local Places", "Location-led content for tourist attractions and useful local destinations."],
  ["Business Profiles", "Individual profile pages designed to present business information, services and contact actions."],
  ["Admin Management", "A central workflow for managing categories, listings, content and platform visibility."],
];

export default function QuicklyIndiaCaseStudy() {
  return (
    <SiteShell>
      <main>
        <section className="page-hero">
          <div className="container">
            <p className="eyebrow">Case Study · Business Directory Platform</p>
            <h1>Quickly India <span>Business Directory System.</span></h1>
            <p>A digital discovery platform planned to help users find businesses, services, products, jobs, events and useful local information through one structured directory.</p>
          </div>
        </section>

        <section className="section">
          <div className="container content-grid">
            <article className="detail-card">
              <p className="eyebrow">The opportunity</p>
              <h2>Make local business discovery simpler.</h2>
              <p>Small businesses often have scattered information across social media and local platforms. Quickly India brings key business details, offerings and contact actions into organized, searchable profile pages.</p>
            </article>
            <article className="detail-card">
              <p className="eyebrow">My role</p>
              <h2>Platform planning and growth direction.</h2>
              <p>The work includes product structure, category planning, website experience, business onboarding flows, listing monetization ideas, digital marketing and future automation opportunities.</p>
            </article>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">System modules</p><h2>More than a listing page—an expandable <span className="red-text">business ecosystem.</span></h2></div>
              <p>The platform structure supports multiple discovery categories while keeping the customer journey simple.</p>
            </div>
            <div className="card-grid">
              {platformAreas.map(([title, copy], index) => (
                <article className="service-card" key={title}>
                  <div className="service-no">0{index + 1}</div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container content-grid">
            <article className="detail-card">
              <p className="eyebrow">Business model</p>
              <h2>Built for business onboarding and growth.</h2>
              <ul>
                <li>Free business listing as the entry offer</li>
                <li>Enhanced or premium listing opportunities</li>
                <li>Digital business profile and catalogue features</li>
                <li>Lead-generation and promotional services</li>
                <li>Future GMB, WhatsApp and social automation tools</li>
              </ul>
            </article>
            <article className="detail-card">
              <p className="eyebrow">My contribution</p>
              <h2>From concept to digital growth system.</h2>
              <ul>
                <li>Platform and page architecture</li>
                <li>Business categories and listing structure</li>
                <li>User and admin experience planning</li>
                <li>Brand positioning and content direction</li>
                <li>SEO, onboarding and monetization roadmap</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="container cta-band">
            <p className="eyebrow">Need a similar platform?</p>
            <h2>Let’s plan your directory, portal or business system.</h2>
            <p>From product structure to website experience and marketing, MyDigitalSkills can help shape the complete digital solution.</p>
            <div className="hero-actions"><Link className="button button-gold" href="/contact">Get Free Consultation →</Link><Link className="button button-light" href="/portfolio">Back to Portfolio</Link></div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
