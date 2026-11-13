"use client";

import { useState } from "react";
import Image from "next/image";

// Pigeonbusters-style instant balcony quote quiz:
// progress bar → 6 pictured questions → instant price-range estimate → contact form.
// Used on both balcony-netting and balcony-cleaning pages; `mode` decides framing.

function ShapeIcon({ d }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="bq-icon">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  rect: "M6 14h36v22H6z M6 14v22 M42 14v22",
  lshape: "M6 10h20v14h16v16H6z",
  irregular: "M8 12h32v24H24V24H8z",
  juliette: "M10 12h28v24 M10 36h28 M14 12v24 M24 12v24 M34 12v24",
  glass: "M8 10h32v26 M8 36h32 M8 10v26 M40 10v26 M16 30l10-16 M26 32l8-12",
  picket: "M8 10h32 M8 36h32 M8 10v26 M40 10v26 M16 10v26 M24 10v26 M32 10v26",
  concrete: "M8 14h32v22H8z M8 21h32 M8 29h32 M20 14v7 M32 21v8 M20 29v7",
  cleanNo: "M24 8l3 8 8 3-8 3-3 8-3-8-8-3 8-3z M36 30l1.6 4.4L42 36l-4.4 1.6L36 42l-1.6-4.4L30 36l4.4-1.6z",
  cleanLight: "M12 34h24 M14 30c4-3 16-3 20 0 M24 12v10 M19 16l5-4 5 4",
  cleanHeavy: "M10 34h28 M12 34c0-8 4-12 8-12 M28 34c0-10 5-14 10-14 M18 22l3-8 3 8 M14 12l2 4 4-2",
  ceilingStd: "M8 12h32 M10 12v18 M38 12v18 M14 30h20 M14 36h20",
  ceilingHigh: "M8 8h32 M10 8v24 M38 8v24 M14 32h20 M14 40h20",
  ceilingNone: "M14 16h20 M14 22h20 M12 30h24 M12 38h24 M36 8l4 4-4 4",
  wallConcrete: "M8 12h32v24H8z M8 20h32 M8 28h32 M18 12v8 M30 20v8 M18 28v8",
  wallSiding: "M10 12h28 M10 18h28 M10 24h28 M10 30h28 M10 36h28",
  wallStucco: "M10 12h28v24H10z M16 18h2 M24 16h2 M32 20h2 M18 26h2 M28 28h2 M22 32h2 M34 32h2",
  outletYes: "M18 10h12v14a6 6 0 01-12 0z M21 16h2 M25 16h2 M24 30v8",
  outletNo: "M18 10h12v14a6 6 0 01-12 0z M21 16h2 M25 16h2 M24 30v6 M12 34l24 8 M36 34l-24 8",
};

const QUESTIONS = [
  {
    key: "shape",
    q: "What shape/style/type is your balcony?",
    options: [
      { v: "rectangular", label: "Rectangular / square", icon: "rect", pts: 0 },
      { v: "l-shaped", label: "L-shaped / has a divider", icon: "lshape", pts: 1 },
      { v: "irregular", label: "Irregular / turns a corner", icon: "irregular", pts: 1 },
      { v: "juliette", label: "Juliette / very small", icon: "juliette", pts: 2 },
    ],
  },
  {
    key: "railing",
    q: "What kind of railing is on your balcony?",
    options: [
      { v: "glass", label: "Glass panels", icon: "glass", pts: 0 },
      { v: "picket", label: "Metal pickets / bars", icon: "picket", pts: 0 },
      { v: "concrete", label: "Concrete / solid wall", icon: "concrete", pts: 1 },
    ],
  },
  {
    key: "cleaning",
    q: "Does your balcony require cleaning / clearing out?",
    options: [
      { v: "no", label: "No — it's already clean", icon: "cleanNo", pts: 0 },
      { v: "light", label: "Light dust & debris", icon: "cleanLight", pts: 0 },
      { v: "heavy", label: "Yes — droppings / nesting", icon: "cleanHeavy", pts: 1 },
    ],
  },
  {
    key: "ceiling",
    q: "Is there a ceiling above your balcony?",
    options: [
      { v: "standard", label: "Yes — standard height", icon: "ceilingStd", pts: 0 },
      { v: "high", label: "Yes — unusually high / top floor", icon: "ceilingHigh", pts: 2 },
      { v: "none", label: "No ceiling above", icon: "ceilingNone", pts: 2 },
    ],
  },
  {
    key: "wall",
    q: "What material is the wall around it made out of?",
    options: [
      { v: "concrete", label: "Concrete / brick", icon: "wallConcrete", pts: 0 },
      { v: "siding", label: "Metal / siding panels", icon: "wallSiding", pts: 1 },
      { v: "stucco", label: "Stucco / drywall", icon: "wallStucco", pts: 2 },
    ],
  },
  {
    key: "outlet",
    q: "Is there access to an electrical outlet close to the balcony?",
    options: [
      { v: "yes", label: "Yes", icon: "outletYes", pts: 0 },
      { v: "no", label: "No / not sure", icon: "outletNo", pts: 1 },
    ],
  },
];

const TIERS = [
  { max: 0, range: "$325–$365", note: "Looks like your balcony is set up to be one of the easiest to work with! This makes setup and installation quick and easy — you'll have a bird-free balcony in no time." },
  { max: 2, range: "$365–$425", note: "Nice — that was easy. You have a fairly standard balcony setup which makes it ideal for our netting service." },
  { max: 3, range: "$385–$465", note: "All done. It looks like your balcony has some details that make installation a little more time-consuming and complex — but we can handle it!" },
  { max: 99, range: "$425–$495", note: "It seems your balcony has a few complicated features that make installation more involved — but it's nothing we can't handle." },
];

const ESTIMATE_DISCLAIMER =
  "Please note this is still an estimate — the price could be slightly higher if your balcony has extra dividers/turns, or if it is on the top floor where ceilings run higher than usual.";

function scoreQuiz(answers) {
  let pts = 0;
  for (const q of QUESTIONS) {
    const opt = q.options.find((o) => o.v === answers[q.key]);
    if (opt) pts += opt.pts;
  }
  const custom =
    (answers.ceiling === "none" || answers.ceiling === "high") && answers.wall === "stucco";
  if (custom) return { custom: true };
  const tier = TIERS.find((t) => pts <= t.max);
  return { custom: false, tier, needsCleaning: answers.cleaning === "heavy" };
}

export default function BalconyQuoteQuiz({ mode = "balcony-netting", location = null, phone = "+1 437-288-7140" }) {
  const isNetting = mode === "balcony-netting";
  const serviceName = isNetting ? "Balcony Netting" : "Balcony Cleaning";
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
    if (location) data.city = location;
    const answerLines = QUESTIONS.map((q) => {
      const opt = q.options.find((o) => o.v === answers[q.key]);
      return `${q.q} ${opt ? opt.label : "—"}`;
    });
    const estimate = result?.custom ? "Custom quote required (on-site visit)" : `Quiz estimate: ${result?.tier?.range || "—"}`;
    data.message = [
      `[Instant balcony quote quiz${location ? ` — ${location}` : ""}]`,
      `Estimate: ${estimate}`,
      ...answerLines,
      data.message ? `Notes: ${data.message}` : "",
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
    ? `Instant Balcony Netting Quote${location ? ` — ${location}` : ""}`
    : `Instant Balcony Cleaning & Netting Quote${location ? ` — ${location}` : ""}`;

  return (
    <div className="bquiz" id="balcony-quote">
      <div className="bquiz-head">
        <div className="bquiz-head-copy">
          <h2>{heading}</h2>
          <p>
            {isNetting
              ? "It's super easy! Answer 6 quick questions to see how much it costs to bird-proof your balcony."
              : "It's super easy! Answer 6 quick questions — get your balcony cleaned and see what permanent pigeon-proof netting would cost."}
          </p>
        </div>
        <div className="bquiz-head-img">
          <Image
            src={isNetting ? "/images/bird-netting-pigeon-control-balcony-toronto.webp" : "/images/condo-balcony-cleaning-toronto.webp"}
            alt={isNetting ? "Condo balcony in Toronto protected with pigeon netting" : "Toronto condo balcony before professional cleaning"}
            width={560}
            height={360}
            sizes="(max-width: 720px) 100vw, 320px"
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
                <ShapeIcon d={ICONS[o.icon]} />
                <span>{o.label}</span>
              </button>
            ))}
          </div>
          {step > 0 && (
            <button type="button" className="qback" onClick={() => setStep((s) => s - 1)}>← Back</button>
          )}
        </div>
      ) : result.custom ? (
        <div className="bquiz-body bquiz-result">
          <h3 className="bquiz-range">This balcony needs a custom quote</h3>
          <p>
            Due to the nature of your setup there may be some complications: special or non-standard balconies — no ceiling, high ceilings, or stucco/drywall walls — need a custom approach and non-standard mounting hardware.
          </p>
          <p>
            <b>Call us at <a href={telHref}>{phone}</a></b> to arrange a free on-site visit so we can assess and quote your project in detail — or send the form below and we'll call you.
          </p>
          <QuizForm onSubmit={onSubmit} status={status} isNetting={isNetting} custom />
        </div>
      ) : (
        <div className="bquiz-body bquiz-result">
          <h3 className="bquiz-range">
            Your average balcony {isNetting ? "netting" : "netting"} price range: <b>{result.tier.range}</b>
            {result.needsCleaning ? " (not including cleaning service)" : ""}
          </h3>
          <p>{result.tier.note} {ESTIMATE_DISCLAIMER}</p>
          {result.needsCleaning && (
            <p><b>Don't forget — the balcony should be cleaned and sanitized BEFORE the netting is installed.</b> We can do both in one visit.</p>
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
          <label htmlFor="bq-name">Name *</label>
          <input id="bq-name" name="name" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="bq-phone">Phone *</label>
          <input id="bq-phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
      </div>
      <label htmlFor="bq-email">Email</label>
      <input id="bq-email" name="email" type="email" autoComplete="email" />
      <label htmlFor="bq-msg">Anything else we should know?</label>
      <textarea id="bq-msg" name="message" rows={3} placeholder="Building, floor, access notes, timeline…" />
      <button className="btn btn-accent" type="submit" disabled={status === "sending"} style={{ width: "100%", marginTop: 14 }}>
        {status === "sending" ? "Sending…" : custom ? "Request My On-Site Visit" : isNetting ? "Lock In My Balcony Netting Quote" : "Book My Balcony Cleaning"}
      </button>
      {status === "error" && <p className="form-note admin-err">Something went wrong — please call us instead.</p>}
      <p className="form-note">No spam, ever. We reply within one business day.</p>
    </form>
  );
}
