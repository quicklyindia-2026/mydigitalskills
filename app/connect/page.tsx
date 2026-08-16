import type { Metadata } from "next";
import { MetaLeadForm } from "@/components/MetaLeadForm";
import { PerformanceVisual } from "@/components/AnimatedVisuals";

export const metadata: Metadata = {
  title: "Meta Ads & Performance Marketing Expert | Lambodar Patra",
  description: "Get Meta Ads and performance marketing support from Lambodar Patra, with 7+ years of multi-industry experience and approximately ₹1 crore in ad budget handled.",
  alternates: { canonical: "/connect" },
  openGraph: {
    title: "Scale with Meta Ads — Lambodar Patra",
    description: "7+ years of Meta Ads and performance marketing experience across education, hospitality, real estate and service businesses.",
    images: [{ url: "/images/lambodar-digital.png", width: 1024, height: 1024 }],
  },
};

const portfolio = [
  { sector: "Education", names: "Brain Bunny Juniors International Preschool", result: "Brand, lead generation and franchise-focused growth campaigns." },
  { sector: "Hospitality & F&B", names: "Carnivale, Moire, Spicy Vibes, The Flavor Express, Chaat Di Hatti", result: "Offer-led campaigns, event promotion, bookings and local customer acquisition." },
  { sector: "Real Estate", names: "Link House Buildwell, Flora Heritage, Vrinda Heritage, Trinity Venture, KPS Town Central, Dholera Group", result: "Project-focused lead generation and buyer enquiry campaigns." },
  { sector: "Service & Platforms", names: "Shree Ganesh Enterprises, SGE Machinery, Quickly India", result: "Digital presence, enquiry generation and growth-system support." },
];

const faq = [
  ["Can you manage my complete Meta Ads campaign?", "Yes. Support can cover strategy, campaign structure, audience planning, creative direction, lead forms, tracking, optimization and performance reporting."],
  ["Do you guarantee a fixed number of leads or sales?", "No ethical performance marketer can guarantee a fixed result before reviewing the offer, market, budget and sales process. The focus is on systematic testing, measurement and continuous improvement."],
  ["What ad budget should I start with?", "The right starting budget depends on your industry, location, offer and lead value. After a short discussion, you will receive a practical test-budget recommendation."],
  ["Can you audit campaigns already running?", "Yes. Existing campaign structure, creatives, audience, tracking, cost per result and lead quality can be reviewed before recommending changes."],
  ["Which businesses do you work with?", "Experience includes education, hospitality, real estate, service businesses, local brands, construction and digital platforms."],
];

export default function MetaAdsLandingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Meta Ads & Performance Marketing Support",
    provider: { "@type": "Person", name: "Lambodar Patra", url: "https://www.mydigitalskills.in/connect" },
    areaServed: "India",
    serviceType: "Meta Ads Management and Performance Marketing",
  };

  return (
    <main className="meta-lp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="meta-nav">
        <a href="#top" aria-label="MyDigitalSkills home"><img src="/images/mydigitalskills-logo.png" alt="MyDigitalSkills" /></a>
        <a className="meta-nav-cta" href="https://wa.me/918128729003?text=Hi%20Lambodar%2C%20I%20need%20help%20with%20Meta%20Ads." target="_blank" rel="noreferrer">WhatsApp: +91 81287 29003</a>
      </header>

      <section className="meta-hero" id="top">
        <div className="meta-container meta-hero-grid">
          <div className="meta-hero-copy">
            <div className="meta-kicker"><span>●</span> META ADS & PERFORMANCE MARKETING</div>
            <h1>Stop burning ad budget. Build a system for <em>qualified leads.</em></h1>
            <p>I help businesses plan, launch and optimize Facebook & Instagram campaigns—connecting the right creative, audience, landing page and follow-up system.</p>
            <div className="meta-proof-row">
              <div><strong>7+</strong><span>Years in digital growth</span></div>
              <div><strong>≈₹1 Cr</strong><span>Ad budget handled</span></div>
              <div><strong>5+</strong><span>Industries served</span></div>
            </div>
            <div className="meta-actions">
              <a className="meta-primary" href="#consultation">Get a Free Campaign Discussion →</a>
              <a className="meta-secondary" href="#portfolio">View Experience</a>
            </div>
            <div className="meta-trust"><span>Campaign strategy</span><span>Lead quality</span><span>Tracking & optimization</span></div>
          </div>
          <div className="meta-hero-visual">
            <div className="meta-photo-bg"></div>
            <img src="/images/lambodar-digital.png" alt="Lambodar Patra, Meta Ads and performance marketing professional" />
            <div className="meta-float meta-float-one"><small>FOCUS</small><strong>Better Leads</strong><span>Not vanity metrics</span></div>
            <div className="meta-float meta-float-two"><small>APPROACH</small><strong>Test → Learn → Scale</strong></div>
          </div>
        </div>
      </section>

      <section className="meta-logo-strip"><div className="meta-container"><span>EXPERIENCE ACROSS</span><strong>Education</strong><strong>Hospitality</strong><strong>Real Estate</strong><strong>Service Businesses</strong><strong>Digital Platforms</strong></div></section>

      <section className="meta-section meta-problem">
        <div className="meta-container meta-two-col">
          <div><div className="meta-label">WHY CAMPAIGNS STRUGGLE</div><h2>Clicks are easy. A reliable lead system needs <em>more.</em></h2><p>Meta Ads works best when every stage supports the next—from the first scroll-stopping creative to the final sales follow-up.</p></div>
          <div className="meta-problem-list">
            <article><b>01</b><div><h3>Unclear offer</h3><p>The audience sees an ad, but not a strong reason to act now.</p></div></article>
            <article><b>02</b><div><h3>Wrong campaign structure</h3><p>Budget gets divided without enough data for smart optimization.</p></div></article>
            <article><b>03</b><div><h3>Weak lead qualification</h3><p>Cheap enquiries arrive, but few match the actual customer profile.</p></div></article>
            <article><b>04</b><div><h3>Slow follow-up</h3><p>Good leads turn cold before the sales conversation starts.</p></div></article>
          </div>
        </div>
      </section>

      <section className="meta-section meta-dark">
        <div className="meta-container meta-results-grid">
          <div><div className="meta-label gold">THE PERFORMANCE SYSTEM</div><h2>Decisions guided by data. Growth supported by execution.</h2><p>Campaign numbers are reviewed alongside lead quality and sales feedback, so optimization is connected to the business outcome.</p><ul><li>Audience and competitor research</li><li>Campaign and funnel planning</li><li>Creative direction and testing</li><li>Lead tracking and qualification</li><li>Weekly optimization and scale planning</li></ul></div>
          <PerformanceVisual />
        </div>
      </section>

      <section className="meta-section" id="portfolio">
        <div className="meta-container">
          <div className="meta-heading"><div><div className="meta-label">SELECTED EXPERIENCE</div><h2>Multi-industry campaign experience.</h2></div><p>Different sectors need different offers, audiences and conversion journeys. The strategy is built around the business—not copied from a template.</p></div>
          <div className="meta-portfolio-grid">{portfolio.map((item, index) => <article key={item.sector} className={index === 1 ? "featured" : ""}><span>0{index + 1} / {item.sector}</span><h3>{item.names}</h3><p>{item.result}</p></article>)}</div>
          <p className="meta-disclaimer">Portfolio names represent sectors and projects worked on. Campaign performance varies by offer, market, budget, creative and sales follow-up.</p>
        </div>
      </section>

      <section className="meta-section meta-process-section">
        <div className="meta-container"><div className="meta-heading"><div><div className="meta-label">HOW WE START</div><h2>A clear path from audit to scale.</h2></div></div><div className="meta-process"><article><b>1</b><h3>Understand</h3><p>Business, offer, audience, past campaigns and sales goal.</p></article><article><b>2</b><h3>Plan</h3><p>Funnel, creative angles, budget split and tracking setup.</p></article><article><b>3</b><h3>Launch</h3><p>Campaign activation with structured tests and lead flow.</p></article><article><b>4</b><h3>Optimize</h3><p>Improve using performance data and real lead feedback.</p></article></div></div>
      </section>

      <section className="meta-section meta-consultation" id="consultation"><div className="meta-container meta-form-layout"><div className="meta-form-copy"><div className="meta-label gold">READY TO IMPROVE YOUR CAMPAIGNS?</div><h2>Let’s find the next growth opportunity.</h2><p>Whether you are launching your first campaign or fixing an existing one, start with a focused discussion about your offer, audience and target.</p><div className="meta-contact-card"><img src="/images/lambodar-pointing-hd.png" alt="Lambodar Patra" /><div><strong>Lambodar Patra</strong><span>Digital Growth & Performance Marketing Partner</span><a href="tel:+918128729003">+91 81287 29003</a></div></div></div><MetaLeadForm /></div></section>

      <section className="meta-section meta-faq"><div className="meta-container"><div className="meta-heading"><div><div className="meta-label">COMMON QUESTIONS</div><h2>Before we work together.</h2></div></div><div className="meta-faq-list">{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>

      <footer className="meta-footer"><div className="meta-container"><img src="/images/mydigitalskills-logo.png" alt="MyDigitalSkills" /><p>Meta Ads · Performance Marketing · Lead Generation</p><div><a href="mailto:connect@mydigitalskills.in">connect@mydigitalskills.in</a><a href="https://www.instagram.com/mydigitalskills.in/" target="_blank" rel="noreferrer">Instagram</a></div><small>© {new Date().getFullYear()} MyDigitalSkills · Noida, India</small></div></footer>
      <a className="meta-mobile-sticky" href="https://wa.me/918128729003?text=Hi%20Lambodar%2C%20I%20need%20help%20with%20Meta%20Ads." target="_blank" rel="noreferrer">Discuss Meta Ads on WhatsApp →</a>
    </main>
  );
}
