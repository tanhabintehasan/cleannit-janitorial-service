import Image from "next/image";
import QuoteForm from "./QuoteForm";

// Hero right column: compact gradient-headed quote card on top, image with a
// floating review chip below it.
export default function HeroPanel({ image, services, formTitle = "Schedule a Free Quote", chip, lockedService = null, hideForm = false }) {
  return (
    <div className="hero-panel">
      {!hideForm && <QuoteForm services={services} compact formTitle={formTitle} lockedService={lockedService} />}
      {image?.src && (
        <div className="hero-img-wrap">
          <Image
            className="hero-img"
            src={image.src}
            alt={image.alt}
            width={1200}
            height={514}
            loading="eager"
            sizes="(max-width: 900px) 100vw, 45vw"
          />
          {chip && (
            <div className="hero-chip">
              <span className="stars">★★★★★</span>
              <span>{chip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
