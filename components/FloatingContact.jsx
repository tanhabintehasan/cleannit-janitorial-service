import { getContent } from "@/lib/content";
import { waLink } from "@/lib/schema";
import { PhoneIcon, WhatsAppIcon } from "./Header";

// Floating WhatsApp button + mobile sticky bar, both built entirely from the
// phone/WhatsApp number in settings (admin-editable, updates site-wide).
export default async function FloatingContact() {
  const { settings } = await getContent();
  const wa = waLink(settings);
  const telHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  return (
    <>
      <a className="wa-float" href={wa} target="_blank" rel="noopener" aria-label={`Chat with ${settings.businessName} on WhatsApp`}>
        <WhatsAppIcon />
      </a>
      <nav className="mobile-bar" aria-label="Quick contact">
        <a href={telHref}><PhoneIcon /> Call</a>
        <a className="mb-quote" href="/contact">Get Quote</a>
      </nav>
    </>
  );
}
