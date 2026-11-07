import { getContent } from "@/lib/content";

export default async function CtaBand({ heading, text }) {
  const { settings } = await getContent();
  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  return (
    <div className="cta-band">
      <h2>{heading || "Get Your Free Cleaning Quote Today"}</h2>
      <p>{text || `Call ${settings.phone} or send us a message — a ${settings.businessName} specialist responds the same business day.`}</p>
      <div className="hero-actions">
        <a className="btn btn-accent" href={telHref}>Call {settings.phone}</a>
        <a className="btn btn-outline" href="/contact">Request a Free Quote</a>
      </div>
    </div>
  );
}
