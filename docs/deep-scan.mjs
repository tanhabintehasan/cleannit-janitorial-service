// DEEP SCAN — browser-level (headless Chrome via CDP, no deps).
// Renders every page like a real browser (JS executed), then measures:
// rendered word count, H1, H2/H3 structure, images, forms, schema types, pricing.
import { spawn } from "child_process";
import fs from "fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9223;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const OURS = "http://localhost:3000";

const clusters = [
  { key: "home", ours: "/", competitors: ["https://mcagroup.ca/", "https://impact.ca/", "https://smcleantoronto.ca/", "https://www.janitor.ca/", "https://www.generationscleaning.ca/"] },
  { key: "commercial-cleaning", ours: "/services/commercial-cleaning", competitors: ["https://mcagroup.ca/", "https://impact.ca/", "https://smcleantoronto.ca/", "https://www.janitor.ca/", "https://www.coverall.com/locations/canada/toronto-support-center/commercial-cleaning-services-in-toronto--the-gta-for-offices-healthcare-tech--more/"] },
  { key: "janitorial-services", ours: "/services/janitorial-services", competitors: ["https://www.janitor.ca/", "https://www.matrixservices.ca/", "https://www.generationscleaning.ca/commercial-cleaning/janitorial-services/", "https://focuscleaning.ca/", "https://zusashimaintenance.com/office-cleaning-cost"] },
  { key: "power-washing", ours: "/services/power-washing", competitors: ["https://silverlightwindowsandeaves.ca/pressure-washing-toronto/", "https://dtcleaning.ca/power-washing-cost-toronto/", "https://outwash.ca/blogs/pressure-washing-cost-in-toronto-residential-and-commercial-rates/", "https://www.shackshine.com/locations/toronto/power-washing/", "https://nickswindowcleaning.ca/power-washing-toronto/"] },
  { key: "window-cleaning", ours: "/services/window-cleaning", competitors: ["https://dtcleaning.ca/window-cleaning-toronto-prices/", "https://silverlightwindowsandeaves.ca/", "https://ntpropertycare.com/winow-cleaning-cost-in-toronto/", "https://www.homestars.com/cleaning/price-guides/window-cleaning-cost", "https://dswindowcleaning.ca/"] },
  { key: "balcony-cleaning", ours: "/services/balcony-cleaning", competitors: ["https://balconycleaners.com/balcony-cleaning/toronto/", "https://happybalconies.ca/", "https://balconyguys.ca/", "https://balconycleaningtoronto.ca/", "https://nowitsclean.ca/blog/clean-balcony-of-condo-in-toronto/"] },
  { key: "post-construction-cleaning", ours: "/services/post-construction-cleaning", competitors: ["https://tidyuphandycrew.ca/2026/02/25/post-construction-cleaning-cost-in-toronto/", "https://www.sparkleandscrubcleaners.com/post/how-much-does-professional-post-construction-cleaning-cost-in-toronto-the-gta", "https://www.homestars.com/demolition-disposal/price-guides/post-construction-clean-up-cost", "https://profoundcleaning.ca/blog/commercial-cleaning-cost-toronto/", "https://crjanitorialservices.ca/"] },
  { key: "bird-netting", ours: "/services/bird-netting", competitors: ["https://www.hawkeye.ca/toronto-pest-bird-balcony-netting", "https://vprstoronto.com/", "https://pigeontom.ca/", "https://iconbird.ca/educational/balcony-netting/", "https://www.hawkeye.ca/toronto-bird-control-services/bird-control-cleaning-disinfecting"] },
  { key: "office-cleaning", ours: "/services/office-cleaning", competitors: ["https://torontoofficecleaningservices.com/", "https://mcagroup.ca/", "https://smcleantoronto.ca/", "https://focuscleaning.ca/", "https://www.janitor.ca/"] },
  { key: "house-cleaning", ours: "/services/house-cleaning", competitors: ["https://hellamaid.ca/house-cleaning-service-toronto/", "https://nomorechores.com/regular-house-cleaning-cost-toronto/", "https://meshmaids.ca/blog/how-much-house-cleaning-cost-in-toronto/", "https://nowitsclean.ca/blog/house-cleaner-cost-in-toronto/", "https://20dollarclean.ca/"] },
  { key: "move-out-cleaning", ours: "/services/move-out-cleaning", competitors: ["https://tidyuphandycrew.ca/2026/02/23/what-affects-move-out-cleaning-cost-in-toronto/", "https://hellamaid.ca/house-cleaning-service-toronto/", "https://meshmaids.ca/blog/how-much-house-cleaning-cost-in-toronto/", "https://nowitsclean.ca/blog/house-cleaner-cost-in-toronto/"] },
  { key: "carpet-cleaning", ours: "/services/carpet-cleaning", competitors: ["https://primecarpetcleaning.ca/", "https://torontosteamcleaning.ca/toronto-professional-carpet-cleaning/", "https://carpetsteam.ca/prices/", "https://www.itsglocleaning.com/post/carpet-cleaning-costs-in-toronto-how-much-you-should-expect-to-pay-2026-guide", "https://torontoupholsterycleaning.com/prices/"] },
  { key: "painting-services", ours: "/services/painting-services", competitors: ["https://gtapaint.com/painting-services/interior-painting", "https://richbydesigninc.com/service/painting/", "https://certapro.com/etobicoke/interior-house-painting-pricing-guide/", "https://thepickypainters.com/interior-painting-cost-menu/", "https://www.absolutehomeservices.ca/blog/the-cost-of-painting-a-house-in-toronto-average-prices-factors-that-affect-them"] },
  { key: "location-page (sample)", ours: "/locations/mississauga", competitors: ["https://skyrexpropertyservices.ca/locations/mississauga/", "https://smcleanmississauga.ca/", "https://impact.ca/ontario/mississauga", "https://www.stratusclean.com/locations/mississauga/", "https://www.mississaugacommercialcleaning.ca/"] },
  { key: "location-service (sample)", ours: "/locations/mississauga/office-cleaning", competitors: ["https://skyrexpropertyservices.ca/locations/mississauga/", "https://jan-pro.ca/en/office/commercial-cleaning-mississauga/", "https://impact.ca/ontario/mississauga", "https://smcleanmississauga.ca/"] },
];

const EXTRACT = `(() => {
  const body = document.body.innerText || "";
  const words = body.split(/\\s+/).filter(w => /[a-zA-Z]/.test(w)).length;
  const h1 = [...document.querySelectorAll("h1")].map(h => h.innerText.trim().slice(0, 80));
  const h2 = document.querySelectorAll("h2").length;
  const h3 = document.querySelectorAll("h3").length;
  const imgs = document.querySelectorAll("img").length;
  const forms = document.querySelectorAll("form").length;
  const schemaTypes = [...new Set([...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(s => { try { const j = JSON.parse(s.textContent); const arr = Array.isArray(j) ? j : [j]; return arr.map(x => x["@type"]); } catch { return []; } }))];
  const price = /\\$\\s?\\d/.test(body);
  const faq = document.querySelectorAll("details, .faq-item, [class*='faq']").length > 0;
  return JSON.stringify({ words, h1: h1.slice(0, 2), h2, h3, imgs, forms, schemaTypes, price, faq });
})()`;

const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${PORT}`, "about:blank"], { stdio: "ignore" });
await sleep(2500);

async function scan(url) {
  const targets = await (await fetch(`http://localhost:${PORT}/json`)).json();
  let page = targets.find((t) => t.type === "page" && t.url === "about:blank");
  if (!page) {
    await fetch(`http://localhost:${PORT}/json/new?about:blank`, { method: "PUT" }).catch(() => {});
    const t2 = await (await fetch(`http://localhost:${PORT}/json`)).json();
    page = t2.find((t) => t.type === "page" && t.url === "about:blank");
  }
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (m, p = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
  await send("Emulation.setDeviceMetricsOverride", { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.enable");
  await send("Page.navigate", { url });
  await sleep(4200);
  const res = await send("Runtime.evaluate", { expression: EXTRACT, returnByValue: true });
  ws.close();
  return JSON.parse(res.result.value);
}

const report = ["# DEEP SCAN — browser-level competitor & self analysis", "", `Scanned with headless Chrome (JS rendered) — ${new Date().toISOString().slice(0, 10)}`, ""];
const summary = [];

for (const c of clusters) {
  report.push(`\n## ${c.key}\n`);
  report.push("| Page | Words | H2 | H3 | Imgs | Forms | FAQ | Prices | Schema types |");
  report.push("|---|---|---|---|---|---|---|---|---|");
  let ours = null;
  try {
    ours = await scan(OURS + c.ours);
    report.push(`| **OURS** ${c.ours} | **${ours.words}** | ${ours.h2} | ${ours.h3} | ${ours.imgs} | ${ours.forms} | ${ours.faq ? "✓" : "—"} | ${ours.price ? "✓" : "—"} | ${ours.schemaTypes.slice(0, 5).join(", ")} |`);
  } catch (e) {
    report.push(`| **OURS** ${c.ours} | SCAN-FAIL | | | | | | | |`);
  }
  const compWords = [];
  for (const u of c.competitors) {
    try {
      const r = await scan(u);
      compWords.push(r.words);
      report.push(`| ${new URL(u).hostname} | ${r.words} | ${r.h2} | ${r.h3} | ${r.imgs} | ${r.forms} | ${r.faq ? "✓" : "—"} | ${r.price ? "✓" : "—"} | ${r.schemaTypes.slice(0, 3).join(", ") || "—"} |`);
    } catch (e) {
      report.push(`| ${new URL(u).hostname} | SCAN-FAIL | | | | | | | |`);
    }
    await sleep(600);
  }
  if (ours && compWords.length) {
    const avg = Math.round(compWords.reduce((a, b) => a + b, 0) / compWords.length);
    const max = Math.max(...compWords);
    summary.push({ key: c.key, ours: ours.words, compAvg: avg, compMax: max, oursForms: ours.forms, oursFaq: ours.faq, oursPrice: ours.price });
    report.push(`\n**Word benchmark:** ours ${ours.words} · competitor avg ${avg} · top ${max} → ${ours.words >= avg ? "✅ at/above average" : "⚠️ below average"}`);
  }
  await sleep(800);
}

report.push(`\n\n# SUMMARY — ours vs competitors\n`);
report.push("| Page | Our words | Competitor avg | Competitor top | Verdict |");
report.push("|---|---|---|---|---|");
for (const s of summary) {
  report.push(`| ${s.key} | ${s.ours} | ${s.compAvg} | ${s.compMax} | ${s.ours >= s.compAvg ? "✅ above avg" : "⚠️ below avg"} |`);
}

fs.writeFileSync("docs/deep-scan-report.md", report.join("\n"));
console.log(JSON.stringify(summary, null, 1));
chrome.kill();
