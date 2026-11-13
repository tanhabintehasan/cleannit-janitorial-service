import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { buildLocalServiceContent, priceTables } from "@/lib/local-content";
import { faqSchema, breadcrumbSchema, serviceSchema, JsonLd, absUrl } from "@/lib/schema";
import FAQ from "@/components/FAQ";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import HeroPanel from "@/components/HeroPanel";
import StatsBand from "@/components/StatsBand";
import BalconyQuoteQuiz from "@/components/BalconyQuoteQuiz";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import NetWorkVisual from "@/components/NetWorkVisual";

// Balcony pair: each page leads with its own service and carries the other below.
const BALCONY_PAIR = { "balcony-cleaning": "balcony-netting", "balcony-netting": "balcony-cleaning" };

export async function generateStaticParams() {
  const content = await getContent();
  return content.locations.flatMap((l) =>
    content.services.map((s) => ({ slug: l.slug, service: s.slug }))
  );
}

export async function generateMetadata({ params }) {
  const content = await getContent();
  const l = content.locations.find((x) => x.slug === params.slug);
  const s = content.services.find((x) => x.slug === params.service);
  if (!l || !s) return {};
  const c = buildLocalServiceContent(l, s);
  return {
    title: c.title,
    description: c.metaDescription,
    alternates: { canonical: `/locations/${l.slug}/${s.slug}` },
    openGraph: { title: c.title, description: c.metaDescription, images: [{ url: s.hero.src, alt: s.hero.alt }] },
  };
}

export default async function LocalServicePage({ params }) {
  const content = await getContent();
  const l = content.locations.find((x) => x.slug === params.slug);
  const s = content.services.find((x) => x.slug === params.service);
  if (!l || !s) notFound();

  const { settings } = content;
  const c = buildLocalServiceContent(l, s);
  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: l.name, path: `/locations/${l.slug}` },
    { name: s.name, path: `/locations/${l.slug}/${s.slug}` },
  ];
  const svcSchema = {
    ...serviceSchema(content, s),
    url: absUrl(settings, `/locations/${l.slug}/${s.slug}`),
    name: `${s.name} in ${l.name}`,
    description: s.shortDesc.replace(/ in Toronto/i, ` in ${l.name}`),
    areaServed: [{ "@type": "City", name: l.name }],
  };
  const sameCity = content.services.filter((x) => x.slug !== s.slug);
  const nearby = content.locations.filter((x) => x.slug !== l.slug);
  const rows = priceTables[s.slug] || [];
  const companionSlug = BALCONY_PAIR[s.slug];
  const companion = companionSlug ? content.services.find((x) => x.slug === companionSlug) : null;

  return (
    <>
      <JsonLd data={[svcSchema, faqSchema(c.faqs), breadcrumbSchema(settings, crumbs)]} />

      <section className="hero">
        <Breadcrumbs items={crumbs} />
        <div className="container hero-grid" style={{ paddingTop: 32 }}>
          <div className="hero-copy">
            <div className="rating-strip">
              <span className="stars">★★★★★</span>
              <span>{settings.aggregateRating.ratingValue} · {settings.aggregateRating.reviewCount} reviews</span>
            </div>
            <h1>{c.h1}</h1>
            <p className="lede">{c.intro}</p>
            <p className="byline">Reviewed by <b>{settings.founder}</b>, Founder &amp; CEO · Licence #{settings.license}</p>
            <div className="hero-actions">
              <a className="btn btn-accent" href={telHref}>Call {settings.phone}</a>
            </div>
            <ul className="hero-points">
              <li>Licensed #{settings.license}</li>
              <li>Since {settings.foundedYear}</li>
              <li>Local {l.name} crews</li>
            </ul>
          </div>
          <HeroPanel image={s.hero} services={content.services} formTitle={`${s.name} in ${l.name}`} chip={`${settings.aggregateRating.ratingValue} · ${settings.aggregateRating.reviewCount} reviews`} lockedService={s.name} />
        </div>
      </section>

      <StatsBand />

      {companion ? (
        <section>
          <div className="container reveal">
            <span className="eyebrow">Instant Estimate</span>
            <BalconyQuoteQuiz mode={s.slug} location={l.name} phone={settings.phone} />
          </div>
        </section>
      ) : null}

      {companion ? (
        <section>
          <div className="container reveal">
            <span className="eyebrow">See the Difference</span>
            <h2>From Pigeon Mess to Protected Balcony in {l.name} — Drag to Compare</h2>
            <p style={{ maxWidth: 860 }}>Slide the handle to see what a Cleannit visit does: droppings and nesting mess removed, balcony sanitized, and discreet netting installed so pigeons never come back.</p>
            <div style={{ marginTop: 20 }}>
              <BeforeAfterSlider
                before={{ src: "/images/bird-netting-pigeon-control-balcony-toronto.webp", alt: "Balcony ledge with roosting pigeons and droppings before cleaning" }}
                after={{ src: "/images/condo-balcony-cleaning-toronto.webp", alt: "Clean condo balconies after cleaning and netting protection" }}
                beforeLabel="Before: pigeon mess"
                afterLabel="After: clean & netted"
              />
            </div>
            <NetWorkVisual />
          </div>
        </section>
      ) : null}

      <section className="section-alt">
        <div className="container reveal">
          <span className="eyebrow">Local Coverage</span>
          <h2>{s.name} Across {l.name}</h2>
          <p style={{ maxWidth: 860 }}>{c.localNote}</p>
          <div className="badge-row">
            {l.landmarks.map((lm, i) => <span className="badge" key={i}>{lm}</span>)}
          </div>
        </div>
      </section>

      <section>
        <div className="container reveal">
          <span className="eyebrow">Scope of Work</span>
          <h2>{c.includesHeading}</h2>
          <ul className="checklist grid grid-2">
            {s.includes.items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        </div>
      </section>

      {rows.length ? (
        <section className="section-alt">
          <div className="container reveal">
            <span className="eyebrow">Transparent Pricing</span>
            <h2>{s.name} Prices in {l.name}</h2>
            <p style={{ maxWidth: 760 }}>{s.pricing.p}</p>
            <div className="price-table-wrap">
              <table className="price-table">
                <thead>
                  <tr><th scope="col">Service scope</th><th scope="col">Typical {l.name} price</th></tr>
                </thead>
                <tbody>
                  {rows.map(([scope, price], i) => (
                    <tr key={i}><td>{scope}</td><td><b>{price}</b></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="form-note" style={{ textAlign: "left" }}>Final price confirmed in a free written quote — call {settings.phone}.</p>
          </div>
        </section>
      ) : null}

      <section>
        <div className="container reveal">
          <span className="eyebrow">How It Works</span>
          <h2>Our {s.name} Process in {l.name}</h2>
          <div className="steps">
            {s.process.map((st, i) => (
              <div className="step" key={i}><h3>{st.h}</h3><p>{st.p}</p></div>
            ))}
          </div>
        </div>
      </section>

      {companion ? (
        <section className="section-alt">
          <div className="container reveal">
            <span className="eyebrow">Complete the Job</span>
            <h2>{companion.name} in {l.name}</h2>
            <p style={{ maxWidth: 860 }}>{companion.shortDesc} {companion.whyChoose}</p>
            <ul className="checklist grid grid-2" style={{ marginTop: 14 }}>
              {companion.includes.items.slice(0, 6).map((it, i) => <li key={i}>{it}</li>)}
            </ul>
            <div className="hero-actions" style={{ marginTop: 20 }}>
              <Link className="btn btn-primary" href={`/locations/${l.slug}/${companion.slug}`}>{companion.name} in {l.name} →</Link>
              <a className="btn btn-accent" href="#balcony-quote">Get an Instant Quote</a>
            </div>
          </div>
        </section>
      ) : null}

      {s.gallery?.length ? (
        <section className="section-alt">
          <div className="container reveal">
            <span className="eyebrow">Recent Work</span>
            <h2>{s.name} Results</h2>
            <div className="gallery-grid">
              {s.gallery.map((g, i) => (
                <figure className="gallery-item" key={i}>
                  <Image src={g.src} alt={g.alt} width={800} height={600} loading="lazy"
                    sizes="(max-width: 560px) 100vw, 33vw" style={{ width: "100%", height: "auto" }} />
                  <figcaption>{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <div className="container reveal" style={{ maxWidth: 860 }}>
          <span className="eyebrow">Good to Know</span>
          <h2>{s.name} in {l.name} — FAQs</h2>
          <FAQ faqs={c.faqs} />
        </div>
      </section>

      <section className="section-alt">
        <div className="container reveal">
          <span className="eyebrow">More in {l.name}</span>
          <h2>Other Services in {l.name}</h2>
          <div className="tag-list">
            {sameCity.map((x) => (
              <Link key={x.slug} href={`/locations/${l.slug}/${x.slug}`}>{x.name} in {l.name}</Link>
            ))}
          </div>
          <h3 style={{ marginTop: 28 }}>Nearby Areas We Serve</h3>
          <div className="tag-list">
            {nearby.map((n) => (
              <Link key={n.slug} href={`/locations/${n.slug}`}>{n.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <CtaBand heading={`Get Free ${s.name} Quote in ${l.name}`} text={`Call ${settings.phone} — licensed, insured local crews. Same-day quote responses across ${l.name}.`} />
          <p className="updated">Last updated: {s.updatedAt}</p>
        </div>
      </section>
    </>
  );
}
