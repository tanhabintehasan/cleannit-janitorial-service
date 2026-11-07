// Decorative hero layers: background photo, second glow orb, SVG wave divider.
export default function HeroDecor() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-bg-img"
        src="/images/hero-bg-cleaning-toronto.webp"
        alt=""
        width="900"
        height="600"
        fetchPriority="high"
        loading="eager"
        aria-hidden="true"
      />
      <div className="hero-orb-2" aria-hidden="true" />
      <svg className="hero-wave" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0,32 C360,72 1080,-8 1440,28 L1440,64 L0,64 Z" fill="#ffffff" />
      </svg>
    </>
  );
}
