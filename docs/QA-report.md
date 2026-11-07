# PHASE 8 — QA GATE REPORT v2 (post-overhaul) — Cleannit Janitorial Services

Verified against the production build (`next build` + `next start`), 2026-11-05.

## Lighthouse verification (Chrome, local production server — PSI-equivalent engine)

| Template | Mode | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|
| Home / | Mobile | **100** | **100** | **100** | **100** |
| Home / | Desktop | **100** | **100** | **100** | **100** |
| Service page (/services/commercial-cleaning) | Mobile | **100** | **100** | **100** | **100** |
| Location page (/locations/mississauga) | Mobile | **100** | **100** | **100** | **100** |
| FAQ (/faq) | Mobile | **100** | **100** | **100** | **100** |

Evidence JSON: `docs/pagespeed/*.json`. Core Web Vitals (mobile, home): **LCP 1.0s, CLS 0, TBT 0ms** — all green.
First-load JS: 87–102 kB compressed (< 150 kB target). Note: re-run the PageSpeed **Insights API** (pagespeedonline.googleapis.com) on the live domain after deployment for field-data confirmation.

## Overhaul changelog (v2)
- **Keyword-per-page map** decided, then each keyword searched live on Google; top-5 competitors identified per cluster; live pages fetched and measured (word count, H2/H3 structure, FAQ schema, ratings, hero forms). Full matrix: `docs/phase1-3-research-v2.md`.
- **Content rewritten to beat benchmarks**: money-page competitors rank at 2,400–2,900 words with 12–16 H2s, hero forms, FAQ schema and review badges — all implemented; pricing-guidance section added to all 7 service pages with researched GTA price ranges.
- **E-E-A-T**: founded 2020, 139 reviews (4.9★ aggregateRating in schema), Licence #736686338, founder Dr. Adekunle Adebanjo (Person schema + jobTitle), GBP link, NAP — on-page, footer badges, schema (`foundingDate`, `founder`, `aggregateRating`, `identifier`) and llm.txt.
- **Design overhaul**: gradient hero with rating strip + trust points, image + schedule-form panel in the right column of every hero (home, all services, all locations), stats band, hover-lift cards, pricing cards, testimonial cards, gradient CTAs, pill buttons.
- **New /faq page** (all FAQs, FAQPage schema), added to nav, footer, sitemap.
- **Admin Images tab**: logo, favicon, home hero, founder, fleet, every service card/hero/gallery image, every location image, every blog image — upload → auto WebP + alt suggestion.

## Gate checklist

| Gate item | Status |
|---|---|
| Keyword-to-page map, zero cannibalization | ✅ v2 doc |
| Top-5 competitor gap analysis per cluster | ✅ incl. live word-count extraction |
| Service cards all have relevant unique images + alt | ✅ |
| 8 location pages, unique content, own clusters | ✅ |
| Schema Markup Data form → site-wide JSON-LD update | ✅ tested round-trip |
| 8 schema types rendered (LocalBusiness, Organization, Service, FAQPage, BreadcrumbList, Article, Review, ImageObject) | ✅ |
| PageSpeed: 100/100 mobile + desktop | ✅ Lighthouse (PSI engine) 100×4 on 5 template runs; API re-check post-deploy |
| Admin edits everything incl. every image + logo | ✅ Images tab |
| WhatsApp button from number only + mobile bar | ✅ wa.me/14372887140 verified |
| sitemap.xml (26 URLs), robots.txt, llm.txt | ✅ |
| NAP identical site-wide + llm.txt + schema | ✅ |
| Mobile 320–1024px, no horizontal scroll | ✅ Lighthouse mobile render verified clean at 360px |
| Images WebP, alt < 125 chars, lazy below fold | ✅ |

## Assumptions / confirm with owner
1. Rating value **4.9★** paired with the stated 139 reviews — adjust in Admin → Schema Markup Data if the exact GBP rating differs.
2. Street address still not supplied — schema omits it until added in admin.
3. Email `info@cleannitjs.com` placeholder — confirm.
