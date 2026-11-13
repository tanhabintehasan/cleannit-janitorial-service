"use client";

import { useState } from "react";
import Image from "next/image";

// Instant balcony quote quiz.
// mode "balcony-netting": pigeonbusters.ca-style 6-question netting quiz.
// mode "balcony-cleaning": 6-question balcony CLEANING quiz with cleaning prices,
// netting is only suggested afterwards (as a bottom companion section).

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
    key: "size",
    q: "How big is your balcony?",
    options: [
      { v: "small", pts: 0, img: `${IMG}/q1-shape.jpg`, label: "Small / Juliette.", desc: "A compact balcony or juliette-style — just enough room to step out." },
      { v: "standard", pts: 1, img: `${IMG}/q1-flush.jpg`, label: "Standard condo balcony.", desc: "A typical condo or apartment balcony with room for a couple of chairs." },
      { v: "large", pts: 2, img: `${IMG}/q1-flush-shared.jpg`, label: "Large / terrace / L-shaped.", desc: "A big terrace, wraparound or L-shaped balcony with lots of floor area." },
    ],
  },
  {
    key: "condition",
    q: "How dirty is your balcony right now?",
    options: [
      { v: "light", pts: 0, img: `${IMG}/q3-clean.jpg`, label: "Light dust & pollen.", desc: "Mostly surface dust, pollen and cobwebs — no droppings or stains." },
      { v: "moderate", pts: 2, img: "/images/condo-balcony-cleaning-toronto.webp", label: "Moderate grime & stains.", desc: "Built-up city grime, pollution film, drink or rust stains that need scrubbing." },
      { v: "heavy", pts: 4, img: `${IMG}/q3-dirty.jpg`, label: "Heavy — pigeon droppings / nests.", desc: "Bird droppings, nesting material or heavy soiling that needs full sanitization." },
    ],
  },
  {
    key: "furniture",
    q: "Is there furniture or clutter to move?",
    options: [
      { v: "none", pts: 0, img: `${IMG}/q3-clean.jpg`, label: "Empty or almost empty.", desc: "Nothing (or almost nothing) on the balcony — we can start right away." },
      { v: "few", pts: 1, img: `${IMG}/q4-open.jpg`, label: "A few items.", desc: "A couple of chairs, a small table or a few planters to work around." },
      { v: "lots", pts: 2, img: `${IMG}/q1-protruding.jpg`, label: "Lots of furniture / storage.", desc: "Full furniture sets, storage boxes, bikes or gym equipment to move and reset." },
    ],
  },
  {
    key: "floor",
    q: "What kind of floor does your balcony have?",
    options: [
      { v: "concrete", pts: 0, img: `${IMG}/q5-concrete.jpg`, label: "Concrete.", desc: "Standard poured concrete balcony floor." },
      { v: "tiles", pts: 1, img: `${IMG}/q5-wood.jpg`, label: "Interlocking deck tiles.", desc: "Wood or composite snap-in tiles — we lift, clean under and reset them." },
      { v: "other", pts: 1, img: `${IMG}/q5-brick.jpg`, label: "Other / not sure.", desc: "Tile, membrane, astro-turf or a mix — we'll assess on arrival." },
    ],
  },
  {
    key: "glass",
    q: "Do the glass panels and railings need cleaning?",
    options: [
      { v: "glass", pts: 2, img: `${IMG}/q2-solid.jpg`, label: "Yes — glass panels, both sides.", desc: "Glass balcony panels cleaned inside and out, streak-free." },
      { v: "open", pts: 1, img: `${IMG}/q2-railing.jpg`, label: "Open railing / bars only.", desc: "Metal bars or pickets — quicker to detail than full glass." },
      { v: "minimal", pts: 0, img: `${IMG}/q2-solid-gap.jpg`, label: "Minimal / floor only.", desc: "Just the floor and surfaces — railings are fine as they are." },
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

const NETTING_TIERS = [
  { max: 4, range: "$325–$365", note: "Looks like your balcony is setup to be one of the easiest to work with! This will make setup and installation quick n' easy — you'll have a bird free balcony in no time." },
  { max: 12, range: "$365–$425", note: "Nice — that was easy. You have a fairly standard balcony setup which makes it ideal for our services." },
  { max: 45, range: "$385–$465", note: "All done. It looks like your balcony features some details that make installation a little more time consuming & complex — but we can handle it!" },
  { max: 100, range: "$425–$495", note: "Well hello Mister Fancypants! It seems your balcony has a few complicated features on it that will make installation a little more involved, but it's nothing we can't handle." },
];

const CLEANING_TIERS = [
  { max: 2, range: "$120–$180", note: "Great news — your balcony is one of the easiest to clean! A quick, thorough visit and you'll have your outdoor space back the same day." },
  { max: 5, range: "$150–$220", note: "Nice — that's a fairly standard balcony clean. We'll deep-clean floors, railings and glass with our condo-board-friendly, low-moisture methods." },
  { max: 8, range: "$180–$300", note: "All done. Your balcony needs a bit more elbow grease — furniture moving, deck-tile work or heavier grime — but nothing we don't do every week." },
  { max: 99, range: "$250–$350", note: "Your balcony needs the full treatment — heavy soiling or droppings sanitization plus detail work. We'll mist, remove, sanitize and deodorize everything safely with proper PPE." },
];

const NETTING_DISCLAIMER =
  "Please note that at this point this is still an estimation — the price could slightly be higher if your balcony has a divider/turns or if it is located on the top floor, where the ceiling can be higher than usual.";

const CLEANING_DISCLAIMER =
  "Please note that this is still an estimation — the final price is confirmed in a free written quote once we see your balcony photos or do a quick on-site look.";

function scoreQuiz(answers, questions, tiers, cleaningMode) {
  let pts = 0;
  for (const q of questions) {
    const opt = q.options.find((o) => o.v === answers[q.key]);
    if (opt) pts += opt.pts;
  }
  if (!cleaningMode && pts >= 101) return { custom: true };
  const tier = tiers.find((t) => pts <= t.max);
  return {
    custom: false,
    tier,
    needsCleaning: cleaningMode ? answers.condition === "heavy" : answers.cleaning === "yes",
  };
}

export default function BalconyQuoteQuiz({ mode = "balcony-netting", location = null, phone = "+1 437-288-7140" }) {
  const isNetting = mode === "balcony-netting";
  const questions = isNetting ? NETTING_QUESTIONS : CLEANING_QUESTIONS;
  const tiers = isNetting ? NETTING_TIERS : CLEANING_TIERS;
  const [step, setStep] = useState(0); // 0..5 = questions, 6 = result
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState(null);

  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const result = step === 6 ? scoreQuiz(answers, questions, tiers, !isNetting) : null;

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
    const estimate = result?.custom ? "Custom quote required (on-site visit)" : `Quiz estimate: ${result?.tier?.range || "—"}`;
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
              ? "It's super easy! Just take this quick quiz to figure out how much it will cost to make your apartment balcony bird proof and put an end to your bird problems."
              : "It's super easy! Just take this quick quiz to figure out how much it will cost to get your balcony professionally cleaned, sanitized and ready to enjoy."}
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
            It looks like that due to the nature of your setup there might be some complications. Please note that any special/non-standard balconies require a custom approach and extra work which would make the cost in excess of $500. Also, those balconies with no ceiling/high ceiling or stucco/drywall structure cannot be done using standard mounting hardware.
          </p>
          <p>
            <b>Please contact us directly at <a href={telHref}>{phone}</a></b> to arrange an on-site visit so we can assess and quote your project in detail, or use the form below to send us your details.
          </p>
          <QuizForm onSubmit={onSubmit} status={status} isNetting={isNetting} custom />
        </div>
      ) : (
        <div className="bquiz-body bquiz-result">
          <h3 className="bquiz-range">
            Your average balcony {isNetting ? "netting" : "cleaning"} price range: <b>{result.tier.range}</b>
            {!isNetting && result.needsCleaning ? " (including droppings sanitization)" : ""}
            {isNetting && result.needsCleaning ? " (This doesn't include cleaning service.)" : ""}
          </h3>
          <p>{result.tier.note} {isNetting ? NETTING_DISCLAIMER : CLEANING_DISCLAIMER}</p>
          {isNetting && result.needsCleaning && (
            <p><b>Don't forget to have the balcony cleaned BEFORE the netting is installed</b> — we can do the cleanup and sanitization in the same visit.</p>
          )}
          {!isNetting && (
            <p><b>Want to keep it clean for good?</b> Add discreet balcony netting from $325 and pigeons never come back — one visit, one crew, bundled pricing.</p>
          )}
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
