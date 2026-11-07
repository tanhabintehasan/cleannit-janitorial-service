import { getContent } from "@/lib/content";

export default async function robots() {
  const { settings } = await getContent();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${settings.domain}/sitemap.xml`,
  };
}
