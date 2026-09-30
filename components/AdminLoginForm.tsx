"use client";
import { useState } from "react";

export default function AdminLoginForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("Signing in…");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...data, mode: "login" }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setMessage(json.error || "Unable to sign in.");
    location.href = json.redirect || "/admin/lms";
  }

  return (
    <form className="checkout-card auth-card" onSubmit={submit}>
      <p className="eyebrow">Secure backend</p>
      <h2>Admin Login</h2>
      <label>Email<input name="email" type="email" defaultValue="connect@mydigitalskills.in" required /></label>
      <label>Password<input name="password" type="password" minLength={8} required autoComplete="current-password" /></label>
      <button className="button button-primary" type="submit" disabled={loading}>{loading ? "Signing in…" : "Login to Backend"}</button>
      <p aria-live="polite">{message}</p>
    </form>
  );
}
