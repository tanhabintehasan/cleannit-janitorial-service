import Link from "next/link";
import { getContent } from "@/lib/content";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";
import ServiceCard from "@/components/ServiceCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";

export async function generateMetadata() {
  return {
    title: "Cleaning Services Toronto | All Services | Cleannit Janitorial",
    description: "Explore all Cleannit services: commercial cleaning, janitorial, power washing, window, balcony & post-construction cleaning, bird netting. +1 437-288-7140.",
    alternates: { canonical: "/services" },
  };
}

export default async function ServicesPage() {
  const content = await getContent();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(content.settings, crumbs)} />
      <Breadcrumbs items={crumbs} />
      <section>
        <div className="container">
          <h1>Cleaning Services in Toronto &amp; the GTA</h1>
          <p style={{ maxWidth: 800 }}>Every Cleannit service is delivered by licensed (Licence #{content.settings.license}), insured and uniformed crews with founder-led quality control. Pick a service to see what's included, pricing guidance and FAQs.</p>
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            {content.services.map((s) => <ServiceCard key={s.slug} service={s} />)}
          </div>
        </div>
      </section>
      <section><div className="container"><CtaBand /></div></section>
    </>
  );
}
