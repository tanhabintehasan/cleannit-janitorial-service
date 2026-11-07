"use client";

import { useState } from "react";

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l1.8 5.6L19 9.2l-5.2 1.6L12 16.4l-1.8-5.6L5 9.2l5.2-1.6L12 2zm7 11l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6zM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z"/>
    </svg>
  );
}

export default function QuoteForm({ services = [], compact = false, formTitle = "Request a Free Quote", lockedService = null }) {
  const [status, setStatus] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.target).entries());
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

  const serviceField = lockedService ? (
    <>
      <input type="hidden" name="service" value={lockedService} />
      <div className="locked-service">
        <span>Service</span>
        <b>{lockedService}</b>
      </div>
    </>
  ) : (
    <>
      <label htmlFor={compact ? "hf-service" : "qf-service"}>Service Needed</label>
      <select id={compact ? "hf-service" : "qf-service"} name="service">
        <option value="">Select a service…</option>
        {services.map((s) => (
          <option key={s.slug} value={s.name}>{s.name}</option>
        ))}
        <option value="Other">Other / Not sure</option>
      </select>
    </>
  );

  const fields = compact ? (
    <>
      <div className="qf-row">
        <div>
          <label htmlFor="hf-name">Name *</label>
          <input id="hf-name" name="name" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="hf-phone">Phone *</label>
          <input id="hf-phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
      </div>
      {serviceField}
      <button className="btn btn-accent" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Schedule My Free Quote"}
      </button>
      {status === "error" && <p className="form-note admin-err">Something went wrong — please call us instead.</p>}
      <p className="form-note">No spam, ever. We reply within one business day.</p>
    </>
  ) : (
    <>
      <label htmlFor="qf-name">Name *</label>
      <input id="qf-name" name="name" required autoComplete="name" />
      <label htmlFor="qf-phone">Phone *</label>
      <input id="qf-phone" name="phone" type="tel" required autoComplete="tel" />
      <label htmlFor="qf-email">Email</label>
      <input id="qf-email" name="email" type="email" autoComplete="email" />
      {serviceField}
      <label htmlFor="qf-city">City / Area</label>
      <input id="qf-city" name="city" placeholder="e.g. North York" />
      <label htmlFor="qf-msg">Tell us about the job</label>
      <textarea id="qf-msg" name="message" rows={4} placeholder="Property type, size, frequency, timeline…" />
      <button className="btn btn-accent" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Schedule My Free Quote"}
      </button>
      {status === "error" && <p className="form-note admin-err">Something went wrong — please call us instead.</p>}
      <p className="form-note">No spam, ever. We reply within one business day.</p>
    </>
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
        <form onSubmit={onSubmit}>{fields}</form>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={onSubmit}>
      <h2>{formTitle}</h2>
      {fields}
    </form>
  );
}
