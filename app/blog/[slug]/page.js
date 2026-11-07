import Image from "next/image";
import { notFound } from "next/navigation";
import { getContent, getPost } from "@/lib/content";
import { articleSchema, faqSchema, breadcrumbSchema, JsonLd } from "@/lib/schema";
import FAQ from "@/components/FAQ";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.metaDescription, alternates: { canonical: `/blog/${post.slug}` } };
}

export default async function BlogPostPage({ params }) {
  const content = await getContent();
  const post = await getPost(params.slug);
  if (!post) notFound();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }];

  return (
    <>
      <JsonLd data={[articleSchema(content, post), faqSchema(post.faqs), breadcrumbSchema(content.settings, crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <article>
        <section style={{ paddingTop: 24 }}>
          <div className="container reveal" style={{ maxWidth: 820 }}>
            <h1>{post.title}</h1>
            <p className="updated">Published {post.date} · Last updated: {post.updatedAt || post.date}</p>
            <p className="byline byline-dark">Written by the {content.settings.businessName} team · Reviewed by <b>{content.settings.founder}</b>, Founder &amp; CEO</p>
            <Image src={post.image.src} alt={post.image.alt} width={1200} height={800} priority
              sizes="(max-width: 900px) 100vw, 820px" style={{ width: "100%", height: "auto", borderRadius: 12 }} />
          </div>
        </section>
        <section style={{ paddingTop: 8 }}>
          <div className="container" style={{ maxWidth: 820 }}>
            {post.body.map((b, i) => (
              <div key={i}><h2>{b.h}</h2><p>{b.p}</p></div>
            ))}
          </div>
        </section>
        <section style={{ background: "#fff" }}>
          <div className="container" style={{ maxWidth: 820 }}>
            <h2>FAQ</h2>
            <FAQ faqs={post.faqs} />
          </div>
        </section>
        <section>
          <div className="container"><CtaBand /></div>
        </section>
      </article>
    </>
  );
}
