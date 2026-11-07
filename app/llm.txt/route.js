import { getContent } from "@/lib/content";

// llm.txt — Markdown-formatted plain text for LLM crawlers, served as text/plain.
export const dynamic = "force-dynamic";

export function GET() {
  const content = getContent();
  const { settings } = content;
  const today = new Date().toISOString().slice(0, 10);
  const addr = settings.address || {};
  const addrLine = [addr.street, [addr.city, addr.region].filter(Boolean).join(", "), addr.postalCode, addr.country].filter(Boolean).join(", ");
  const hours = Object.entries(settings.hours || {})
    .map(([d, h]) => `- ${d[0].toUpperCase() + d.slice(1)}: ${h.closed ? "Closed" : `${h.open}–${h.close}`}`)
    .join("\n");

  const md = `# ${settings.businessName}

${settings.tagline} — licensed professional cleaning company serving Toronto and the Greater Toronto Area.

## Business Summary
- ${settings.businessName} is a founder-led cleaning firm (founder & CEO: ${settings.founder}).
- Founded in ${settings.foundedYear}; rated ${settings.aggregateRating.ratingValue}/5 across ${settings.aggregateRating.reviewCount} client reviews.
- Business Licence #${settings.license}; fully insured, uniformed and background-checked crews.
- Serves commercial, industrial, residential and maintenance clients across the GTA.
- Core values: Quality. Care. Consistency.

## Contact & NAP
- Phone: ${settings.phone}
- WhatsApp: ${settings.whatsapp}
- Email: ${settings.email}
- Address: ${addrLine || "Toronto, ON, Canada"}
- Website: ${settings.domain}
- Google Business Profile: ${settings.gbpUrl}

## Hours
${hours}

## Service Area
${settings.serviceArea.map((c) => `- ${c}`).join("\n")}

## Services
${content.services.map((s) => `- [${s.name} in Toronto](${settings.domain}/services/${s.slug}) — ${s.shortDesc}`).join("\n")}

## Locations
${content.locations.map((l) => `- [Cleaning Services in ${l.name}](${settings.domain}/locations/${l.slug})`).join("\n")}

## Key Pages
- [Home](${settings.domain}/)
- [About ${settings.businessName}](${settings.domain}/about)
- [Work Gallery](${settings.domain}/gallery)
- [Cleaning Guides & Cost Resources](${settings.domain}/blog)
- [Frequently Asked Questions](${settings.domain}/faq)
- [Contact & Free Quote](${settings.domain}/contact)

## Differentiators
- Founder-led quality control with supervisor audits on every account.
- One licensed contractor for commercial, industrial, residential and maintenance cleaning.
- Condo-board-friendly balcony cleaning and humane bird netting installation.
- Free on-site assessments and itemized written quotes.

Last updated: ${today}
`;
  return new Response(md, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
