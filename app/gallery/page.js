import Image from "next/image";
import { getContent } from "@/lib/content";
import { breadcrumbSchema, imageObjectSchema, JsonLd } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";

export async function generateMetadata() {
  return {
    title: "Our Work Gallery | Cleannit Janitorial Services Toronto",
    description: "See Cleannit Janitorial's work across Toronto & the GTA: commercial cleaning, power washing, balcony cleaning, post-construction cleanup & our branded fleet.",
    alternates: { canonical: "/gallery" },
  };
}

export default async function GalleryPage() {
  const content = await getContent();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }];
  const items = [
    { src: "/images/cleannit-janitorial-branded-service-van-toronto.webp", alt: "Cleannit branded service van in Toronto", caption: "Our branded fleet — serving the whole GTA" },
    { src: "/images/commercial-cleaning-office-building-toronto.webp", alt: "Commercial office cleaning result in Toronto", caption: "Commercial office program, Toronto" },
    { src: "/images/janitorial-services-mopping-lobby-toronto.webp", alt: "Janitorial mopping service in a Toronto lobby", caption: "Nightly janitorial service" },
    { src: "/images/power-washing-services-toronto-action.webp", alt: "Power washing action on stone in Toronto", caption: "Power washing — grime lifted in one pass" },
    { src: "/images/window-cleaning-services-toronto-professional.webp", alt: "Professional window cleaning in Toronto", caption: "Streak-free window detailing" },
    { src: "/images/condo-balcony-cleaning-toronto.webp", alt: "Condo balconies cleaned in Toronto", caption: "Condo balcony cleaning, Toronto towers" },
    { src: "/images/post-construction-cleaning-site-toronto.webp", alt: "Post-construction cleaning site in Toronto", caption: "Post-construction turnover cleans" },
    { src: "/images/bird-netting-pigeon-control-balcony-toronto.webp", alt: "Bird netting pigeon control in Toronto", caption: "Bird netting & pigeon control" },
    { src: "/images/founder-dr-adekunle-adebanjo-ceo-cleannit.webp", alt: "Founder Dr. Adekunle Adebanjo of Cleannit Janitorial", caption: "Founder-led quality control" },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(content.settings, crumbs), ...items.map((i) => imageObjectSchema(content.settings, i, "/gallery"))]} />
      <Breadcrumbs items={crumbs} />
      <section>
        <div className="container reveal">
          <h1>Our Work Across Toronto &amp; the GTA</h1>
          <p style={{ maxWidth: 800 }}>Real Cleannit crews, real equipment, real results — from branded fleet to finished floors.</p>
          <div className="gallery-grid" style={{ marginTop: 26 }}>
            {items.map((g, i) => (
              <figure className="gallery-item" key={i}>
                <Image src={g.src} alt={g.alt} width={800} height={600} loading={i < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 560px) 100vw, 33vw" style={{ width: "100%", height: "auto" }} />
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section><div className="container"><CtaBand /></div></section>
    </>
  );
}
