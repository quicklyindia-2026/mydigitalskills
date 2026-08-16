import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { courses } from "@/db/schema";
import { isLmsAdmin } from "@/lib/lms";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user || !isLmsAdmin(user.email)) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  const slug = String(body.slug ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (!title || !slug) return NextResponse.json({ error: "Title and slug are required." }, { status: 400 });
  await getDb().insert(courses).values({ id: crypto.randomUUID(), slug, title, description: String(body.description ?? ""), level: String(body.level ?? "Beginner"), coverImage: String(body.coverImage || "/images/learning-digital-skills.webp"), ebookUrl: String(body.ebookUrl || "") || null, priceInr: Math.max(0, Number(body.priceInr) || 0), status: body.status === "published" ? "published" : "draft", createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
