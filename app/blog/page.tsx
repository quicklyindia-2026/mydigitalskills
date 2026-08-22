import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteChrome";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { featuredBlogPosts } from "@/lib/featured-blog-posts";

export const metadata: Metadata = {
  title: "Digital Marketing & Business Growth Blog",
  description: "Practical articles by Lambodar Patra on digital growth, websites, Meta Ads, lead generation, GMB, AI and business systems.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "MyDigitalSkills Blog",
    description: "Practical digital growth and performance marketing guidance for businesses.",
    url: "/blog",
  },
};

const posts = [
  {
    href: "/blog/digital-growth-system-for-small-business",
    image: "/images/blog-digital-growth-system.webp",
    alt: "Connected digital growth system showing a business website, local search, social media, advertising and lead management",
    category: "Business Growth",
    date: "13 August 2026",
    read: "10 min read",
    title: "How to Build a Digital Growth System for a Small Business",
    description: "Connect your website, Google Business Profile, content, Meta Ads and lead follow-up into one practical growth system.",
  },
  {
    href: "/blog/meta-ads-lead-generation-improve-lead-quality",
    image: "/images/blog-meta-ads-lead-quality.webp",
    alt: "Advertising leads moving through targeting filters into qualified opportunities and a sales dashboard",
    category: "Meta Ads",
    date: "13 August 2026",
    read: "11 min read",
    title: "Meta Ads Lead Generation: How to Improve Lead Quality",
    description: "A practical framework for better targeting, offers, forms, creative testing, qualification and sales follow-up.",
  },
];

export const dynamic="force-dynamic";
export default async function BlogPage() {
  let managed:typeof blogPosts.$inferSelect[]=[];try{managed=await getDb().select().from(blogPosts).where(eq(blogPosts.status,"published")).orderBy(desc(blogPosts.createdAt))}catch{}
  const managedPosts=managed.map(post=>({href:`/blog/${post.slug}`,image:post.coverImage||"/images/blog-digital-growth-system.webp",alt:post.title,category:post.category,date:new Date(post.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}),read:`${Math.max(3,Math.ceil(post.content.split(/\s+/).length/180))} min read`,title:post.title,description:post.excerpt}));
  const featuredPosts=featuredBlogPosts.map(post=>({href:`/blog/${post.slug}`,image:post.image,alt:post.alt,category:post.category,date:post.date,read:post.read,title:post.title,description:post.excerpt}));
  const displayPosts=[...managedPosts,...featuredPosts,...posts];
  return (
    <SiteShell>
      <main>
        <section className="page-hero"><div className="container"><p className="eyebrow">Insights by Lambodar Patra</p><h1>Practical ideas for <span>digital business growth.</span></h1><p>Clear, experience-led articles about websites, Meta Ads, local visibility, AI, lead systems and the decisions behind sustainable growth.</p></div></section>
        <section className="section"><div className="container blog-grid">
          {displayPosts.map((post) => (
            <article className="blog-card" key={post.href}>
              <a className="blog-card-image" href={post.href}><img src={post.image} alt={post.alt} width="1400" height="788" loading="eager" /></a>
              <div className="blog-card-body">
                <div className="blog-meta"><span>{post.category}</span><span>{post.date}</span><span>{post.read}</span></div>
                <h2><a href={post.href}>{post.title}</a></h2>
                <p>{post.description}</p>
                <a className="card-link" href={post.href}>Read article →</a>
              </div>
            </article>
          ))}
        </div></section>
        <section className="section section-soft"><div className="container cta-band"><p className="eyebrow">Need a practical growth plan?</p><h2>Turn these ideas into action for your business.</h2><p>Book a free initial consultation to identify the right website, campaign or lead-system priority.</p><div className="hero-actions"><a className="button button-gold" href="/contact">Book Free Consultation →</a></div></div></section>
      </main>
    </SiteShell>
  );
}
