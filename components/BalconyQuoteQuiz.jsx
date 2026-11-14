"use client";

import { useState } from "react";
import Image from "next/image";

// Instant balcony quote quiz — prices in CAD.
// mode "balcony-netting": netting packages — Economy from $200, Standard from $350
//   (materials + installation), complexity can push to a custom on-site quote.
// mode "balcony-cleaning": cleaning packages —
//   Full Balcony Cleaning $250 (door, windows, handrails, floor, walls, disinfecting)
//   Floor-Only Cleaning $170 (floor, nest & poop removal, disinfecting)
//   Add-ons: garbage removal $50, furniture cleaning $20.

const IMG = "/images/balcony-quiz";

const NETTING_QUESTIONS = [
  {
    key: "shape",
    q: "What shape/style/type is your balcony?",
    options: [
      { v: "flush", pts: 0, img: `${IMG}/q1-flush.jpg`, label: "Flush Style.", desc: "Balcony is recessed into the building, and the railing is flush with the side of the building (with full walls on the left and right sides)." },
      { v: "flush-open", pts: 10, img: `${IMG}/q1-flush-shared.jpg`, label: "Flush Style Open Sides.", desc: "This balcony is recessed but one or more of the sides might be open — common on corners or shared balconies with a divider." },
      { v: "protruding", pts: 10, img: `${IMG}/q1-protruding.jpg`, label: "Protruding Style.", desc: "Balcony sticks out from the side of the building and the railing makes turns." },
      { v: "special", pts: 101, img: `${IMG}/q1-shape.jpg`, label: "Special Shape or Size.", desc: "A curved shape or other unique design — double-tiered balconies, penthouses or high ceilings (anything higher than 10 feet)." },
    ],
  },
  {
    key: "railing",
    q: "What kind of railing is on your balcony?",
    options: [
      { v: "solid", pts: 1, img: `${IMG}/q2-solid.jpg`, label: "Full solid railing — No Gap.", desc: "A solid wall that goes right to the floor, often made of concrete, metal, or glass sheets." },
      { v: "solid-gap", pts: 1, img: `${IMG}/q2-solid-gap.jpg`, label: "Full solid railing — With Gap.", desc: "Same as above but this railing has a small space/gap at the bottom near the floor where birds could potentially get through." },
      { v: "open", pts: 2, img: `${IMG}/q2-railing.jpg`, label: "Open Railing / Bars.", desc: "Made of individual horizontal or vertical bars that have space between them." },
    ],
  },
  {
    key: "cleaning",
    q: "Does your balcony require cleaning / clearing out?",
    options: [
      { v: "no", pts: 0, img: `${IMG}/q3-clean.jpg`, label: "Nope!", desc: "It is clean, there are no bird droppings or nests anywhere and I will move the furniture out of the way before you arrive." },
      { v: "yes", pts: 40, img: `${IMG}/q3-dirty.jpg`, label: "Yes, it is messy and needs cleaning.", desc: "I have to have it cleaned BEFORE the netting is installed — we can handle the cleanup and sanitization for you." },
    ],
  },
  {
    key: "ceiling",
    q: "Is there a ceiling above your balcony?",
    options: [
      { v: "yes", pts: 0, img: `${IMG}/q4-cover.jpg`, label: "Yes there is a ceiling above.", desc: "There is a ceiling above when standing on the balcony that is not higher than 105 inches." },
      { v: "no", pts: 101, img: `${IMG}/q4-open.jpg`, label: "Nope, nothing above.", desc: "No ceiling above the balcony — all exposed & open air above." },
    ],
  },
  {
    key: "wall",
    q: "What material is the wall around it made out of?",
    options: [
      { v: "concrete", pts: 0, img: `${IMG}/q5-concrete.jpg`, label: "Concrete.", desc: "Good ol' rock. Nothing beats that!" },
      { v: "metal", pts: 0, img: `${IMG}/q5-metal.jpg`, label: "Metal.", desc: "Ooohhh shiny!" },
      { v: "brick", pts: 0, img: `${IMG}/q5-brick.jpg`, label: "Brick.", desc: "Classic masonry — anchors hold great." },
      { v: "stucco", pts: 101, img: `${IMG}/q5-stucco.jpg`, label: "Stucco.", desc: "Used all over the world for hundreds of years." },
      { v: "wood", pts: 0, img: `${IMG}/q5-wood.jpg`, label: "Wood.", desc: "Makes it easy to knock on wood!" },
      { v: "drywall", pts: 101, img: `${IMG}/q5-drywall.jpg`, label: "Drywall.", desc: "Needs special mounting — standard hardware won't hold." },
    ],
  },
  {
    key: "outlet",
    q: "Is there access to an electrical outlet close to the balcony?",
    options: [
      { v: "yes", pts: 0, img: `${IMG}/q6-power.jpg`, label: "Yes, there is access to power.", desc: "There is an electrical outlet on the balcony or on the inside of the apartment (we can bring an extension cord or cordless tools)." },
      { v: "no", pts: 101, img: `${IMG}/q6-nopower.jpg`, label: "No plugs and no access to electricity nearby.", desc: "Unfortunately there is nothing close to the balcony, or the power is off — we'll have to bring cordless tools." },
    ],
  },
];

const CLEANING_QUESTIONS = [
  {
    key: "package",
    q: "Which cleaning package do you need?",
    options: [
      { v: "full", base: 250, img: "/images/cleaning-service-care-toronto-gta.webp", label: "Full Balcony Cleaning — $250.", desc: "Door, windows, handrails, floor, walls and full disinfecting — the complete reset." },
      { v: "floor", base: 170, img: `${IMG}/q3-clean.jpg`, label: "Floor-Only Cleaning — $170.", desc: "Floor cleaning only, with nest & poop removal and disinfecting included." },
    ],
  },
  {
    key: "condition",
    q: "How dirty is your balcony right now?",
    options: [
      { v: "light", pts: 0, img: `${IMG}/q3-clean.jpg`, label: "Light dust & pollen.", desc: "Mostly surface dust, pollen and cobwebs — no droppings or stains." },
      { v: "moderate", pts: 0, img: "/images/condo-balcony-cleaning-toronto.webp", label: "Moderate grime & stains.", desc: "Built-up city grime, pollution film, drink or rust stains that need scrubbing." },
      { v: "heavy", pts: 0, img: `${IMG}/q3-dirty.jpg`, label: "Heavy — pigeon droppings / nests.", desc: "Bird droppings, nesting material or heavy soiling — sanitization is included in your package." },
    ],
  },
  {
    key: "furniture",
    q: "Is there furniture or clutter on the balcony?",
    options: [
      { v: "none", pts: 0, img: `${IMG}/q4-open.jpg`, label: "Empty or almost empty.", desc: "Nothing (or almost nothing) on the balcony — we can start right away." },
      { v: "few", pts: 20, img: `${IMG}/q1-flush.jpg`, label: "Some furniture to clean.", desc: "Furniture cleaning add-on: +$20 — we clean and reset chairs, tables and planters." },
      { v: "lots", pts: 70, img: `${IMG}/q1-protruding.jpg`, label: "Furniture + garbage to remove.", desc: "Furniture cleaning +$20 and garbage removal +$50 — we clear it, clean it and haul it out." },
    ],
  },
  {
    key: "floor",
    q: "What kind of floor does your balcony have?",
    options: [
      { v: "concrete", pts: 0, img: `${IMG}/q5-concrete.jpg`, label: "Concrete.", desc: "Standard poured concrete balcony floor." },
      { v: "tiles", pts: 0, img: `${IMG}/q5-wood.jpg`, label: "Interlocking deck tiles.", desc: "Wood or composite snap-in tiles — we lift, clean under and reset them." },
      { v: "other", pts: 0, img: `${IMG}/q5-brick.jpg`, label: "Other / not sure.", desc: "Tile, membrane, astro-turf or a mix — we'll assess on arrival." },
    ],
  },
  {
    key: "size",
    q: "How big is your balcony?",
    options: [
      { v: "small", pts: 0, img: `${IMG}/q1-shape.jpg`, label: "Small / Juliette.", desc: "A compact balcony or juliette-style — just enough room to step out." },
      { v: "standard", pts: 0, img: `${IMG}/q1-flush.jpg`, label: "Standard condo balcony.", desc: "A typical condo or apartment balcony with room for a couple of chairs." },
      { v: "large", pts: 0, img: `${IMG}/q1-flush-shared.jpg`, label: "Large / terrace / L-shaped.", desc: "A big terrace, wraparound or L-shaped balcony — final price confirmed by quote." },
    ],
  },
  {
    key: "frequency",
    q: "Is this a one-time clean or recurring?",
    options: [
      { v: "once", pts: 0, img: "/images/cleaning-service-care-toronto-gta.webp", label: "One-time deep clean.", desc: "A single full reset — most popular for spring opening or move-ins." },
      { v: "seasonal", pts: 0, img: "/images/sanitizing-surfaces-professional-cleaning-toronto.webp", label: "Seasonal (spring / fall).", desc: "Twice a year: spring opening and fall closing before winter storage." },
      { v: "recurring", pts: 0, img: "/images/professional-cleaning-supplies-toronto.webp", label: "Recurring schedule.", desc: "Monthly or quarterly upkeep — discounted per visit." },
    ],
  },
];

// Netting: package from complexity points (cleaning points excluded from package pick).
function scoreNetting(answers) {
  let pts = 0;
  for (const q of NETTING_QUESTIONS) {
    if (q.key === "cleaning") continue;
    const opt = q.options.find((o) => o.v === answers[q.key]);
    if (opt) pts += opt.pts;
  }
  if (pts >= 101) return { custom: true };
  const economy = pts <= 12;
  return {
    custom: false,
    pkg: economy ? "Economy" : "Standard",
    price: economy ? "from $200 CAD" : "from $350 CAD",
    needsCleaning: answers.cleaning === "yes",
    note: economy
      ? "Looks like your balcony is setup to be one of the easiest to work with! Our Economy package — materials and installation — has you covered."
      : "Your balcony has some details that call for our Standard package — heavier-duty materials and a more involved installation, all handled by us.",
  };
}

// Cleaning: package price + add-ons, all CAD.
function scoreCleaning(answers) {
  const pkgOpt = CLEANING_QUESTIONS[0].options.find((o) => o.v === answers.package);
  const base = pkgOpt?.base ?? 250;
  const items = [
    pkgOpt?.v === "floor"
      ? ["Floor-Only Cleaning (floor, nest & poop removal, disinfecting)", 170]
      : ["Full Balcony Cleaning (door, windows, handrails, floor, walls, disinfecting)", 250],
  ];
  if (answers.furniture === "few") items.push(["Furniture cleaning", 20]);
  if (answers.furniture === "lots") {
    items.push(["Furniture cleaning", 20]);
    items.push(["Garbage removal", 50]);
  }
  const total = items.reduce((sum, [, p]) => sum + p, 0);
  return {
    custom: false,
    items,
    total,
    needsCleaning: answers.condition === "heavy",
    note: answers.size === "large"
      ? "Your balcony is on the larger side — the final price is confirmed in a free written quote, but this is a solid estimate."
      : "Nice — that's a straightforward balcony clean for our crew, with condo-board-friendly low-moisture methods.",
  };
}

export default function BalconyQuoteQuiz({ mode = "balcony-netting", location = null, phone = "+1 437-288-7140" }) {
  const isNetting = mode === "balcony-netting";
  const questions = isNetting ? NETTING_QUESTIONS : CLEANING_QUESTIONS;
  const [step, setStep] = useState(0); // 0..5 = questions, 6 = result
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState(null);

  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const result = step === 6 ? (isNetting ? scoreNetting(answers) : scoreCleaning(answers)) : null;

  function pick(key, value) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.service = isNetting ? "Balcony Netting" : "Balcony Cleaning";
    if (location && !data.city) data.city = location;
    const answerLines = questions.map((q) => {
      const opt = q.options.find((o) => o.v === answers[q.key]);
      return `${q.q} ${opt ? opt.label.replace(/\.$/, "") : "—"}`;
    });
    let estimate;
    if (result?.custom) {
      estimate = "Custom quote required (on-site visit)";
    } else if (isNetting) {
      estimate = `Quiz estimate: ${result?.pkg} package ${result?.price}${result?.needsCleaning ? " + cleaning $170–$250 CAD" : ""}`;
    } else {
      estimate = `Quiz estimate: $${result?.total} CAD (${(result?.items || []).map(([n, p]) => `${n} $${p}`).join(" + ")})`;
    }
    data.message = [
      `[Instant balcony ${isNetting ? "netting" : "cleaning"} quote quiz${location ? ` — ${location}` : ""}]`,
      `Estimate: ${estimate}`,
      ...answerLines,
      data.message ? `Balcony details: ${data.message}` : "",
    ].filter(Boolean).join("\n");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        window.location.href = "/thank-you";
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const heading = isNetting
    ? `Get Your Balcony Netting Quote Instantly${location ? ` — ${location}` : ""}`
    : `Get Your Balcony Cleaning Quote Instantly${location ? ` — ${location}` : ""}`;

  return (
    <div className="bquiz" id="balcony-quote">
      <div className="bquiz-head">
        <div className="bquiz-head-copy">
          <h2>{heading}</h2>
          <p>
            {isNetting
              ? "It's super easy! Just take this quick quiz to figure out how much it will cost to make your apartment balcony bird proof and put an end to your bird problems. All prices in CAD."
              : "It's super easy! Just take this quick quiz to figure out how much it will cost to get your balcony professionally cleaned, sanitized and ready to enjoy. All prices in CAD."}
          </p>
        </div>
        <div className="bquiz-head-img">
          <Image
            src={isNetting ? `${IMG}/q1-shape.jpg` : "/images/condo-balcony-cleaning-toronto.webp"}
            alt={isNetting ? "Balcony netting quote — balcony styles and shapes" : "Balcony cleaning quote — Toronto condo balconies"}
            width={300}
            height={160}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      {step < 6 ? (
        <div className="bquiz-body">
          <div className="bquiz-progress" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={6}>
            <span className="bquiz-progress-label">Question {step + 1} of 6</span>
            <div className="bquiz-progress-track">
              <div className="bquiz-progress-fill" style={{ width: `${((step + 1) / 6) * 100}%` }} />
            </div>
          </div>
          <h3 className="bquiz-q">{questions[step].q}</h3>
          <div className="bquiz-grid">
            {questions[step].options.map((o) => (
              <button key={o.v} type="button" className="bquiz-opt" onClick={() => pick(questions[step].key, o.v)}>
                <Image src={o.img} alt={o.label.replace(/\.$/, "")} width={300} height={160} style={{ width: "100%", height: "auto" }} />
                <span className="bquiz-opt-label">{o.label}</span>
                <span className="bquiz-opt-desc">{o.desc}</span>
              </button>
            ))}
          </div>
          {step > 0 && (
            <button type="button" className="qback" onClick={() => setStep((s) => s - 1)}>← Back</button>
          )}
        </div>
      ) : result.custom ? (
        <div className="bquiz-body bquiz-result">
          <h3 className="bquiz-range">Things are looking a little too complicated here</h3>
          <p>
            It looks like that due to the nature of your setup there might be some complications. Please note that any special/non-standard balconies require a custom approach and extra work which would make the cost in excess of $500 CAD. Also, those balconies with no ceiling/high ceiling or stucco/drywall structure cannot be done using standard mounting hardware.
          </p>
          <p>
            <b>Please contact us directly at <a href={telHref}>{phone}</a></b> to arrange an on-site visit so we can assess and quote your project in detail, or use the form below to send us your details.
          </p>
          <QuizForm onSubmit={onSubmit} status={status} isNetting={isNetting} custom />
        </div>
      ) : isNetting ? (
        <div className="bquiz-body bquiz-result">
          <h3 className="bquiz-range">
            Your balcony netting package: <b>{result.pkg} — {result.price}</b>
          </h3>
          <p>{result.note} Materials and professional installation are included. This is still an estimate — the price could be slightly higher if your balcony has extra dividers/turns or a higher-than-usual ceiling. Final price confirmed in a free written quote.</p>
          {result.needsCleaning && (
            <p><b>Don't forget — the balcony should be cleaned BEFORE the netting is installed.</b> Add balcony cleaning: Floor-Only $170 CAD or Full Cleaning $250 CAD — same visit, one crew.</p>
          )}
          <QuizForm onSubmit={onSubmit} status={status} isNetting={isNetting} />
          <p className="form-note">Prefer to talk? Call <a href={telHref}>{phone}</a> — free written quotes, confirmed before any work begins.</p>
        </div>
      ) : (
        <div className="bquiz-body bquiz-result">
          <h3 className="bquiz-range">
            Your balcony cleaning estimate: <b>${result.total} CAD</b>
          </h3>
          <ul className="checklist" style={{ margin: "10px 0 14px" }}>
            {result.items.map(([n, p]) => <li key={n}>{n} — <b>${p} CAD</b></li>)}
          </ul>
          <p>{result.note} This is still an estimate — the final price is confirmed in a free written quote before any work begins.</p>
          <p><b>Want to keep it clean for good?</b> Add balcony netting — Economy from $200 CAD or Standard from $350 CAD, materials and installation included — and pigeons never come back.</p>
          <QuizForm onSubmit={onSubmit} status={status} isNetting={isNetting} />
          <p className="form-note">Prefer to talk? Call <a href={telHref}>{phone}</a> — free written quotes, confirmed before any work begins.</p>
        </div>
      )}
    </div>
  );
}

function QuizForm({ onSubmit, status, isNetting, custom = false }) {
  return (
    <form className="bquiz-form" onSubmit={onSubmit}>
      <div className="qf-row">
        <div>
          <label htmlFor="bq-name">Your Name *</label>
          <input id="bq-name" name="name" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="bq-phone">Your Phone *</label>
          <input id="bq-phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
      </div>
      <div className="qf-row">
        <div>
          <label htmlFor="bq-email">Your Email</label>
          <input id="bq-email" name="email" type="email" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="bq-city">Address / City</label>
          <input id="bq-city" name="city" autoComplete="address-level2" />
        </div>
      </div>
      <label htmlFor="bq-msg">Balcony Details</label>
      <textarea id="bq-msg" name="message" rows={3} placeholder="Building, floor, access notes, timeline…" />
      <button className="btn btn-accent" type="submit" disabled={status === "sending"} style={{ width: "100%", marginTop: 14 }}>
        {status === "sending" ? "Sending…" : custom ? "Request My On-Site Visit" : isNetting ? "Get My Balcony Netting Quote" : "Get My Balcony Cleaning Quote"}
      </button>
      {status === "error" && <p className="form-note admin-err">Something went wrong — please call us instead.</p>}
      <p className="form-note">This is a quote request only and there is no obligation to you. We reply within one business day.</p>
    </form>
  );
}
