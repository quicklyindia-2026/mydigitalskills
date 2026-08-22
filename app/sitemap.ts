import type { MetadataRoute } from "next";
import { featuredBlogPosts } from "@/lib/featured-blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.mydigitalskills.in";
  const updated = new Date("2026-08-22");
  const pages = [
    "", "/about", "/services", "/portfolio", "/portfolio/quickly-india",
    "/courses", "/blog", "/blog/digital-growth-system-for-small-business",
    "/blog/meta-ads-lead-generation-improve-lead-quality", "/contact",
  ];
  const staticPages: MetadataRoute.Sitemap = pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: updated,
    changeFrequency: path.startsWith("/blog") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path === "/blog" || path === "/services" ? 0.9 : 0.8,
  }));
  const featuredBlogs: MetadataRoute.Sitemap = featuredBlogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...staticPages, ...featuredBlogs];
}
