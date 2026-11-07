import Image from "next/image";
import { getContent } from "@/lib/content";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = await getContent();
  return { title: pages.about.title, description: pages.about.metaDescription, alternates: { canonical: "/about" } };
}

export default async function AboutPage() {
  const content = await getContent();
  const { settings, pages } = content;
  const p = pages.about;
  const crumbs = [{ name: "Home", path: "/" }, { name: "About", path: "/about" }];

  return (
    <>
      <JsonLd data={breadcrumbSchema(settings, crumbs)} />
      <Breadcrumbs items={crumbs} />
      <section>
        <div className="container split reveal">
          <div>
            <h1>{p.h1}</h1>
            {p.blocks.slice(0, 2).map((b, i) => (
              <div key={i}><h2>{b.h}</h2><p>{b.p}</p></div>
            ))}
          </div>
          <div>
            <Image src={p.founderImage.src} alt={p.founderImage.alt} width={1000} height={1500} priority
              sizes="(max-width: 900px) 100vw, 45vw" style={{ width: "100%", height: "auto", borderRadius: 12 }} />
            <p style={{ textAlign: "center", marginTop: 10, fontWeight: 700, color: "var(--navy)" }}>
              {settings.founder} — Founder &amp; CEO
            </p>
          </div>
        </div>
      </section>
      <section style={{ background: "#fff" }}>
        <div className="container reveal" style={{ maxWidth: 860 }}>
          {p.blocks.slice(2).map((b, i) => (
            <div key={i}><h2>{b.h}</h2><p>{b.p}</p></div>
          ))}
          <div className="split" style={{ marginTop: 28 }}>
            <Image src="/images/cleannit-janitorial-branded-service-van-toronto.webp"
              alt="Cleannit Janitorial Services branded fleet serving the GTA"
              width={1600} height={900} style={{ width: "100%", height: "auto", borderRadius: 12 }} />
            <Image src="/images/cleannit-janitorial-client-partnership-gta.webp"
              alt="Cleannit Janitorial Services client partnership in the GTA"
              width={1200} height={800} style={{ width: "100%", height: "auto", borderRadius: 12 }} />
          </div>
          <div className="badge-row" style={{ marginTop: 24 }}>
            <span className="badge">Licence #{settings.license}</span>
            <span className="badge">Fully Insured</span>
            <span className="badge">Founder-Led</span>
            <span className="badge">GTA-Wide</span>
          </div>
          <p className="updated">Last updated: {p.updatedAt}</p>
        </div>
      </section>
      <section><div className="container"><CtaBand /></div></section>
    </>
  );
}
