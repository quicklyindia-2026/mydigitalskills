"use client";

import { FormEvent, useState } from "react";

export function ConsultationForm() {
  const [saving,setSaving]=useState(false);
  async function submitToWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaving(true); await fetch("/api/admin/enquiries",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(Object.fromEntries(data.entries()))}).catch(()=>null); setSaving(false);
    const message = "Hi Lambodar, I submitted a consultation request on MyDigitalSkills. Please check the secure admin dashboard.";
    window.open(`https://wa.me/918128729003?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="form-card" onSubmit={submitToWhatsApp}>
      <p className="eyebrow">Free consultation</p>
      <h2>Tell me what you want to grow.</h2>
      <div className="form-grid">
        <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" required placeholder="Full name" /></div>
        <div className="field"><label htmlFor="phone">Mobile number</label><input id="phone" name="phone" required inputMode="tel" placeholder="Your number" /></div>
        <div className="field"><label htmlFor="business">Business / Brand</label><input id="business" name="business" placeholder="Business name" /></div>
        <div className="field"><label htmlFor="service">Service required</label>
          <select id="service" name="service" required defaultValue="">
            <option value="" disabled>Select a service</option>
            <option>Website Development</option><option>Meta Ads & Lead Generation</option><option>Social Media Marketing</option><option>Google Business Profile</option><option>Business Automation</option><option>Branding & Creative</option>
          </select>
        </div>
        <div className="field full"><label htmlFor="message">Your requirement</label><textarea id="message" name="message" placeholder="Tell me about your goal, challenge or project" /></div>
        <div className="field full"><button className="button button-primary" type="submit" disabled={saving}>{saving?"Saving enquiry…":"Continue on WhatsApp →"}</button></div>
      </div>
      <p className="form-note">No payment required. This initial website and growth consultation is free.</p>
    </form>
  );
}
