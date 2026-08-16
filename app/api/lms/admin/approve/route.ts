import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { enrollments, orders } from "@/db/schema";
import { isLmsAdmin } from "@/lib/lms";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user || !isLmsAdmin(user.email)) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { orderId } = await request.json().catch(() => ({ orderId: "" }));
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, String(orderId))).limit(1);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  await db.update(orders).set({ status: "paid", providerPaymentId: `manual-${Date.now()}` }).where(eq(orders.id, order.id));
  await db.insert(enrollments).values({ id: crypto.randomUUID(), userEmail: order.userEmail, courseId: order.courseId, orderId: order.id, status: "active", progressPercent: 0, enrolledAt: new Date().toISOString() }).onDuplicateKeyUpdate({ set: { status: "active", orderId: order.id } });
  return NextResponse.json({ ok: true });
}
