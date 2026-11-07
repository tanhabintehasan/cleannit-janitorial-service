"use client";

import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.target).entries());
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setBusy(false);
    if (res.ok) {
      window.location.reload();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Login failed.");
    }
  }

  return (
    <form className="admin-card admin-login" onSubmit={onSubmit}>
      <h2>Admin Login</h2>
      <label htmlFor="al-user">Username</label>
      <input id="al-user" name="username" autoComplete="username" required />
      <label htmlFor="al-pass">Password</label>
      <input id="al-pass" name="password" type="password" autoComplete="current-password" required />
      <button className="btn btn-primary admin-save" type="submit" disabled={busy} style={{ width: "100%" }}>
        {busy ? "Signing in…" : "Sign In"}
      </button>
      {error && <p className="admin-err" style={{ marginTop: 10 }}>{error}</p>}
    </form>
  );
}
