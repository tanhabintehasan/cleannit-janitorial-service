// Scripted top-competitor extraction: word counts, structure, schema, forms, pricing transparency.
const clusters = {
  "home: cleaning services toronto": ["https://mcagroup.ca/", "https://impact.ca/", "https://smcleantoronto.ca/", "https://www.janitor.ca/", "https://www.generationscleaning.ca/"],
  "commercial-cleaning: commercial cleaning toronto": ["https://mcagroup.ca/", "https://impact.ca/", "https://smcleantoronto.ca/", "https://www.janitor.ca/", "https://www.coverall.com/locations/canada/toronto-support-center/commercial-cleaning-services-in-toronto--the-gta-for-offices-healthcare-tech--more/"],
  "janitorial: janitorial services toronto": ["https://www.janitor.ca/", "https://www.matrixservices.ca/", "https://www.generationscleaning.ca/commercial-cleaning/janitorial-services/", "https://focuscleaning.ca/", "https://zusashimaintenance.com/office-cleaning-cost"],
  "power-washing: power washing toronto": ["https://silverlightwindowsandeaves.ca/pressure-washing-toronto/", "https://dtcleaning.ca/power-washing-cost-toronto/", "https://outwash.ca/blogs/pressure-washing-cost-in-toronto-residential-and-commercial-rates/", "https://www.shackshine.com/locations/toronto/power-washing/", "https://nickswindowcleaning.ca/power-washing-toronto/"],
  "window-cleaning: window cleaning toronto": ["https://dtcleaning.ca/window-cleaning-toronto-prices/", "https://silverlightwindowsandeaves.ca/", "https://ntpropertycare.com/winow-cleaning-cost-in-toronto/", "https://www.homestars.com/cleaning/price-guides/window-cleaning-cost"],
  "balcony-cleaning: balcony cleaning toronto": ["https://balconycleaners.com/balcony-cleaning/toronto/", "https://happybalconies.ca/", "https://balconyguys.ca/", "https://balconycleaningtoronto.ca/", "https://nowitsclean.ca/blog/clean-balcony-of-condo-in-toronto/"],
  "post-construction: post construction cleaning toronto": ["https://tidyuphandycrew.ca/2026/02/25/post-construction-cleaning-cost-in-toronto/", "https://www.sparkleandscrubcleaners.com/post/how-much-does-professional-post-construction-cleaning-cost-in-toronto-the-gta", "https://www.homestars.com/demolition-disposal/price-guides/post-construction-clean-up-cost", "https://profoundcleaning.ca/blog/commercial-cleaning-cost-toronto/"],
  "bird-netting: bird netting installation toronto": ["https://www.hawkeye.ca/toronto-pest-bird-balcony-netting", "https://vprstoronto.com/", "https://pigeontom.ca/", "https://iconbird.ca/educational/balcony-netting/"],
  "office-cleaning: office cleaning toronto": ["https://torontoofficecleaningservices.com/", "https://mcagroup.ca/", "https://smcleantoronto.ca/", "https://focuscleaning.ca/", "https://www.janitor.ca/"],
  "house-cleaning: house cleaning toronto": ["https://hellamaid.ca/house-cleaning-service-toronto/", "https://nomorechores.com/regular-house-cleaning-cost-toronto/", "https://meshmaids.ca/blog/how-much-house-cleaning-cost-in-toronto/", "https://nowitsclean.ca/blog/house-cleaner-cost-in-toronto/", "https://20dollarclean.ca/"],
  "move-out: move out cleaning toronto": ["https://tidyuphandycrew.ca/2026/02/23/what-affects-move-out-cleaning-cost-in-toronto/", "https://hellamaid.ca/house-cleaning-service-toronto/", "https://meshmaids.ca/blog/how-much-house-cleaning-cost-in-toronto/"],
  "carpet: carpet cleaning toronto": ["https://primecarpetcleaning.ca/", "https://torontosteamcleaning.ca/toronto-professional-carpet-cleaning/", "https://carpetsteam.ca/prices/", "https://www.itsglocleaning.com/post/carpet-cleaning-costs-in-toronto-how-much-you-should-expect-to-pay-2026-guide", "https://torontoupholsterycleaning.com/prices/"],
  "painting: painting services toronto": ["https://gtapaint.com/painting-services/interior-painting", "https://richbydesigninc.com/service/painting/", "https://certapro.com/etobicoke/interior-house-painting-pricing-guide/", "https://thepickypainters.com/interior-painting-cost-menu/", "https://www.absolutehomeservices.ca/blog/the-cost-of-painting-a-house-in-toronto-average-prices-factors-that-affect-them"],
  "location (sample): cleaning services brampton": ["https://skyrexpropertyservices.ca/locations/brampton/", "https://smcleanbrampton.ca/", "https://supremecleaninggroup.com/cleaning-service-brampton/", "https://spotlessjanitorial.ca/office-cleaning/", "https://www.arellicleaning.com/locations/brampton"],
  "location (sample): commercial cleaning mississauga": ["https://smcleanmississauga.ca/", "https://impact.ca/ontario/mississauga", "https://www.stratusclean.com/locations/mississauga/", "https://skyrexpropertyservices.ca/locations/mississauga/", "https://www.mississaugacommercialcleaning.ca/"],
};

const lines = ["# RESEARCH v4 — SCRIPTED COMPETITOR BENCHMARKS", "", "Extraction method: live HTTP fetch of each ranking URL, HTML stripped, words counted; H2/H3/img/form/FAQ-schema/review-schema/pricing-mention detected programmatically.", ""];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const [cluster, urls] of Object.entries(clusters)) {
  lines.push(`\n## ${cluster}\n`);
  lines.push("| Competitor | Words | H2 | H3 | Imgs | Form | FAQ schema | Reviews schema | Prices shown |");
  lines.push("|---|---|---|---|---|---|---|---|---|");
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126" }, signal: AbortSignal.timeout(20000) });
      const html = await r.text();
      const text = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ");
      const words = text.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w)).length;
      const h2 = (html.match(/<h2[\s>]/gi) || []).length;
      const h3 = (html.match(/<h3[\s>]/gi) || []).length;
      const imgs = (html.match(/<img[\s>]/gi) || []).length;
      const form = /<form[\s>]/i.test(html) ? "✓" : "—";
      const faq = /FAQPage/.test(html) ? "✓" : "—";
      const rev = /aggregateRating|reviewCount/i.test(html) ? "✓" : "—";
      const price = /\$\d+/.test(text) ? "✓" : "—";
      lines.push(`| ${new URL(url).hostname} | ${words} | ${h2} | ${h3} | ${imgs} | ${form} | ${faq} | ${rev} | ${price} |`);
    } catch (e) {
      lines.push(`| ${new URL(url).hostname} | FETCH-FAIL | | | | | | | |`);
    }
    await sleep(1200);
  }
}

import fs from "fs";
fs.writeFileSync("docs/research-v4-competitor-benchmarks.md", lines.join("\n"));
console.log("written docs/research-v4-competitor-benchmarks.md");
