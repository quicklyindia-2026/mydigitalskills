import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteChrome";
import { PagePortrait, PerformanceVisual } from "@/components/AnimatedVisuals";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { portfolioItems } from "@/db/schema";

export const metadata: Metadata = { title: "Portfolio & Case Studies", description: "Selected education, hospitality, real estate, industrial and digital projects by Lambodar Patra." };

const groups = [
  {
    sector: "Education & Franchise",
    title: "Brain Bunny Juniors International Preschool",
    copy: "Brand growth, digital marketing and franchise-focused communication for an education business.",
    work: ["Digital marketing strategy", "Franchise lead generation", "Social media and brand communication"],
  },
  {
    sector: "Hospitality & F&B",
    title: "Hospitality Growth Portfolio",
    copy: "Campaigns, content, events and lead-generation support across restaurant, lounge and catering brands.",
    work: ["Carnivale Food Delights", "Moire Air Lounge & Bar", "Spicy Vibes", "The Flavor Express", "Chaat Di Hatti", "The Kimaya Foods & Caterers"],
  },
  {
    sector: "Real Estate",
    title: "Real Estate Performance Campaigns",
    copy: "Meta advertising and lead-generation work for property and investment campaigns.",
    work: ["Link House Buildwell", "Flora Heritage", "Vrinda Heritage", "Trinity Venture", "KPS Town Central", "Dholera Group"],
  },
  {
    sector: "Industrial & Services",
    title: "Service Business Growth",
    copy: "Digital visibility, websites and marketing support for industrial and service-led businesses.",
    work: ["Shree Ganesh Enterprises", "SGE Machinery", "Service marketing", "Business enquiry systems"],
  },
  {
    sector: "Construction Chemicals",
    title: "Fibrex Construction Chemicals",
    copy: "A multi-channel marketing engagement across website, SEO, product content, sales collateral and lead generation.",
    work: ["Website and SEO", "Company profile and product communication", "Social media and lead campaigns"],
  },
  {
    sector: "Business Directory Platform",
    title: "Quickly India Business Directory System",
    copy: "A multi-category business discovery and listing platform designed to connect customers with businesses, services and local opportunities.",
    work: ["Business and service listings", "Products, jobs and events", "Location and category discovery", "Admin listing management"],
    href: "/portfolio/quickly-india",
  },
];

export const dynamic="force-dynamic";
export default async function PortfolioPage() {
  let managed:typeof portfolioItems.$inferSelect[]=[];try{managed=await getDb().select().from(portfolioItems).where(eq(portfolioItems.status,"published")).orderBy(asc(portfolioItems.sortOrder))}catch{}
  const managedGroups=managed.map(x=>({sector:x.sector,title:x.title,copy:x.description,work:JSON.parse(x.workJson||"[]") as string[],href:x.projectUrl||undefined}));const displayGroups=[...managedGroups,...groups];
  return <SiteShell><main>
    <section className="page-hero visual-page-hero"><div className="container page-hero-split"><div><p className="eyebrow">Portfolio & case studies</p><h1>Different industries. One focus: <span>meaningful growth.</span></h1><p>This portfolio shows the industries, brands and responsibilities I have worked across. Detailed performance figures will only be shown where verified campaign data is available.</p></div><PagePortrait pose="thumbs"/></div></section>
    <section className="section visual-results-section"><div className="container results-split"><div><p className="eyebrow">Campaign intelligence</p><h2>Work that connects creative execution with <span className="red-text">performance.</span></h2><p className="lead-copy">Industry context changes, but the system stays clear: attract attention, qualify demand, improve conversion and report the outcome.</p></div><PerformanceVisual compact/></div></section>
    <section className="section"><div className="container">
      <div className="case-tabs"><span className="pill">Education</span><span className="pill">Hospitality & F&B</span><span className="pill">Real Estate</span><span className="pill">Industrial & Services</span><span className="pill">Construction</span><span className="pill">Digital Platforms</span></div>
      <div className="card-grid">{displayGroups.map((group, i) => <article className={`case-card ${i === 1 ? "featured" : ""}`} key={`${group.title}-${i}`}><span className="sector">{group.sector}</span><h3>{group.title}</h3><p>{group.copy}</p><ul>{group.work.map(item => <li key={item}>{item}</li>)}</ul>{group.href ? group.href.startsWith("/")?<Link className="card-link" href={group.href}>View case study →</Link>:<a className="card-link" href={group.href} target="_blank" rel="noreferrer">View project →</a> : null}</article>)}</div>
    </div></section>
    <section className="section section-soft"><div className="container"><div className="section-heading"><div><p className="eyebrow">Case study method</p><h2>Problem → solution → execution → <span className="red-text">verified outcome.</span></h2></div><p>Project screenshots, campaign objectives, responsibilities and confirmed results can be added as individual case studies over time.</p></div></div></section>
  </main></SiteShell>;
}
