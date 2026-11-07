import { getContent } from "@/lib/content";
import { breadcrumbSchema, faqSchema, JsonLd } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuoteForm from "@/components/QuoteForm";
import { waLink } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { pages } = await getContent();
  return { title: pages.contact.title, description: pages.contact.metaDescription, alternates: { canonical: "/contact" } };
}

export default async function ContactPage() {
  const content = await getContent();
  const { settings, pages } = content;
  const p = pages.contact;
  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }];
  const days = [["monday", "Mon"], ["tuesday", "Tue"], ["wednesday", "Wed"], ["thursday", "Thu"], ["friday", "Fri"], ["saturday", "Sat"], ["sunday", "Sun"]];
  const faqs = [
    { q: "How fast will I hear back?", a: "We respond to every quote request the same business day, usually within a few hours." },
    { q: "Do you charge for quotes or site visits?", a: "No — quotes and on-site assessments across Toronto and the GTA are free and no-obligation." },
    { q: "Can I get a quote without a site visit?", a: "Often yes — send photos or a short video via WhatsApp and we can price many jobs remotely." },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(settings, crumbs), faqSchema(faqs)]} />
      <Breadcrumbs items={crumbs} />
      <section>
        <div className="container grid grid-2 reveal" style={{ alignItems: "start" }}>
          <div>
            <h1>{p.h1}</h1>
            <p>{p.intro}</p>
            <div className="admin-card" style={{ boxShadow: "var(--shadow)" }}>
              <h3 style={{ marginTop: 0 }}>Call or Message</h3>
              <p style={{ margin: "6px 0" }}>Phone: <a href={telHref}><b>{settings.phone}</b></a></p>
              <p style={{ margin: "6px 0" }}>WhatsApp: <a href={waLink(settings)} target="_blank" rel="noopener"><b>{settings.whatsapp}</b></a></p>
              <p style={{ margin: "6px 0" }}>Email: <a href={`mailto:${settings.email}`}>{settings.email}</a></p>
              {settings.gbpUrl ? <p style={{ margin: "6px 0" }}><a href={settings.gbpUrl} target="_blank" rel="noopener">Google Business Profile</a></p> : null}
              <h3>Hours</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {days.map(([k, label]) => (
                  <li key={k} style={{ padding: "2px 0", color: "var(--muted)" }}>
                    {label}: {settings.hours[k]?.closed ? "Closed" : `${settings.hours[k]?.open}–${settings.hours[k]?.close}`}
                  </li>
                ))}
              </ul>
              <h3>Service Area</h3>
              <p style={{ margin: 0, color: "var(--muted)" }}>{settings.serviceArea.join(" · ")}</p>
              <p style={{ marginTop: 10, color: "var(--muted)", fontSize: "0.9rem" }}>Business Licence #{settings.license}</p>
            </div>
          </div>
          <QuoteForm services={content.services} />
        </div>
      </section>
      <section style={{ background: "#fff" }}>
        <div className="container reveal" style={{ maxWidth: 820 }}>
          <h2>Contact FAQs</h2>
          {faqs.map((f, i) => (
            <details className="faq-item" key={i}>
              <summary>{f.q}</summary>
              <div className="faq-a"><p style={{ margin: 0 }}>{f.a}</p></div>
            </details>
          ))}
          <p className="updated">Last updated: {p.updatedAt}</p>
        </div>
      </section>
    </>
  );
}
