import "./globals.css";
import { getContent } from "@/lib/content";
import { organizationSchema, localBusinessSchema, JsonLd } from "@/lib/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { settings } = await getContent();
  return {
    metadataBase: new URL(settings.domain),
    title: { default: settings.pages?.home?.title || settings.businessName, template: `%s` },
    description: settings.pages?.home?.metaDescription,
    icons: { icon: settings.favicon || "/images/logo.svg" },
    openGraph: { siteName: settings.businessName, type: "website" },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }) {
  const content = await getContent();
  return (
    <html lang="en-CA">
      <body>
        <JsonLd data={[organizationSchema(content), localBusinessSchema(content)]} />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingContact />
        <Reveal />
      </body>
    </html>
  );
}
