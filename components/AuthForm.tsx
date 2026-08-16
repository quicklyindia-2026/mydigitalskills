"use client";
import { useState } from "react";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMessage("Please wait…");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, mode }) });
    const json = await res.json();
    if (!res.ok) return setMessage(json.error || "Unable to continue.");
    location.href = json.redirect;
  }
  return <div className="checkout-card auth-card"><div className="auth-tabs"><button type="button" onClick={() => setMode("login")} className={mode === "login" ? "active" : ""}>Login</button><button type="button" onClick={() => setMode("signup")} className={mode === "signup" ? "active" : ""}>Create account</button></div><form onSubmit={submit}>{mode === "signup" && <label>Full name<input name="fullName" required /></label>}<label>Email<input name="email" type="email" required /></label><label>Password<input name="password" type="password" minLength={8} required /></label><button className="button button-primary" type="submit">{mode === "signup" ? "Create Student Account" : "Login"}</button><p aria-live="polite">{message}</p></form></div>;
}
