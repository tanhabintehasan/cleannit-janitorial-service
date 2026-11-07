import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, getService } from "@/lib/content";
import { faqSchema, breadcrumbSchema, serviceSchema, JsonLd } from "@/lib/schema";
import FAQ from "@/components/FAQ";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import QuoteForm from "@/components/QuoteForm";
import HeroPanel from "@/components/HeroPanel";
import StatsBand from "@/components/StatsBand";
import HeroDecor from "@/components/HeroDecor";

export async function generateStaticParams() {
  const content = await getContent();
  return content.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const s = await getService(params.slug);
  if (!s) return {};
  return { title: s.title, description: s.metaDescription, alternates: { canonical: `/services/${s.slug}` } };
}

export default async function ServicePage({ params }) {
  const content = await getContent();
  const s = await getService(params.slug);
  if (!s) notFound();
  const { settings } = content;
  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: s.name, path: `/services/${s.slug}` }];
  const related = (s.related || []).map((r) => content.services.find((x) => x.slug === r)).filter(Boolean);
  const blog = s.blogLink ? content.posts.find((p) => p.slug === s.blogLink) : null;

  return (
    <>
      <JsonLd data={[serviceSchema(content, s), faqSchema(s.faqs), breadcrumbSchema(settings, crumbs)]} />

      <section className="hero">
        <Breadcrumbs items={crumbs} />
        <div className="container hero-grid" style={{ paddingTop: 32 }}>
          <div className="hero-copy">
            <div className="rating-strip">
              <span className="stars">★★★★★</span>
              <span>{settings.aggregateRating.ratingValue} · {settings.aggregateRating.reviewCount} reviews</span>
            </div>
            <h1>{s.h1}</h1>
            <p className="lede">{s.intro}</p>
            <p className="byline">Reviewed by <b>{settings.founder}</b>, Founder &amp; CEO · Licence #{settings.license} · Updated {s.updatedAt}</p>
            <div className="hero-actions">
              <a className="btn btn-accent" href={telHref}>Call {settings.phone}</a>
            </div>
            <ul className="hero-points">
              <li>Licensed #{settings.license}</li>
              <li>Since {settings.foundedYear}</li>
              <li>Insured crews</li>
            </ul>
          </div>
          <HeroPanel image={s.hero} services={content.services} formTitle={`Schedule ${s.name}`} chip={`${settings.aggregateRating.ratingValue} · ${settings.aggregateRating.reviewCount} reviews`} lockedService={s.name} />
        </div>
        <HeroDecor />
      </section>

      <StatsBand />

      {s.experience ? (
        <section>
          <div className="container reveal">
            <span className="eyebrow">Our Experience</span>
            <h2>Hands-On {s.name} Experience Across the GTA</h2>
            <p style={{ maxWidth: 860, fontSize: "1.05rem" }}>{s.experience}</p>
          </div>
        </section>
      ) : null}

      <section className="section-alt">
        <div className="container">
          <h2>{s.includes.heading}</h2>
          <ul className="checklist grid grid-2">
            {s.includes.items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        </div>
      </section>

      <section>
        <div className="container reveal">
          <h2>Benefits of Professional {s.name}</h2>
          <ul className="checklist grid grid-2">
            {s.benefits.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      </section>

      <section className="section-alt">
        <div className="container reveal">
          <h2>Common Problems We Solve</h2>
          <div className="grid grid-3">
            {s.problems.map((pr, i) => (
              <div className="problem-card" key={i}><h3>{pr.h}</h3><p>{pr.p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container reveal">
          <h2>Our {s.name} Process</h2>
          <div className="steps">
            {s.process.map((st, i) => (
              <div className="step" key={i}><h3>{st.h}</h3><p>{st.p}</p></div>
            ))}
          </div>
        </div>
      </section>

      {s.pricing ? (
        <section className="section-alt">
          <div className="container reveal">
            <div className="pricing-card">
              <h2>{s.pricing.heading}</h2>
              <p>{s.pricing.p}</p>
              <h3 style={{ color: "#fff", marginTop: 16 }}>What affects your price</h3>
              <ul className="checklist grid grid-2">
                {s.pricing.factors.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <div className="container">
          <h2>Why Choose Cleannit for {s.name}</h2>
          <p style={{ maxWidth: 860 }}>{s.whyChoose}</p>
        </div>
      </section>

      {s.gallery?.length ? (
        <section className="section-alt">
          <div className="container reveal">
            <h2>Recent {s.name} Work</h2>
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
          <h2>{s.name} FAQs</h2>
          <FAQ faqs={s.faqs} />
          {blog ? (
            <p>Related reading: <Link href={`/blog/${blog.slug}`}>{blog.title}</Link></p>
          ) : null}
          <p>
            We follow guidance from{" "}
            <a href="https://www.toronto.ca" rel="noopener" target="_blank">the City of Toronto</a> and{" "}
            <a href="https://www.canada.ca/en/health-canada.html" rel="noopener" target="_blank">Health Canada</a>{" "}
            on safe cleaning and disinfection practices.
          </p>
        </div>
      </section>

      <section className="section-alt">
        <div className="container reveal">
          <h2>Related Services</h2>
          <div className="tag-list">
            {related.map((r) => <Link key={r.slug} href={`/services/${r.slug}`}>{r.name} in Toronto</Link>)}
          </div>
        </div>
      </section>

      <section id="quote">
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          <div>
            <h2>Get a Free {s.name} Quote</h2>
            <p>Call <a href={telHref}>{settings.phone}</a> or send the form — we respond the same business day, with free on-site assessments across the GTA.</p>
            <CtaBand heading="Prefer to Talk?" text={`Call ${settings.phone} now — a Cleannit specialist will scope your ${s.name.toLowerCase()} job in minutes.`} />
          </div>
          <QuoteForm services={content.services} lockedService={s.name} formTitle={`Book ${s.name}`} />
        </div>
        <div className="container"><p className="updated">Last updated: {s.updatedAt}</p></div>
      </section>
    </>
  );
}
