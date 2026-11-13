import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { faqSchema, breadcrumbSchema, reviewSchemas, JsonLd, waLink } from "@/lib/schema";
import ServiceCard from "@/components/ServiceCard";
import FAQ from "@/components/FAQ";
import CtaBand from "@/components/CtaBand";
import HeroPanel from "@/components/HeroPanel";
import StatsBand from "@/components/StatsBand";
import HeroDecor from "@/components/HeroDecor";

export async function generateMetadata() {
  const { pages } = await getContent();
  return { title: pages.home.title, description: pages.home.metaDescription, alternates: { canonical: "/" } };
}

export default async function HomePage() {
  const content = await getContent();
  const { settings, pages, services, locations } = content;
  const p = pages.home;
  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  const ratingChip = `${settings.aggregateRating.ratingValue} · ${settings.aggregateRating.reviewCount} reviews`;

  return (
    <>
      <JsonLd data={[
        faqSchema(p.faqs),
        breadcrumbSchema(settings, [{ name: "Home", path: "/" }]),
        ...reviewSchemas(content, content.testimonials),
      ]} />

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="rating-strip">
              <span className="stars">★★★★★</span>
              <span>{ratingChip}</span>
            </div>
            <h1>{p.h1}</h1>
            <p className="lede">{settings.tagline} Licensed, insured and founder-led since {settings.foundedYear} — commercial, industrial, residential &amp; maintenance cleaning across the GTA.</p>
            <div className="hero-actions">
              <a className="btn btn-accent" href={telHref}>Call {settings.phone}</a>
              <a className="btn btn-outline" href={waLink(settings)} target="_blank" rel="noopener">WhatsApp Us</a>
            </div>
            <ul className="hero-points">
              <li>Licensed #{settings.license}</li>
              <li>Insured &amp; background-checked</li>
              <li>Free on-site quotes</li>
              <li>Same-day response</li>
            </ul>
          </div>
          <HeroPanel image={p.heroImage} services={services} formTitle="Schedule a Free Quote" chip={ratingChip} />
        </div>
        <HeroDecor />
      </section>

      <StatsBand />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <span key={n}>
              {services.map((s) => s.name).join(" \u00a0 ")}{" \u00a0 "}Toronto · North York · Scarborough · Etobicoke · Mississauga · Brampton · Vaughan · Markham{" \u00a0 "}
            </span>
          ))}
        </div>
      </div>

      <section>
        <div className="container reveal" style={{ maxWidth: 860, textAlign: "center" }}>
          <span className="eyebrow eyebrow-center">Who We Are</span>
          <h2>A Professional Cleaning Firm Toronto Trusts</h2>
          <p style={{ fontSize: "1.08rem" }}>{p.intro}</p>
          <p>Every account runs on a written checklist, supervisor audits and a named contact — the systems that have kept Cleannit growing on referrals and {settings.aggregateRating.reviewCount} client reviews since {settings.foundedYear}. Whether you manage a downtown office tower, a retail plaza in Mississauga or a condo balcony in Etobicoke, you get the same standard: Quality. Care. Consistency.</p>
        </div>
      </section>

      <section className="section-alt" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow eyebrow-center">What We Do</span>
          <h2 className="section-title">Our Cleaning Services</h2>
          <p className="section-sub">One licensed contractor for every cleaning job — commercial, industrial, residential and maintenance.</p>
          <div className="grid grid-3 reveal">
            {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <span className="eyebrow eyebrow-center">How It Works</span>
          <h2 className="section-title">Booked in Three Simple Steps</h2>
          <p className="section-sub">From first call to finished clean — most quotes are confirmed the same business day.</p>
          <div className="how-grid reveal">
            <div className="how-card">
              <h3>Tell Us About the Job</h3>
              <p>Call {settings.phone}, WhatsApp us photos, or send the form. We scope your space, schedule and priorities.</p>
            </div>
            <div className="how-card">
              <h3>Get a Written Quote</h3>
              <p>Free on-site assessment anywhere in the GTA, then a fixed, itemized price — no hidden charges, no lock-ins.</p>
            </div>
            <div className="how-card">
              <h3>We Clean, You Relax</h3>
              <p>Uniformed, insured crews arrive on schedule in branded vehicles. Supervisors audit the work against your checklist.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container split reveal">
          <div>
            <span className="eyebrow">Why Cleannit</span>
            <h2>{p.whyChooseTitle}</h2>
            <ul className="checklist">
              {p.whyChoose.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
            <div className="hero-actions" style={{ marginTop: 20 }}>
              <Link className="btn btn-primary" href="/about">Meet the Team Behind Cleannit</Link>
            </div>
          </div>
          <div>
            <Image
              src={pages.about.founderImage.src}
              alt={pages.about.founderImage.alt}
              width={1000}
              height={1500}
              sizes="(max-width: 900px) 100vw, 45vw"
              style={{ width: "100%", height: "auto", borderRadius: 16 }}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="container split reveal">
          <div>
            <Image
              src={settings.fleetImage.src}
              alt={settings.fleetImage.alt}
              width={1600}
              height={900}
              sizes="(max-width: 900px) 100vw, 45vw"
              style={{ width: "100%", height: "auto", borderRadius: 16 }}
            />
          </div>
          <div>
            <span className="eyebrow">Our Fleet</span>
            <h2>A Real Local Company — Branded Fleet, Uniformed Crews</h2>
            <p>When a Cleannit van pulls up, you know exactly who is on your property. Our branded fleet has carried commercial-grade equipment across Toronto and the GTA since {settings.foundedYear} — commercial cleaning, power washing, window cleaning, balcony cleaning, post-construction cleanup and bird netting, all from one accountable contractor.</p>
            <p>Every vehicle carries professional-grade equipment, eco-friendly product options and the checklists your job runs on — no subcontracted strangers, no surprises.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/gallery">See Our Work</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container">
          <span className="eyebrow eyebrow-center">Reviews</span>
          <h2 className="section-title">Trusted Across the GTA — {settings.aggregateRating.reviewCount} Reviews</h2>
          <p className="section-sub">Real feedback from property managers, facilities teams and homeowners since {settings.foundedYear}.</p>
          <div className="grid grid-3 reveal">
            {content.testimonials.map((t, i) => (
              <div className="testimonial" key={i}>
                <div className="stars" aria-label={`${t.rating} out of 5 stars`}>{"★".repeat(t.rating)}</div>
                <p>“{t.text}”</p>
                <p className="who">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <span className="eyebrow eyebrow-center">Service Areas</span>
          <h2 className="section-title">Areas We Serve</h2>
          <p className="section-sub">Local crews across the Greater Toronto Area — each with dedicated local service pages, pricing guidance and FAQs.</p>
          <div className="tag-list reveal" style={{ justifyContent: "center" }}>
            {locations.map((l) => (
              <Link key={l.slug} href={`/locations/${l.slug}`}>{l.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container reveal" style={{ maxWidth: 860 }}>
          <span className="eyebrow eyebrow-center">Compare</span>
          <h2 className="section-title">Cleannit vs. a Typical Cleaning Company</h2>
          <p className="section-sub">What you actually get when you hire us — measured against what's typical in the Toronto market.</p>
          <div className="price-table-wrap">
            <table className="price-table">
              <thead>
                <tr><th scope="col">What matters</th><th scope="col">Cleannit</th><th scope="col">Typical company</th></tr>
              </thead>
              <tbody>
                {[
                  ["Founder-led quality audits", "Every account", "Rarely"],
                  ["Written zone checklists", "Every visit", "Sometimes"],
                  ["Licensed & insured (Lic. #" + settings.license + ")", "Always", "Varies"],
                  ["Same crew every visit", "Yes, dedicated", "Rotating strangers"],
                  ["One contractor for 12 services", "Yes", "No — multiple vendors"],
                  ["Fixed written quotes", "Always free", "Often vague"],
                  ["Direct line to management", "Same day", "Call centres"],
                ].map(([a, b, c], i) => (
                  <tr key={i}><td>{a}</td><td><b>{b}</b></td><td>{c}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container reveal" style={{ maxWidth: 860 }}>
          <span className="eyebrow eyebrow-center">Good to Know</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <FAQ faqs={p.faqs} />
          <p style={{ textAlign: "center", marginTop: 18 }}><Link className="card-link" href="/faq">See all frequently asked questions</Link></p>
        </div>
      </section>

      <section>
        <div className="container">
          <CtaBand />
          <p className="updated">Last updated: {p.updatedAt}</p>
        </div>
      </section>
    </>
  );
}
