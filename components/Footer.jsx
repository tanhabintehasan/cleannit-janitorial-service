import Link from "next/link";
import { getContent } from "@/lib/content";

export default async function Footer() {
  const content = await getContent();
  const { settings } = content;
  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  const addr = settings.address || {};
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>{settings.businessName}</h3>
          <address style={{ fontStyle: "normal" }}>
            {[addr.street, [addr.city, addr.region].filter(Boolean).join(", "), addr.postalCode, addr.country]
              .filter(Boolean).join(", ") || "Toronto & the GTA, ON, Canada"}
            <br />
            <a href={telHref}>{settings.phone}</a>
            <br />
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
            <br />
            {settings.license ? <>Licence #{settings.license}</> : null}
          </address>
          <div className="footer-badges">
            {settings.foundedYear ? <span>Since {settings.foundedYear}</span> : null}
            {settings.aggregateRating?.reviewCount ? <span>★ {settings.aggregateRating.ratingValue} · {settings.aggregateRating.reviewCount} reviews</span> : null}
            {settings.license ? <span>Licence #{settings.license}</span> : null}
          </div>
        </div>
        <div>
          <h3>Services</h3>
          <ul>
            {content.services.map((s) => (
              <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Locations</h3>
          <ul>
            {content.locations.map((l) => (
              <li key={l.slug}><Link href={`/locations/${l.slug}`}>{l.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Company</h3>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact & Free Quote</Link></li>
            {settings.gbpUrl ? <li><a href={settings.gbpUrl} rel="noopener">Google Business Profile</a></li> : null}
            <li><a href="/llm.txt">llm.txt</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {settings.businessName}.</span>
        <span>{settings.tagline}</span>
        <span>Serving Toronto & the Greater Toronto Area.</span>
      </div>
    </footer>
  );
}
