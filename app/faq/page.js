import { getContent } from "@/lib/content";
import { faqSchema, breadcrumbSchema, JsonLd } from "@/lib/schema";
import FAQ from "@/components/FAQ";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = getContent();
  return { title: pages.faq.title, description: pages.faq.metaDescription, alternates: { canonical: "/faq" } };
}

export default function FaqPage() {
  const content = getContent();
  const { settings, pages } = content;
  const p = pages.faq;
  const crumbs = [{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }];
  const allFaqs = [
    ...pages.home.faqs,
    ...content.services.flatMap((s) => s.faqs),
  ];
  const seen = new Set();
  const unique = allFaqs.filter((f) => (seen.has(f.q) ? false : (seen.add(f.q), true)));

  return (
    <>
      <JsonLd data={[faqSchema(unique), breadcrumbSchema(settings, crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <section>
        <div className="container reveal" style={{ maxWidth: 860 }}>
          <span className="eyebrow">Good to Know</span>
          <h1>{p.h1}</h1>
          <p style={{ fontSize: "1.05rem" }}>{p.intro}</p>

          <h2 style={{ marginTop: 34 }}>General Questions</h2>
          <FAQ faqs={pages.home.faqs} />

          {content.services.map((s) => (
            <div key={s.slug} style={{ marginTop: 30 }}>
              <h2>{s.name} FAQs</h2>
              <FAQ faqs={s.faqs} />
            </div>
          ))}

          <p className="updated">Last updated: {p.updatedAt}</p>
        </div>
      </section>
      <section style={{ paddingTop: 0 }}>
        <div className="container"><CtaBand heading="Still Have Questions?" text={`Call ${settings.phone} or WhatsApp us — a Cleannit specialist answers the same business day.`} /></div>
      </section>
    </>
  );
}
