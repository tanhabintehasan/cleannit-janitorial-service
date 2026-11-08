"use client";

import { useState } from "react";
import ServiceIcon from "./ServiceIcon";

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l1.8 5.6L19 9.2l-5.2 1.6L12 16.4l-1.8-5.6L5 9.2l5.2-1.6L12 2zm7 11l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6zM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z"/>
    </svg>
  );
}

export default function QuoteForm({ services = [], compact = false, formTitle = "Request a Free Quote", lockedService = null }) {
  const [step, setStep] = useState(lockedService ? 2 : 1);
  const [service, setService] = useState(lockedService || "");
  const [status, setStatus] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.service = service;
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

  const progress = (
    <div className="qprogress" aria-hidden="true">
      <span className={`qseg ${step >= 1 ? "on" : ""}`}>1 · Service</span>
      <span className={`qseg ${step >= 2 ? "on" : ""}`}>2 · Details</span>
    </div>
  );

  const stepOne = (
    <div>
      {progress}
      <p className="qstep-label">What do you need cleaned?</p>
      <div className="qsvc-grid">
        {services.map((s) => (
          <button
            key={s.slug}
            type="button"
            className={`qsvc-btn ${service === s.name ? "sel" : ""}`}
            onClick={() => setService(s.name)}
          >
            <ServiceIcon slug={s.slug} size={20} />
            <span>{s.name}</span>
          </button>
        ))}
        <button type="button" className={`qsvc-btn ${service === "Other" ? "sel" : ""}`} onClick={() => setService("Other")}>
          <ServiceIcon slug="default" size={20} />
          <span>Other</span>
        </button>
      </div>
      <button type="button" className="btn btn-accent" style={{ width: "100%", marginTop: 14 }} disabled={!service} onClick={() => setStep(2)}>
        Continue →
      </button>
    </div>
  );

  const stepTwo = (full) => (
    <div>
      {progress}
      {!lockedService && (
        <button type="button" className="qback" onClick={() => setStep(1)}>← {service || "Choose service"}</button>
      )}
      {lockedService && (
        <div className="locked-service"><span>Service</span><b>{lockedService}</b></div>
      )}
      <div className={compact ? "qf-row" : ""}>
        <div>
          <label htmlFor={compact ? "hf-name" : "qf-name"}>Name *</label>
          <input id={compact ? "hf-name" : "qf-name"} name="name" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor={compact ? "hf-phone" : "qf-phone"}>Phone *</label>
          <input id={compact ? "hf-phone" : "qf-phone"} name="phone" type="tel" required autoComplete="tel" />
        </div>
      </div>
      {full && (
        <>
          <label htmlFor="qf-email">Email</label>
          <input id="qf-email" name="email" type="email" autoComplete="email" />
          <label htmlFor="qf-city">City / Area</label>
          <input id="qf-city" name="city" placeholder="e.g. North York" />
          <label htmlFor="qf-msg">Tell us about the job</label>
          <textarea id="qf-msg" name="message" rows={3} placeholder="Property type, size, frequency, timeline…" />
        </>
      )}
      <button className="btn btn-accent" type="submit" disabled={status === "sending"} style={{ width: "100%", marginTop: 14 }}>
        {status === "sending" ? "Sending…" : "Schedule My Free Quote"}
      </button>
      {status === "error" && <p className="form-note admin-err">Something went wrong — please call us instead.</p>}
      <p className="form-note">No spam, ever. We reply within one business day.</p>
    </div>
  );

  if (compact) {
    return (
      <div className="quote-card">
        <div className="quote-card-head">
          <span className="qc-icon"><SparkleIcon /></span>
          <div>
            <h2>{formTitle}</h2>
            <p>Booked in under a minute · same-day response</p>
          </div>
        </div>
        <form onSubmit={onSubmit}>
          {step === 1 ? stepOne : stepTwo(false)}
        </form>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={onSubmit}>
      <h2>{formTitle}</h2>
      {step === 1 && !lockedService ? stepOne : stepTwo(true)}
    </form>
  );
}
