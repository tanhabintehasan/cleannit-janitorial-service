import Link from "next/link";
import { getContent } from "@/lib/content";

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 14 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>
  );
}

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.9C8.8 2.9 2.9 8.7 2.9 15.9c0 2.3.6 4.5 1.7 6.5L2.8 29.1l6.9-1.8c1.9 1 4 1.6 6.3 1.6 7.2 0 13.1-5.9 13.1-13.1S23.2 2.9 16 2.9zm0 23.8c-2 0-3.9-.5-5.6-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.8C5 9.8 10 4.9 16 4.9s11 4.1 11 10.9-4.9 10.9-11 10.9zm6-8.2c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.9-2.2-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6-.1-.2-.7-1.8-1-2.5-.3-.6-.5-.5-.7-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.5 4.9.8.3 1.4.5 1.8.7.8.2 1.5.2 2 .1.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4z"/></svg>
  );
}

export default function Header() {
  const { settings } = getContent();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.logo} alt={`${settings.businessName} logo`} width="133" height="52" />
        </Link>
        <input type="checkbox" id="nav-toggle" className="nav-toggle" aria-label="Toggle navigation" />
        <label htmlFor="nav-toggle" className="nav-toggle-label">☰</label>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/services">Services</Link>
          <Link href="/locations">Locations</Link>
          <Link href="/about">About</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="header-cta">
          <a className="btn btn-accent" href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>
            {settings.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
