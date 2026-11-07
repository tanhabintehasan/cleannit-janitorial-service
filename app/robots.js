import { getContent } from "@/lib/content";

export default function robots() {
  const { settings } = getContent();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${settings.domain}/sitemap.xml`,
  };
}
