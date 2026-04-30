import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;

  // ===== Block method aneh =====
  if (!["GET", "HEAD"].includes(req.method)) {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  // ===== Block bot sederhana =====
  const ua = req.headers.get("user-agent") || "";
  const blocked = ["curl", "wget", "python", "bot"];

  if (blocked.some((b) => ua.toLowerCase().includes(b))) {
    return new NextResponse("Blocked", { status: 403 });
  }

  // ===== Protect API only =====
  if (url.pathname.startsWith("/api")) {
    const origin = req.headers.get("origin") || "";
    const site = process.env.SITE_URL;

    if (site && !origin.includes(site)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return NextResponse.next();
}
