import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt } from "drizzle-orm";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getDb } from "@/db";
import { accounts, sessions } from "@/db/schema";

export type ChatGPTUser = { displayName: string; email: string; fullName: string | null };
const COOKIE = "mds_session";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function createSession(email: string) {
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 86400000);
  await getDb().insert(sessions).values({ token, accountEmail: email, createdAt: now.toISOString(), expiresAt: expires.toISOString() });
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires });
}

export async function clearSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await getDb().delete(sessions).where(eq(sessions.token, token));
  jar.delete(COOKIE);
}

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const now = new Date().toISOString();
  const [row] = await getDb().select({ email: accounts.email, fullName: accounts.fullName })
    .from(sessions).innerJoin(accounts, eq(accounts.email, sessions.accountEmail))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, now))).limit(1);
  return row ? { email: row.email, fullName: row.fullName, displayName: row.fullName || row.email } : null;
}

export async function requireChatGPTUser(returnTo: string) {
  const user = await getChatGPTUser();
  if (user) return user;
  redirect(chatGPTSignInPath(returnTo));
}

export function chatGPTSignInPath(returnTo: string) { return `/login?return_to=${encodeURIComponent(safePath(returnTo))}`; }
export function chatGPTSignOutPath(returnTo = "/") { return `/api/auth/logout?return_to=${encodeURIComponent(safePath(returnTo))}`; }
function safePath(value: string) { return value.startsWith("/") && !value.startsWith("//") ? value : "/"; }
