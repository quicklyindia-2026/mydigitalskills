import { NextResponse } from "next/server";
import { clearSession } from "@/app/chatgpt-auth";
export async function GET(request: Request) {
  await clearSession();
  const url = new URL(request.url);
  return NextResponse.redirect(new URL(url.searchParams.get("return_to") || "/", url.origin));
}
