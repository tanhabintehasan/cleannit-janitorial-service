import Link from "next/link";
import Image from "next/image";

export default function ServiceCard({ service, location }) {
  const href = `/services/${service.slug}`;
  return (
    <article className="card">
      <Link href={href} tabIndex={-1} className="card-img" style={{ display: "block", overflow: "hidden" }}>
        <Image
          src={service.cardImage.src}
          alt={service.cardImage.alt}
          width={600}
          height={400}
          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
          style={{ width: "100%", height: "auto", aspectRatio: "3/2", objectFit: "cover" }}
        />
      </Link>
      <div className="card-body">
        <h3>{service.name}{location ? ` in ${location}` : ""}</h3>
        <p>{service.shortDesc}</p>
        <Link className="card-link" href={href}>
          Learn more about {service.name.toLowerCase()}{location ? ` in ${location}` : ""}
        </Link>
      </div>
    </article>
  );
}
