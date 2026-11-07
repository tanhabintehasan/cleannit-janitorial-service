import { getContent } from "@/lib/content";

export default async function StatsBand() {
  const { settings } = await getContent();
  const reviews = settings.aggregateRating?.reviewCount;
  const rating = settings.aggregateRating?.ratingValue;
  return (
    <div className="stats-band">
      <div className="container stats-grid reveal">
        <div className="stat"><div className="num">Since <em>{settings.foundedYear}</em></div><div className="lbl">Founded in Toronto</div></div>
        <div className="stat"><div className="num"><em>{rating}★</em> · {reviews}</div><div className="lbl">Client Reviews</div></div>
        <div className="stat"><div className="num">Lic. <em>#{settings.license}</em></div><div className="lbl">Licensed &amp; Insured</div></div>
        <div className="stat"><div className="num">GTA<em>-wide</em></div><div className="lbl">{settings.serviceArea.length} Service Areas</div></div>
      </div>
    </div>
  );
}
