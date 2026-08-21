
import Link from "next/link";

const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["Courses", "/courses"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];

export function Header() {
  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>Digital Growth • Meta Ads • Websites • Automation</span>
          <span><a href="tel:+918128729003">+91 81287 29003</a> · Noida, India</span>
        </div>
      </div>
      <header className="header">
        <nav className="container nav" aria-label="Main navigation">
          <Link className="brand" href="/" aria-label="MyDigitalSkills home">
            <img src="/images/mydigitalskills-logo-v3.jpg?v=20260821e" alt="MyDigitalSkills - Grow Your Business with us" />
          </Link>
          <div className="nav-links">
            {navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </div>
          <a className="button button-primary desktop-cta" href="/contact">Free Consultation</a>
          <details className="mobile-menu">
            <summary aria-label="Open navigation">☰</summary>
            <div className="menu-panel">
              {navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
              <a className="button button-primary" href="/contact">Free Consultation</a>
            </div>
          </details>
        </nav>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/images/mydigitalskills-logo-v3.jpg?v=20260821e" alt="MyDigitalSkills" />
          <p>Digital growth, performance marketing, websites and business solutions led by Lambodar Patra.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <div className="footer-links">
            {navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </div>
        </div>
        <div>
          <h3>Connect</h3>
          <div className="footer-links">
            <a href="tel:+918128729003">+91 81287 29003</a>
            <a href="mailto:connect@mydigitalskills.in">connect@mydigitalskills.in</a>
            <a href="https://www.instagram.com/mydigitalskills.in/" target="_blank" rel="noreferrer">Instagram</a>
            <span>Noida, India</span>
            <Link href="/faq">FAQs</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/refund-policy">Refund Policy</Link>
          </div>
        </div>
        <div>
          <h3>Highlighted Courses</h3>
          <div className="footer-links">
            <Link href="/courses/digital-marketing-mastery">Digital Marketing Mastery</Link>
            <Link href="/courses/meta-ads-lead-generation">Meta Ads Masterclass</Link>
            <Link href="/courses/excel-for-business">Excel for Business</Link>
            <Link href="/courses/powerpoint-presentation-mastery">PowerPoint Mastery</Link>
            <Link href="/courses/ai-tools-for-work">AI Tools for Work</Link>
          </div>
        </div>
      </div>
      <div className="container copyright"><span>© 2026 MyDigitalSkills. Built for measurable digital growth.</span><span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/refund-policy">Refunds</Link></span></div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <Header />
      {children}
      <Footer />
      <a className="whatsapp-float" href="https://wa.me/918128729003?text=Hi%20Lambodar%2C%20I%20want%20a%20free%20consultation." aria-label="Chat on WhatsApp" target="_blank" rel="noreferrer">WA</a>
    </div>
  );
}
