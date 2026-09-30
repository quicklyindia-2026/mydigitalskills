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

  if (!email || password.length < 8) {
    return NextResponse.json({ error: "Valid email and minimum 8-character password required." }, { status: 400 });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "connect@mydigitalskills.in").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const db = getDb();
  const [existing] = await db.select().from(accounts).where(eq(accounts.email, email)).limit(1);

  if (mode === "signup") {
    if (email === adminEmail) {
      return NextResponse.json({ error: "Admin account cannot be created from public signup." }, { status: 403 });
    }
    if (!fullName) return NextResponse.json({ error: "Full name required." }, { status: 400 });
    if (existing) return NextResponse.json({ error: "Account already exists. Please login." }, { status: 409 });
    await db.insert(accounts).values({ email, fullName, passwordHash: hashPassword(password), role: "student", createdAt: new Date().toISOString() });
    await createSession(email);
    return NextResponse.json({ ok: true, redirect: "/student/dashboard" });
  }

  if (email === adminEmail) {
    if (!adminPassword) {
      return NextResponse.json({ error: "Admin password is not configured on the server yet." }, { status: 503 });
    }
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    if (!existing) {
      await db.insert(accounts).values({ email, fullName: "Lambodar Patra", passwordHash: hashPassword(password), role: "admin", createdAt: new Date().toISOString() });
    } else if (existing.role !== "admin" || !verifyPassword(password, existing.passwordHash)) {
      await db.update(accounts).set({ fullName: "Lambodar Patra", passwordHash: hashPassword(password), role: "admin" }).where(eq(accounts.email, email));
    }

    await createSession(email);
    return NextResponse.json({ ok: true, redirect: "/admin/lms" });
  }

  if (!existing || existing.role !== "student" || !verifyPassword(password, existing.passwordHash)) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }

  await createSession(email);
  return NextResponse.json({ ok: true, redirect: "/student/dashboard" });
}
