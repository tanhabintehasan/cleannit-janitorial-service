// Composes unique, location-specific content for every location×service page.
// Data-driven template system: per-service local angles + per-location details
// combine into non-duplicated local pages.

export const priceTables = {
  "commercial-cleaning": [
    ["Hourly rate (one-time/deep)", "$35–$65 per hour"],
    ["Recurring program", "$0.08–$0.25 per sq ft / visit"],
    ["Small office monthly", "$350–$1,000 / month"],
    ["Day porter service", "Quoted by hours"],
  ],
  "janitorial-services": [
    ["Hourly rate", "$30–$50 per hour"],
    ["Monthly program", "$0.08–$0.20 per sq ft"],
    ["Small office monthly", "$350–$1,000 / month"],
    ["Washroom consumables", "Managed add-on"],
  ],
  "power-washing": [
    ["Driveway", "$200–$450"],
    ["House exterior", "$400–$900"],
    ["Walkways / flatwork", "$0.30–$0.70 per sq ft"],
    ["Commercial site", "Quoted by scope"],
  ],
  "window-cleaning": [
    ["Bungalow exterior", "from $130"],
    ["Two-storey exterior", "from $170"],
    ["Three-storey exterior", "from $210"],
    ["Interior + exterior", "approx. 2× exterior rate"],
  ],
  "balcony-cleaning": [
    ["Full Balcony Cleaning (door, windows, handrails, floor, walls, disinfecting)", "$250 CAD"],
    ["Floor-Only Cleaning (floor, nest & poop removal, disinfecting)", "$170 CAD"],
    ["Garbage removal (if required)", "+$50 CAD"],
    ["Furniture cleaning (if required)", "+$20 CAD"],
  ],
  "post-construction-cleaning": [
    ["Per square foot", "$0.15–$0.50"],
    ["Per cleaner", "$40–$60 per hour"],
    ["Condo renovation", "$300–$600"],
    ["Custom home", "$800–$2,500"],
  ],
  "balcony-netting": [
    ["Economy package — materials & installation", "from $200 CAD"],
    ["Standard package — materials & installation", "from $350 CAD"],
    ["Special / non-standard balconies", "Custom on-site quote"],
    ["Instant online estimate", "Take the on-page quiz"],
  ],
  "office-cleaning": [
    ["Hourly rate", "$30–$50 per hour"],
    ["Recurring program", "$0.08–$0.20 per sq ft"],
    ["Small office monthly", "$350–$1,000 / month"],
  ],
  "house-cleaning": [
    ["Hourly rate", "$35–$70 per hour"],
    ["Condo / small home", "$130–$250 flat"],
    ["Deep clean", "$250–$400+"],
    ["Recurring visits", "Discounted per visit"],
  ],
  "move-out-cleaning": [
    ["1–2 bedroom condo", "$300–$450"],
    ["Townhome / house", "$400–$700+"],
    ["Add interior windows", "from $80"],
  ],
  "carpet-cleaning": [
    ["Per room", "$55–$150"],
    ["Staircase (up to 14)", "from $75"],
    ["Per square foot (large areas)", "$0.25–$0.50"],
    ["Area rug", "$60–$160"],
  ],
  "painting-services": [
    ["Per room (labour + standard paint)", "$400–$800"],
    ["Per sq ft of floor area", "$2–$4"],
    ["Full condo repaint", "$1,500–$3,500"],
  ],
};

// Per-service local demand angle — combined with each location's own copy.
export const serviceLocalAngles = {
  "commercial-cleaning": "Commercial properties here range from professional offices to busy retail plazas, and each needs a cleaning program that never disrupts business hours.",
  "janitorial-services": "Buildings here depend on consistent nightly janitorial work — lobbies, washrooms and corridors that look identical every single morning.",
  "power-washing": "Winters are hard on exterior surfaces here — salt, slush and grime build up fast, and spring power washing is the reset every property needs.",
  "window-cleaning": "Between spring pollen, construction dust and winter salt spray, glass here needs scheduled professional attention to stay clear.",
  "balcony-cleaning": "Condo and apartment balconies here collect city grime and pigeon mess fast — and board rules mean residents can't just hose them down.",
  "post-construction-cleaning": "With constant renovations and new builds underway here, turnover-ready post-construction cleaning is in steady demand.",
  "balcony-netting": "Condo and apartment balconies here are prime pigeon territory — discreet, custom-fit netting installed after a full cleanup is the permanent, board-friendly fix.",
  "office-cleaning": "Local offices compete for talent and clients — a consistently clean workplace every morning is part of that edge.",
  "house-cleaning": "Busy households here trade weekends for family time — recurring professional house cleaning buys that time back.",
  "move-out-cleaning": "With an active rental and resale market here, deposit-ready move-out cleans are constantly in demand.",
  "carpet-cleaning": "Salt, slush and daily traffic grind soil into carpets here all winter — hot-water extraction restores them.",
  "painting-services": "From condo refreshes to office repaints, interior painting here pairs naturally with move-ins, move-outs and post-renovation work.",
};

export function buildLocalServiceContent(location, service) {
  const city = location.name;
  const landmarkList = location.landmarks.slice(0, 3).join(", ");
  const kw = `${service.name.toLowerCase()} ${city.toLowerCase()}`;
  const firstLandmark = location.landmarks[0] || city;

  return {
    title: `${service.name} ${city} | Cleannit Janitorial Services`.slice(0, 60),
    metaDescription: `${service.name} in ${city}: licensed, insured crews since 2020 · 139 reviews · free quotes. Call +1 437-288-7140 or book online today.`.slice(0, 160),
    h1: `${service.name} in ${city}`,
    keyword: kw,
    intro: `Looking for reliable ${service.name.toLowerCase()} in ${city}? Cleannit Janitorial Services delivers professional ${service.name.toLowerCase()} across ${city} — from ${firstLandmark} to every neighbourhood in between. ${serviceLocalAngles[service.slug]} As a licensed firm (Licence #736686338) trusted since 2020 with 139 client reviews, our insured, uniformed crews bring the same founder-led quality system to ${city} that GTA clients rate so highly. ${service.shortDesc.replace(/ in Toronto/i, ` in ${city}`)}`,
    localNote: `${location.local} For ${service.name.toLowerCase()} in ${city} specifically, we schedule around your building rules, parking and access — whether that's a condo near ${firstLandmark} or a commercial unit elsewhere in ${city}.`,
    includesHeading: `What's Included in Our ${city} ${service.name}`,
    benefitsHeading: `Why ${city} Chooses Cleannit for ${service.name}`,
    faqs: [
      { q: `How much does ${service.name.toLowerCase()} cost in ${city}?`, a: `${service.pricing.p} Every ${city} quote is fixed in writing before work begins — no hidden charges.` },
      { q: `How fast can you schedule ${service.name.toLowerCase()} in ${city}?`, a: `Quotes are answered the same business day, and most ${city} bookings start within 2–5 business days. Rush slots are available for move-outs and handovers.` },
      { q: `Are your ${city} crews insured and background-checked?`, a: `Yes — every Cleannit crew member working in ${city} is insured, uniformed and background-checked, arriving in branded vehicles under Business Licence #736686338.` },
      { q: `Which parts of ${city} do you cover?`, a: `${location.local} If you're anywhere in or around ${city}, we've got you covered.` },
      { q: `Can I bundle ${service.name.toLowerCase()} with other services in ${city}?`, a: `Yes — ${city} clients often bundle services in one visit for better pricing. Ask about bundles when you call +1 437-288-7140.` },
      { q: `Why choose Cleannit for ${service.name.toLowerCase()} in ${city}?`, a: `Licensed since 2020, 139 client reviews, founder-led quality audits, written quotes and a satisfaction promise — if anything falls short of the checklist, we return and re-clean it.` },
    ],
  };
}
