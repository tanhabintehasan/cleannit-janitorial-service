// lib/schema.js — builds all JSON-LD from the admin "Schema Markup Data" settings.
// Rule: empty fields are omitted rather than printed blank.

export function absUrl(settings, p = "") {
  const base = (settings.domain || "").replace(/\/$/, "");
  return `${base}${p.startsWith("/") ? p : `/${p}`}`;
}

export function tel(settings) {
  return settings.phone;
}

export function waLink(settings, text) {
  const num = (settings.whatsapp || settings.phone || "").replace(/[^0-9]/g, "");
  const msg = encodeURIComponent(text || settings.whatsappMessage || `Hi ${settings.businessName}, I'd like a free quote.`);
  return `https://wa.me/${num}?text=${msg}`;
}

export function addressSchema(s) {
  if (!s.address) return undefined;
  const a = s.address;
  const out = { "@type": "PostalAddress" };
  if (a.street) out.streetAddress = a.street;
  if (a.city) out.addressLocality = a.city;
  if (a.region) out.addressRegion = a.region;
  if (a.postalCode) out.postalCode = a.postalCode;
  if (a.country) out.addressCountry = a.country;
  return Object.keys(out).length > 1 ? out : undefined;
}

function hoursSchema(s) {
  if (!s.hours) return undefined;
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const names = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" };
  const out = [];
  for (const d of days) {
    const h = s.hours[d];
    if (!h || h.closed || !h.open || !h.close) continue;
    out.push({ "@type": "OpeningHoursSpecification", dayOfWeek: names[d], opens: h.open, closes: h.close });
  }
  return out.length ? out : undefined;
}

export function organizationSchema(content) {
  const s = content.settings;
  const out = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.businessName,
  };
  if (s.domain) out.url = absUrl(s);
  if (s.logo) out.logo = { "@type": "ImageObject", url: absUrl(s, s.logo) };
  if (s.phone) out.telephone = s.phone;
  if (s.email) out.email = s.email;
  if (s.founder) out.founder = { "@type": "Person", name: s.founder, jobTitle: "Founder & CEO" };
  if (s.foundedYear) out.foundingDate = s.foundedYear;
  const addr = addressSchema(s);
  if (addr) out.address = addr;
  if (s.social && s.social.filter(Boolean).length) out.sameAs = s.social.filter(Boolean);
  return out;
}

export function localBusinessSchema(content) {
  const s = content.settings;
  const out = {
    "@context": "https://schema.org",
    "@type": s.businessType || "LocalBusiness",
    "@id": `${absUrl(s)}/#business`,
    name: s.businessName,
  };
  if (s.domain) out.url = absUrl(s);
  if (s.logo) { out.image = absUrl(s, s.logo); out.logo = absUrl(s, s.logo); }
  if (s.phone) out.telephone = s.phone;
  if (s.email) out.email = s.email;
  if (s.founder) out.founder = { "@type": "Person", name: s.founder, jobTitle: "Founder & CEO" };
  if (s.foundedYear) out.foundingDate = s.foundedYear;
  if (s.license) out.identifier = { "@type": "PropertyValue", name: "Business Licence Number", value: s.license };
  const addr = addressSchema(s);
  if (addr) out.address = addr;
  if (s.geo?.lat && s.geo?.lng) out.geo = { "@type": "GeoCoordinates", latitude: Number(s.geo.lat), longitude: Number(s.geo.lng) };
  if (s.mapsUrl) out.hasMap = s.mapsUrl;
  const hours = hoursSchema(s);
  if (hours) out.openingHoursSpecification = hours;
  if (s.serviceArea?.filter(Boolean).length) out.areaServed = s.serviceArea.filter(Boolean).map((c) => ({ "@type": "City", name: c }));
  if (s.priceRange) out.priceRange = s.priceRange;
  if (s.currenciesAccepted) out.currenciesAccepted = s.currenciesAccepted;
  if (s.aggregateRating?.ratingValue && s.aggregateRating?.reviewCount) {
    out.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: s.aggregateRating.ratingValue,
      reviewCount: s.aggregateRating.reviewCount,
    };
  }
  if (s.gbpUrl) out.sameAs = [s.gbpUrl, ...(s.social || []).filter(Boolean)];
  return out;
}

export function serviceSchema(content, service) {
  const s = content.settings;
  const out = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    url: absUrl(s, `/services/${service.slug}`),
  };
  if (service.shortDesc) out.description = service.shortDesc;
  out.provider = { "@id": `${absUrl(s)}/#business` };
  if (s.serviceArea?.filter(Boolean).length) out.areaServed = s.serviceArea.filter(Boolean).map((c) => ({ "@type": "City", name: c }));
  if (service.hero?.src) out.image = absUrl(s, service.hero.src);
  return out;
}

export function faqSchema(faqs) {
  if (!faqs || !faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.filter((f) => f.q && f.a).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(settings, items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(settings, it.path),
    })),
  };
}

export function articleSchema(content, post) {
  const s = content.settings;
  const out = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    url: absUrl(s, `/blog/${post.slug}`),
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: { "@type": "Organization", name: s.businessName, url: absUrl(s) },
    publisher: { "@type": "Organization", name: s.businessName, ...(s.logo ? { logo: { "@type": "ImageObject", url: absUrl(s, s.logo) } } : {}) },
  };
  if (post.metaDescription) out.description = post.metaDescription;
  if (post.image?.src) out.image = absUrl(s, post.image.src);
  return out;
}

export function reviewSchemas(content, reviews) {
  const s = content.settings;
  if (!reviews?.length) return [];
  return reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@id": `${absUrl(s)}/#business` },
    author: { "@type": "Person", name: r.name },
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    reviewBody: r.text,
  }));
}

export function imageObjectSchema(settings, img, pagePath) {
  if (!img?.src) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: absUrl(settings, img.src),
    name: img.alt || "",
    url: absUrl(settings, pagePath),
  };
}

export function JsonLd({ data }) {
  const list = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!list.length) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(list.length === 1 ? list[0] : list) }}
    />
  );
}
