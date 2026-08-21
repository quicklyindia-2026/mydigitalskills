import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteChrome";
import { PagePortrait, PerformanceVisual } from "@/components/AnimatedVisuals";

export const metadata: Metadata = { title: "About Lambodar Patra", description: "Meet Lambodar Patra, digital marketing, Meta Ads and business growth professional." };

export default function AboutPage() {
  return (
    <SiteShell><main>
      <section className="page-hero visual-page-hero"><div className="container page-hero-split"><div><p className="eyebrow">About Lambodar Patra</p><h1>A digital marketer who thinks like a <span>growth partner.</span></h1><p>From campaign strategy to websites and business systems, my work connects marketing execution with the real commercial goal behind it.</p></div><PagePortrait pose="pointing"/></div></section>
      <section className="section"><div className="container about-grid">
        <div className="about-photo-clean about-photo-tall"><img src="/images/lambodar-profile.jpg?v=20260821c" alt="Lambodar Patra, founder of MyDigitalSkills"/><div className="about-photo-accent">Digital Growth Partner</div></div>
        <div className="about-copy">
          <p className="eyebrow">My journey</p><h2>7+ years of learning, building and <span className="red-text">growing brands.</span></h2>
          <p className="lead">I have worked across franchise expansion, performance marketing, education, hospitality, F&B, real estate, construction chemicals, service businesses and digital platforms. That range helps me understand both the marketing problem and the operational reality behind it.</p>
          <p className="lead">MyDigitalSkills brings that experience into one focused platform: helping businesses grow and helping learners build practical digital skills.</p>
          <div className="check-grid"><div className="check-item">Performance marketing</div><div className="check-item">Business strategy</div><div className="check-item">Digital products</div><div className="check-item">Content systems</div><div className="check-item">Local growth</div><div className="check-item">Lead funnels</div></div>
          <a className="button button-primary" href="/contact">Work With Me →</a>
        </div>
      </div></section>
      <section className="section section-dark"><div className="container results-split"><div><p className="eyebrow">My performance mindset</p><h2>Marketing becomes powerful when every action is <span className="red-text">measurable.</span></h2><p className="lead-copy light">I connect campaigns, landing pages, enquiries and follow-up so decisions are based on lead quality—not vanity numbers.</p></div><PerformanceVisual compact/></div></section>
      <section className="section section-soft"><div className="container">
        <div className="section-heading"><div><p className="eyebrow">How I work</p><h2>Clear thinking. Practical execution. <span className="red-text">Measurable progress.</span></h2></div></div>
        <div className="card-grid">
          <article className="service-card"><div className="service-no">01</div><h3>Understand</h3><p>Business, customer, current gaps and the goal that matters most.</p></article>
          <article className="service-card"><div className="service-no">02</div><h3>Build</h3><p>The right website, campaign, content or automation system for that goal.</p></article>
          <article className="service-card"><div className="service-no">03</div><h3>Improve</h3><p>Review performance, fix weak points and scale what works.</p></article>
        </div>
      </div></section>
    </main></SiteShell>
  );
}
