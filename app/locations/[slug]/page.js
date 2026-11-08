import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, getLocation } from "@/lib/content";
import { faqSchema, breadcrumbSchema, localBusinessSchema, JsonLd } from "@/lib/schema";
import FAQ from "@/components/FAQ";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import ServiceCard from "@/components/ServiceCard";
import HeroPanel from "@/components/HeroPanel";
import StatsBand from "@/components/StatsBand";
import HeroDecor from "@/components/HeroDecor";

export async function generateStaticParams() {
  const content = await getContent();
  return content.locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const l = await getLocation(params.slug);
  if (!l) return {};
  return {
    title: l.title,
    description: l.metaDescription,
    alternates: { canonical: `/locations/${l.slug}` },
    openGraph: { title: l.title, description: l.metaDescription, images: [{ url: l.image.src, alt: l.image.alt }] },
  };
}

export default async function LocationPage({ params }) {
  const content = await getContent();
  const l = await getLocation(params.slug);
  if (!l) notFound();
  const { settings } = content;
  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }, { name: l.name, path: `/locations/${l.slug}` }];
  const nearby = content.locations.filter((x) => x.slug !== l.slug);
  const localSchema = { ...localBusinessSchema(content), "@id": `${settings.domain}/locations/${l.slug}#local`, areaServed: [{ "@type": "City", name: l.name }] };

  return (
    <>
      <JsonLd data={[localSchema, faqSchema(l.faqs), breadcrumbSchema(settings, crumbs)]} />

      <section className="hero">
        <Breadcrumbs items={crumbs} />
        <div className="container hero-grid" style={{ paddingTop: 32 }}>
          <div className="hero-copy">
            <div className="rating-strip">
              <span className="stars">★★★★★</span>
              <span>{settings.aggregateRating.ratingValue} · {settings.aggregateRating.reviewCount} reviews</span>
            </div>
            <h1>{l.h1}</h1>
            <p className="lede">{l.intro}</p>
            <div className="hero-actions">
              <a className="btn btn-accent" href={telHref}>Call {settings.phone}</a>
            </div>
            <ul className="hero-points">
              <li>Licensed #{settings.license}</li>
              <li>Since {settings.foundedYear}</li>
              <li>Same-day quotes</li>
            </ul>
          </div>
          <HeroPanel image={l.image} services={content.services} formTitle={`Schedule Cleaning in ${l.name}`} chip={`${settings.aggregateRating.ratingValue} · ${settings.aggregateRating.reviewCount} reviews`} />
        </div>
        <HeroDecor />
      </section>

      <StatsBand />

      <section className="section-alt">
        <div className="container reveal">
          <h2>Local Cleaning Coverage in {l.name}</h2>
          <p style={{ maxWidth: 860 }}>{l.local}</p>
          <div className="badge-row">
            {l.landmarks.map((lm, i) => <span className="badge" key={i}>{lm}</span>)}
          </div>
        </div>
      </section>

      <section>
        <div className="container reveal">
          <h2>Our Services in {l.name}</h2>
          <div className="grid grid-3">
            {content.services.map((s) => (
              <ServiceCard key={s.slug} service={s} location={l.name} href={`/locations/${l.slug}/${s.slug}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container reveal">
          <h2>Recent Work in {l.name}</h2>
          <p style={{ maxWidth: 860 }}>{l.projects}</p>
        </div>
      </section>

      <section>
        <div className="container reveal" style={{ maxWidth: 860 }}>
          <h2>{l.name} Cleaning FAQs</h2>
          <FAQ faqs={l.faqs} />
        </div>
      </section>

      <section className="section-alt">
        <div className="container reveal">
          <h2>Nearby Areas We Serve</h2>
          <div className="tag-list">
            {nearby.map((n) => (
              <Link key={n.slug} href={`/locations/${n.slug}`}>Cleaning services in {n.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <CtaBand heading={`Get a Free Cleaning Quote in ${l.name}`} text={`Call ${settings.phone} — licensed, insured crews serving ${l.name} with same-day quote responses.`} />
          <p className="updated">Last updated: {l.updatedAt}</p>
        </div>
      </section>
    </>
  );
}
