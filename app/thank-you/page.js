import Link from "next/link";
import { getContent } from "@/lib/content";
import { waLink } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Thank You | Cleannit Janitorial Services",
  robots: { index: false },
};

export default function ThankYouPage() {
  const { settings } = getContent();
  return (
    <section>
      <div className="container" style={{ maxWidth: 640, textAlign: "center", padding: "80px 20px" }}>
        <h1>Thank You — Your Request Is In</h1>
        <p>A {settings.businessName} specialist will respond the same business day. Need us sooner?</p>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <a className="btn btn-accent" href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>Call {settings.phone}</a>
          <a className="btn btn-primary" href={waLink(settings)} target="_blank" rel="noopener">WhatsApp Us Now</a>
        </div>
        <p style={{ marginTop: 28 }}><Link href="/">← Back to homepage</Link></p>
      </div>
    </section>
  );
}
