"use client";

import { FormEvent, useEffect, useState } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function track(event: string, parameters: Record<string, string> = {}) {
  window.fbq?.("trackCustom", event, parameters);
  window.gtag?.("event", event, parameters);
}

export function TrackedWhatsAppLink({ className = "", children, placement }: { className?: string; children: React.ReactNode; placement: string }) {
  const href = "https://wa.me/918128729003?text=" + encodeURIComponent("Hi Lambodar, I want a free business growth audit for my business.");
  return <a className={className} href={href} target="_blank" rel="noreferrer" onClick={() => track("WhatsApp_Click", { placement })}>{children}</a>;
}

export function LandingTracker() {
  useEffect(() => {
    track("ViewContent", { page: "business_growth_audit" });

    const root = document.querySelector<HTMLElement>(".growth-lp");
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>(
      ".growth-section, .final-cta, .growth-heading, .growth-section h2, .growth-section h3, .growth-section img, .problem-option, .services-ecosystem article, .portfolio-grid article, .journey-timeline div, .strategy-path > div, .next-steps article, .audit-checks span, .growth-faq-list details"
    );
    targets.forEach((target, index) => {
      target.classList.add("motion-ready");
      target.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -8%", threshold: 0.12 }
    );
    targets.forEach((target) => observer.observe(target));

    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        root.style.setProperty("--page-progress", `${max > 0 ? (window.scrollY / max) * 100 : 0}%`);
      });
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div className="growth-scroll-progress" aria-hidden="true" />;
}

const businessProblems = [
  ["↘", "Low Sales"], ["◎", "Not Getting Leads"], ["₹", "Ads, No Results"], ["G", "Poor Google Visibility"],
  ["#", "Social Media Not Growing"], ["↗", "Website Not Converting"], ["?", "No Clear Strategy"], ["⚡", "Competitors Growing Faster"],
] as const;

export function ProblemSelector() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(problem: string) {
    setSelected((current) => {
      const active = current.includes(problem);
      track("Problem_Select", { problem, action: active ? "removed" : "selected" });
      return active ? current.filter((item) => item !== problem) : [...current, problem];
    });
  }

  return (
    <div className="problem-selector">
      <div className="problem-question"><span>?</span><div><b>Select what sounds familiar</b><small>Tap one or more business challenges</small></div></div>
      <div className="problem-grid" role="group" aria-label="Select your current business challenges">
        {businessProblems.map(([icon, title]) => {
          const active = selected.includes(title);
          return <button type="button" className="problem-option" aria-pressed={active} onClick={() => toggle(title)} key={title}><span className="problem-icon">{icon}</span><strong>{title}</strong><i>{active ? "✓" : "+"}</i></button>;
        })}
      </div>
      <div className="problem-selection-summary"><div><strong>{selected.length ? `${selected.length} challenge${selected.length > 1 ? "s" : ""} selected` : "Facing any of these?"}</strong><span>{selected.length ? "Let’s identify the right next move." : "Choose the problems affecting your growth."}</span></div><a className="growth-primary" href="#audit">ANALYSE MY BUSINESS →</a></div>
    </div>
  );
}

export function GrowthAuditForm() {
  const [saving, setSaving] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const challenge = String(data.get("challenge") || "Not sure — Need advice");
    setSaving(true);
    setError("");

    const payload = {
      name: data.get("name"),
      phone: data.get("phone"),
      email: "",
      business: `${data.get("business")} · ${data.get("category")}`,
      service: challenge,
      source: "business-growth-audit-landing-page",
      message: `Website / Instagram: ${data.get("presence") || "Not supplied"} | Biggest challenge: ${challenge}`,
    };

    try {
      const response = await fetch("/api/admin/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Could not save enquiry");
    } catch {
      setError("Details save nahi ho paaye. Please WhatsApp button se direct connect karein.");
      setSaving(false);
      return;
    }

    track("Lead", { source: "growth_audit_form", challenge });
    track("Form_Submit", { source: "growth_audit_form" });
    const message = `Hi Lambodar, I submitted my free business growth audit request.\n\nName: ${data.get("name")}\nBusiness: ${data.get("business")}\nCategory: ${data.get("category")}\nChallenge: ${challenge}`;
    setSaving(false);
    window.open(`https://wa.me/918128729003?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="growth-form" onSubmit={submit} onFocus={() => { if (!started) { setStarted(true); track("Form_Start", { source: "growth_audit_form" }); } }}>
      <div className="growth-form-heading"><span>FREE · NO OBLIGATION</span><h2>Show me your business.</h2><p>I’ll help you identify the strongest next growth move.</p></div>
      <div className="growth-form-grid">
        <label><span>Your Name *</span><input name="name" required autoComplete="name" placeholder="Full name" /></label>
        <label><span>Business Name *</span><input name="business" required placeholder="Brand / company" /></label>
        <label><span>Phone / WhatsApp *</span><input name="phone" required inputMode="tel" autoComplete="tel" placeholder="WhatsApp number" /></label>
        <label><span>Business Category *</span><input name="category" required placeholder="Restaurant, real estate…" /></label>
        <label className="full"><span>Website / Instagram (Optional)</span><input name="presence" placeholder="Link or username" /></label>
        <label className="full"><span>What’s your biggest challenge right now? *</span><select name="challenge" required defaultValue=""><option value="" disabled>Select your challenge</option><option>Need More Leads</option><option>Need More Sales</option><option>Meta Ads</option><option>Social Media</option><option>Google Visibility</option><option>Website</option><option>Branding</option><option>Complete Growth Strategy</option><option>Not Sure — Need Advice</option></select></label>
      </div>
      {error && <p className="growth-form-error">{error}</p>}
      <button className="growth-primary growth-form-submit" disabled={saving} type="submit">{saving ? "Submitting…" : "SHOW ME HOW TO GROW →"}</button>
      <small>Direct discussion · Your information stays private · No obligation</small>
    </form>
  );
}
