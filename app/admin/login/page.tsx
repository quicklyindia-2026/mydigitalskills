import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteChrome";
import AdminLoginForm from "@/components/AdminLoginForm";

export const metadata: Metadata = { title: "Admin Login | MyDigitalSkills", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <SiteShell>
      <main>
        <section className="section section-soft">
          <div className="container narrow">
            <p className="eyebrow">MyDigitalSkills Backend</p>
            <h1>Secure admin access</h1>
            <p>Login to manage business enquiries, portfolio content, website content, courses, students and LMS tools.</p>
            <AdminLoginForm />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
