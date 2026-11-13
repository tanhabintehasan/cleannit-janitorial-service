"use client";

import { useState } from "react";
import Image from "next/image";

// Instant balcony quote quiz — same 6-question pictured format, point system and
// price tiers as the pigeonbusters.ca/balcony-netting-quote system.
// Used on both balcony-netting and balcony-cleaning pages; `mode` decides framing.

const IMG = "/images/balcony-quiz";

const QUESTIONS = [
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

const TIERS = [
  { max: 4, range: "$325–$365", note: "Looks like your balcony is setup to be one of the easiest to work with! This will make setup and installation quick n' easy — you'll have a bird free balcony in no time." },
  { max: 12, range: "$365–$425", note: "Nice — that was easy. You have a fairly standard balcony setup which makes it ideal for our services." },
  { max: 45, range: "$385–$465", note: "All done. It looks like your balcony features some details that make installation a little more time consuming & complex — but we can handle it!" },
  { max: 100, range: "$425–$495", note: "Well hello Mister Fancypants! It seems your balcony has a few complicated features on it that will make installation a little more involved, but it's nothing we can't handle." },
];

const ESTIMATE_DISCLAIMER =
  "Please note that at this point this is still an estimation — the price could slightly be higher if your balcony has a divider/turns or if it is located on the top floor, where the ceiling can be higher than usual.";

function scoreQuiz(answers) {
  let pts = 0;
  for (const q of QUESTIONS) {
    const opt = q.options.find((o) => o.v === answers[q.key]);
    if (opt) pts += opt.pts;
  }
  if (pts >= 101) return { custom: true };
  const tier = TIERS.find((t) => pts <= t.max);
  return { custom: false, tier, needsCleaning: answers.cleaning === "yes" };
}

export default function BalconyQuoteQuiz({ mode = "balcony-netting", location = null, phone = "+1 437-288-7140" }) {
  const isNetting = mode === "balcony-netting";
  const [step, setStep] = useState(0); // 0..5 = questions, 6 = result
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState(null);

  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const result = step === 6 ? scoreQuiz(answers) : null;

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
    const answerLines = QUESTIONS.map((q) => {
      const opt = q.options.find((o) => o.v === answers[q.key]);
      return `${q.q} ${opt ? opt.label.replace(/\.$/, "") : "—"}`;
    });
    const estimate = result?.custom ? "Custom quote required (on-site visit)" : `Quiz estimate: ${result?.tier?.range || "—"}`;
    data.message = [
      `[Instant balcony quote quiz${location ? ` — ${location}` : ""}]`,
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
              : "It's super easy! Just take this quick quiz — get your balcony professionally cleaned and see what permanent pigeon-proof netting would cost."}
          </p>
        </div>
        <div className="bquiz-head-img">
          <Image
            src={`${IMG}/q1-shape.jpg`}
            alt={isNetting ? "Balcony netting quote — balcony styles and shapes" : "Balcony cleaning quote — balcony styles and shapes"}
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
          <h3 className="bquiz-q">{QUESTIONS[step].q}</h3>
          <div className="bquiz-grid">
            {QUESTIONS[step].options.map((o) => (
              <button key={o.v} type="button" className="bquiz-opt" onClick={() => pick(QUESTIONS[step].key, o.v)}>
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
            Your average balcony netting price range: <b>{result.tier.range}</b>
            {result.needsCleaning ? " (This doesn't include cleaning service.)" : ""}
          </h3>
          <p>{result.tier.note} {ESTIMATE_DISCLAIMER}</p>
          {result.needsCleaning && (
            <p><b>Don't forget to have the balcony cleaned BEFORE the netting is installed</b> — we can do the cleanup and sanitization in the same visit.</p>
          )}
          {!isNetting && (
            <p>Pair your cleaning with netting and pigeons never come back — one visit, one crew, bundled pricing.</p>
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
        {status === "sending" ? "Sending…" : custom ? "Request My On-Site Visit" : isNetting ? "Get My Balcony Netting Quote" : "Book My Balcony Cleaning"}
      </button>
      {status === "error" && <p className="form-note admin-err">Something went wrong — please call us instead.</p>}
      <p className="form-note">This is a quote request only and there is no obligation to you. We reply within one business day.</p>
    </form>
  );
}
