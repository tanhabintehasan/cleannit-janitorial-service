import { getContent } from "@/lib/content";

// Auto-generated from content: services/locations/blog edits appear on next request.
export default async function sitemap() {
  const content = await getContent();
  const base = content.settings.domain;
  const now = new Date().toISOString();
  const staticPages = ["", "/services", "/locations", "/about", "/gallery", "/blog", "/faq", "/contact"].map((p) => ({
    url: `${base}${p}`,
    lastModified: content.pages.home.updatedAt || now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));
  const services = content.services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: s.updatedAt || now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));
  const locations = content.locations.map((l) => ({
    url: `${base}/locations/${l.slug}`,
    lastModified: l.updatedAt || now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));
  const posts = content.posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt || p.date || now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticPages, ...services, ...locations, ...posts];
}
