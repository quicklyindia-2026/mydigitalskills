import Link from "next/link";
import { SiteShell } from "@/components/SiteChrome";
import { AnimatedHeroPortrait, PerformanceVisual } from "@/components/AnimatedVisuals";

const services = [
  ["01", "Website & App Solutions", "High-converting websites, business portals, booking systems and custom digital products."],
  ["02", "Meta Ads & Lead Generation", "Full-funnel Facebook and Instagram advertising focused on quality leads and sales."],
  ["03", "Social Media Marketing", "Strategy, content, creatives, reels and performance reporting for consistent brand growth."],
  ["04", "Google Business Profile", "GMB setup, optimization, local visibility, reviews and multi-location growth support."],
  ["05", "Business Automation", "CRM, WhatsApp workflows, lead systems, dashboards and practical sales automation."],
  ["06", "Brand & Growth Consulting", "Digital audits, launch plans, campaign strategy and business growth roadmaps."],
];

const cases = [
  ["Education", "Brain Bunny Juniors International Preschool", "Digital strategy, brand growth and franchise-focused marketing."],
  ["Hospitality & F&B", "Hospitality Growth Portfolio", "Carnivale Food Delights, Moire, Spicy Vibes, The Flavor Express, Chaat Di Hatti and The Kimaya Foods & Caterers."],
  ["Business Directory", "Quickly India Directory System", "A structured business listing and discovery platform covering businesses, services, products, jobs, events and local opportunities."],
];

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">Lambodar Patra · Digital Growth Partner</p>
              <h1>Turning business ideas into <span>websites, leads & growth.</span></h1>
              <p className="hero-copy">I help ambitious businesses build their digital presence, generate better leads and create scalable growth systems through websites, Meta Ads, GMB, social media and automation.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="/contact">Get Free Consultation →</a>
                <a className="button button-light" href="/portfolio">Explore My Work</a>
              </div>
              <div className="trust-line"><span>7+ years experience</span><span>Multi-industry expertise</span><span>Strategy to execution</span></div>
            </div>
            <AnimatedHeroPortrait />
          </div>
        </section>

        <section className="stats">
          <div className="container stats-grid">
            <div className="stat"><strong>7+</strong><span>Years of experience</span></div>
            <div className="stat"><strong>6</strong><span>Core growth services</span></div>
            <div className="stat"><strong>5+</strong><span>Industries served</span></div>
            <div className="stat"><strong>1</strong><span>Growth partner</span></div>
          </div>
        </section>

        <section className="section visual-results-section"><div className="container results-split"><div><p className="eyebrow">Performance marketing</p><h2>Creative decisions backed by <span className="red-text">real growth signals.</span></h2><p className="lead-copy">From ad reach and lead quality to landing-page action and sales follow-up, every part of the campaign is tracked as one connected system.</p><div className="check-grid"><div className="check-item">Campaign optimization</div><div className="check-item">Lead-quality tracking</div><div className="check-item">Funnel reporting</div><div className="check-item">Scale planning</div></div></div><PerformanceVisual/></div></section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">What I do</p><h2>Digital services that move your business <span className="red-text">forward.</span></h2></div>
              <p>One partner for strategy, creative, technology, advertising and lead systems—built around your actual business goal.</p>
            </div>
            <div className="card-grid">
              {services.map(([no, title, copy]) => (
                <article className="service-card" key={title}>
                  <div className="service-no">{no}</div><h3>{title}</h3><p>{copy}</p>
                  <a className="card-link" href="/services">View service →</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container about-grid">
            <div className="about-photo-clean"><img src="/images/lambodar-profile.jpg?v=20260821c" alt="Lambodar Patra"/><div className="about-photo-accent">Strategy → Execution → Growth</div></div>
            <div className="about-copy">
              <p className="eyebrow">About the founder</p>
              <h2>Marketing thinking with a <span className="red-text">business mindset.</span></h2>
              <p className="lead">I’m Lambodar Patra, a digital marketing and business growth professional with 7+ years of experience across education, hospitality, real estate, construction, service businesses and digital platforms.</p>
              <div className="check-grid">
                <div className="check-item">Meta Ads specialist</div><div className="check-item">Website solutions</div>
                <div className="check-item">GMB growth</div><div className="check-item">Lead automation</div>
                <div className="check-item">Brand strategy</div><div className="check-item">Multi-industry experience</div>
              </div>
              <a className="button button-dark" href="/about">Know My Journey →</a>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">The growth system</p><h2>See how attention becomes a <span className="red-text">business opportunity.</span></h2></div>
              <p>A connected customer journey makes marketing easier to understand, measure and improve.</p>
            </div>
            <div className="visual-panel">
              <div className="growth-map">
                <div className="growth-step"><strong>01 DISCOVER</strong><h3>Search & Content</h3></div><div className="growth-arrow">→</div>
                <div className="growth-step"><strong>02 TRUST</strong><h3>Website & Proof</h3></div><div className="growth-arrow">→</div>
                <div className="growth-step"><strong>03 ACT</strong><h3>Lead & Booking</h3></div><div className="growth-arrow">→</div>
                <div className="growth-step"><strong>04 FOLLOW UP</strong><h3>CRM & WhatsApp</h3></div><div className="growth-arrow">→</div>
                <div className="growth-step"><strong>05 GROW</strong><h3>Sales & Retention</h3></div>
              </div>
              <div className="visual-metrics"><div className="visual-metric"><strong>1 System</strong><span>Strategy to customer action</span></div><div className="visual-metric"><strong>5 Stages</strong><span>Clear ownership at every step</span></div><div className="visual-metric"><strong>Better Data</strong><span>Decisions based on lead quality</span></div></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">Selected portfolio</p><h2>Experience across industries. <span className="red-text">Solutions built for each.</span></h2></div>
              <a className="button button-light" href="/portfolio">View Full Portfolio</a>
            </div>
            <div className="card-grid">
              {cases.map(([sector, title, copy], index) => (
                <article className={`case-card ${index === 1 ? "featured" : ""}`} key={title}>
                  <span className="sector">{sector}</span><h3>{title}</h3><p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">Learn with MyDigitalSkills</p><h2>Practical skills for smarter <span className="red-text">digital growth.</span></h2></div>
              <p>Start with free eBooks today. Structured video lessons will be added next through the learning dashboard.</p>
            </div>
            <div className="courses">
              <article className="course-card">
                <div className="course-top"><span className="course-badge">FREE EBOOK</span><span>By Lambodar Patra</span></div>
                <h3>Digital Marketing Growth Playbook</h3>
                <p>A practical foundation for building visibility, leads and business growth online.</p>
                <Link className="card-link" href="/courses">Explore course →</Link>
              </article>
              <article className="course-card">
                <div className="course-top"><span className="course-badge">FREE EBOOK</span><span>By Lambodar Patra</span></div>
                <h3>Meta Ads Lead Generation Blueprint</h3>
                <p>Learn campaign structure, targeting, creatives, lead quality and optimization.</p>
                <Link className="card-link" href="/courses">Explore course →</Link>
              </article>
            </div>
          </div>
        </section>

        <section className="section learning-journey-section">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">Simple learning journey</p><h2>Learn a skill. Practise it. <span className="red-text">Show what you know.</span></h2></div>
              <p>The academy is designed for clear, section-wise learning—not a confusing library of disconnected videos.</p>
            </div>
            <div className="journey-grid">
              <article><span>01</span><h3>Choose your skill</h3><p>Start with a free resource or enrol in a structured course.</p></article>
              <article><span>02</span><h3>Learn section-wise</h3><p>Follow lessons, videos, notes and downloadable eBooks in order.</p></article>
              <article><span>03</span><h3>Practise & answer</h3><p>Complete practical tasks and a short end-of-course assessment.</p></article>
              <article><span>04</span><h3>Earn your certificate</h3><p>Qualify for a free or premium MyDigitalSkills certificate.</p></article>
            </div>
            <div className="academy-benefits">
              <div><strong>Hindi + English</strong><span>Easy-to-follow explanations</span></div>
              <div><strong>Practical LMS</strong><span>Progress, lessons and quizzes</span></div>
              <div><strong>Real examples</strong><span>Built from business experience</span></div>
              <div><strong>Free + paid</strong><span>Learn at your own level</span></div>
              <Link className="button button-dark" href="/courses">Explore Courses →</Link>
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">Proof before promises</p><h2>Built on real project experience, <span className="red-text">not borrowed claims.</span></h2></div>
              <p>Client feedback will be published only with approval. Until then, explore the sectors and projects behind the work.</p>
            </div>
            <div className="proof-grid">
              <article><span>EDUCATION</span><h3>Brain Bunny Juniors</h3><p>Brand growth and franchise-focused digital strategy for an international preschool concept.</p></article>
              <article><span>HOSPITALITY</span><h3>Food & restaurant brands</h3><p>Campaign and digital growth work across Carnivale, Moire, Spicy Vibes, The Flavor Express and more.</p></article>
              <article><span>REAL ESTATE + PLATFORMS</span><h3>Campaigns and systems</h3><p>Lead-generation experience for property projects plus the Quickly India business directory system.</p></article>
            </div>
            <div className="feedback-strip"><div><strong>Worked with Lambodar?</strong><span>Your genuine feedback can help another business make a confident decision.</span></div><a className="button button-primary" href="mailto:connect@mydigitalskills.in?subject=MyDigitalSkills%20Client%20Feedback">Share Feedback</a></div>
          </div>
        </section>

        <section className="section">
          <div className="container faq-home">
            <div className="section-heading"><div><p className="eyebrow">Questions, answered</p><h2>Before you start <span className="red-text">learning.</span></h2></div><p>Clear information for students, professionals and business owners.</p></div>
            <div className="faq-list">
              <details className="faq-item"><summary>Are the courses suitable for beginners?</summary><p>Yes. Courses are organised section by section, so you can start with the fundamentals and move toward practical application.</p></details>
              <details className="faq-item"><summary>Do you offer both free and paid learning?</summary><p>Yes. MyDigitalSkills includes free eBooks and selected free courses, along with paid courses and premium learning resources.</p></details>
              <details className="faq-item"><summary>Will I receive a certificate?</summary><p>Eligible learners receive a MyDigitalSkills certificate after completing the required lessons and final assessment. Free and premium certificate formats are available.</p></details>
              <details className="faq-item"><summary>How will I access my lessons?</summary><p>After enrolment, your course appears inside the learning dashboard with lessons, resources, progress and assessments.</p></details>
              <details className="faq-item"><summary>Can I ask for learning or business guidance?</summary><p>Yes. Use the contact page or WhatsApp to discuss the right course, website solution or growth service for your goal.</p></details>
            </div>
            <div className="learning-updates"><div><p className="eyebrow">Learning updates</p><h3>Get new course and eBook updates on WhatsApp.</h3></div><a className="button button-primary" href="https://wa.me/918128729003?text=Hi%20Lambodar%2C%20please%20send%20me%20MyDigitalSkills%20learning%20updates." target="_blank" rel="noreferrer">Join Updates →</a></div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">Latest insights</p><h2>Practical guides for <span className="red-text">business owners.</span></h2></div><Link className="button button-light" href="/blog">View All Blogs</Link></div>
            <div className="blog-grid">
              <article className="blog-card"><Link className="blog-card-image" href="/blog/digital-growth-system-for-small-business"><img src="/images/blog-digital-growth-system.webp" alt="Connected digital growth system for a small business" width="1400" height="788" loading="lazy" /></Link><div className="blog-card-body"><div className="blog-meta"><span>Business Growth</span><span>10 min read</span></div><h2><Link href="/blog/digital-growth-system-for-small-business">How to Build a Digital Growth System for a Small Business</Link></h2><p>Connect your website, GMB, content, advertising and lead follow-up.</p><Link className="card-link" href="/blog/digital-growth-system-for-small-business">Read article →</Link></div></article>
              <article className="blog-card"><Link className="blog-card-image" href="/blog/meta-ads-lead-generation-improve-lead-quality"><img src="/images/blog-meta-ads-lead-quality.webp" alt="Meta advertising lead-quality filtering and analytics" width="1400" height="788" loading="lazy" /></Link><div className="blog-card-body"><div className="blog-meta"><span>Meta Ads</span><span>11 min read</span></div><h2><Link href="/blog/meta-ads-lead-generation-improve-lead-quality">Meta Ads Lead Generation: How to Improve Lead Quality</Link></h2><p>Improve targeting, forms, qualification, follow-up and campaign decisions.</p><Link className="card-link" href="/blog/meta-ads-lead-generation-improve-lead-quality">Read article →</Link></div></article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container cta-band">
            <p className="eyebrow">Free website consultation</p>
            <h2>Have a business idea or a growth challenge?</h2>
            <p>Let’s understand your requirement and map the right website, marketing or lead-generation solution. The initial consultation is free.</p>
            <div className="hero-actions"><a className="button button-gold" href="/contact">Book Free Consultation →</a><a className="button button-light" href="tel:+918128729003">Call +91 81287 29003</a></div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
