import { getContent } from "@/lib/content";
import { waLink } from "@/lib/schema";

// Slim trust bar above the header: NAP + hours + reviews, all from settings.
export default async function TopBar() {
  const { settings } = await getContent();
  const addr = settings.address || {};
  const addrLine = [addr.street, addr.city, addr.region, addr.postalCode].filter(Boolean).join(", ");
  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <a href={telHref} className="tb-item">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 14 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>
          {settings.phone}
        </a>
        <a href={`mailto:${settings.email}`} className="tb-item tb-hide-sm">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
          {settings.email}
        </a>
        {addrLine ? (
          <a href={settings.mapsUrl} target="_blank" rel="noopener" className="tb-item tb-hide-md">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
            {addrLine}
          </a>
        ) : null}
        <a href={waLink(settings)} target="_blank" rel="noopener" className="tb-item tb-right">
          <span className="tb-stars">★★★★★</span> {settings.aggregateRating.ratingValue} · {settings.aggregateRating.reviewCount} reviews
        </a>
      </div>
    </div>
  );
}
