import { getContent } from "@/lib/content";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Service Areas — Toronto & GTA | Cleannit Janitorial Services",
    description: "Cleannit serves Toronto, North York, Scarborough, Etobicoke, Mississauga, Brampton, Vaughan & Markham. Licensed & insured. Call +1 437-288-7140.",
    alternates: { canonical: "/locations" },
  };
}

export default async function LocationsPage() {
  const content = await getContent();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(content.settings, crumbs)} />
      <Breadcrumbs items={crumbs} />
      <section>
        <div className="container">
          <h1>Areas We Serve Across the GTA</h1>
          <p style={{ maxWidth: 800 }}>Cleannit Janitorial Services runs local crews across the Greater Toronto Area. Every location below has its own dedicated service page with local details, pricing guidance and FAQs.</p>
          <div className="grid grid-4" style={{ marginTop: 28 }}>
            {content.locations.map((l) => (
              <article className="card" key={l.slug}>
                <Link href={`/locations/${l.slug}`} tabIndex={-1} aria-hidden="true">
                  <Image src={l.image.src} alt={l.image.alt} width={600} height={400}
                    sizes="(max-width: 560px) 100vw, 25vw"
                    style={{ width: "100%", height: "auto", aspectRatio: "3/2", objectFit: "cover" }} />
                </Link>
                <div className="card-body">
                  <h3>Cleaning Services in {l.name}</h3>
                  <p>{l.intro.slice(0, 110)}…</p>
                  <Link className="card-link" href={`/locations/${l.slug}`}>Cleaning services in {l.name}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section><div className="container"><CtaBand /></div></section>
    </>
  );
}
