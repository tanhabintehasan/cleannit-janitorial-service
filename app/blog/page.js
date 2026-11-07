import Link from "next/link";
import Image from "next/image";
import { getContent } from "@/lib/content";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Cleaning Guides & Resources | Cleannit Janitorial Toronto",
    description: "Cleaning cost guides and expert resources for Toronto & GTA: commercial cleaning rates, post-construction cleaning costs, balcony & pigeon cleanup guides.",
    alternates: { canonical: "/blog" },
  };
}

export default function BlogPage() {
  const content = getContent();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }];
  return (
    <>
      <JsonLd data={breadcrumbSchema(content.settings, crumbs)} />
      <Breadcrumbs items={crumbs} />
      <section>
        <div className="container reveal">
          <h1>Cleaning Guides &amp; Resources</h1>
          <p style={{ maxWidth: 800 }}>Straight answers on pricing, process and best practices from the Cleannit team.</p>
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            {content.posts.map((post) => (
              <article className="card" key={post.slug}>
                <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
                  <Image src={post.image.src} alt={post.image.alt} width={600} height={400}
                    sizes="(max-width: 560px) 100vw, 33vw"
                    style={{ width: "100%", height: "auto", aspectRatio: "3/2", objectFit: "cover" }} />
                </Link>
                <div className="card-body">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link className="card-link" href={`/blog/${post.slug}`}>Read the guide</Link>
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
