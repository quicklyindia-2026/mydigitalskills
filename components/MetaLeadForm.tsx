"use client";

import { FormEvent, useState } from "react";

export function MetaLeadForm() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSaving(true);
    setError("");

    const payload = {
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      business: data.get("business"),
      service: "Meta Ads & Performance Marketing",
      source: "meta-ads-landing-page",
      message: `Goal: ${data.get("goal")} | Monthly budget: ${data.get("budget")}`,
    };

    try {
      const response = await fetch("/api/admin/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Could not save enquiry");
    } catch {
      setError("Your details could not be saved. Please try again.");
      setSaving(false);
      return;
    }

    const message = "Hi Lambodar, I submitted a Meta Ads consultation request on MyDigitalSkills. Please check the secure admin dashboard.";

    setSaving(false);
    window.open(`https://wa.me/918128729003?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="meta-lead-form" onSubmit={submit}>
      <div className="meta-form-heading">
        <span>FREE CAMPAIGN DISCUSSION</span>
        <h2>Let’s discuss your growth goal.</h2>
        <p>Share a few details. Your enquiry will reach Lambodar directly.</p>
      </div>
      <div className="meta-form-grid">
        <label><span>Your name *</span><input name="name" required autoComplete="name" placeholder="Full name" /></label>
        <label><span>Mobile number *</span><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="WhatsApp number" /></label>
        <label><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="you@business.com" /></label>
        <label><span>Business / brand</span><input name="business" placeholder="Business name" /></label>
        <label><span>Primary goal *</span><select name="goal" required defaultValue=""><option value="" disabled>Select your goal</option><option>Generate qualified leads</option><option>Increase sales</option><option>Improve campaign performance</option><option>Launch a new campaign</option><option>Audit existing Meta Ads</option></select></label>
        <label><span>Monthly ad budget *</span><select name="budget" required defaultValue=""><option value="" disabled>Select budget</option><option>Below ₹25,000</option><option>₹25,000 – ₹50,000</option><option>₹50,000 – ₹1,00,000</option><option>₹1,00,000 – ₹5,00,000</option><option>₹5,00,000+</option></select></label>
      </div>
      {error && <p className="meta-form-error">{error}</p>}
      <button className="meta-submit" disabled={saving} type="submit">{saving ? "Saving your enquiry…" : "Connect on WhatsApp →"}</button>
      <small>✓ No obligation &nbsp; ✓ Direct WhatsApp conversation &nbsp; ✓ Form details stay in the secure dashboard</small>
    </form>
  );
}
