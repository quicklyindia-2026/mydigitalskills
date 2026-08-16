import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { accounts } from "@/db/schema";
import { createSession, hashPassword, verifyPassword } from "@/app/chatgpt-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const fullName = String(body.fullName || "").trim();
  const mode = body.mode === "signup" ? "signup" : "login";
  if (!email || password.length < 8) return NextResponse.json({ error: "Valid email aur minimum 8-character password required hai." }, { status: 400 });
  const db = getDb();
  const [existing] = await db.select().from(accounts).where(eq(accounts.email, email)).limit(1);
  if (mode === "signup") {
    if (!fullName) return NextResponse.json({ error: "Full name required hai." }, { status: 400 });
    if (existing) return NextResponse.json({ error: "Account already exists. Please login." }, { status: 409 });
    await db.insert(accounts).values({ email, fullName, passwordHash: hashPassword(password), role: "student", createdAt: new Date().toISOString() });
  } else {
    const adminEmail = (process.env.ADMIN_EMAIL || "connect@mydigitalskills.in").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "";
    if (email === adminEmail && adminPassword && password === adminPassword && !existing) {
      await db.insert(accounts).values({ email, fullName: "Lambodar Patra", passwordHash: hashPassword(password), role: "admin", createdAt: new Date().toISOString() });
    } else if (!existing || !verifyPassword(password, existing.passwordHash)) {
      return NextResponse.json({ error: "Email ya password incorrect hai." }, { status: 401 });
    }
  }
  await createSession(email);
  return NextResponse.json({ ok: true, redirect: email === (process.env.ADMIN_EMAIL || "connect@mydigitalskills.in").toLowerCase() ? "/admin/lms" : "/student/dashboard" });
}
