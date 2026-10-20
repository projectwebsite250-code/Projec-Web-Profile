// ".js" agar middleware.test.mjs bisa mengimpornya langsung di Node (paket next tidak punya "exports").
import { NextResponse } from "next/server.js";

// Tautan dari ChatGPT menambahkan ?utm_source=chatgpt.com; buang hanya itu agar URL tetap bersih.
export function middleware(request) {
  const url = request.nextUrl.clone();
  if (!url.searchParams.getAll("utm_source").includes("chatgpt.com")) return NextResponse.next();

  // Filter, bukan delete+append, agar urutan parameter lain tetap sama.
  url.search = new URLSearchParams([...url.searchParams].filter(([k, v]) => !(k === "utm_source" && v === "chatgpt.com"))).toString();
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Tanpa `value`: dengan utm_source ganda matcher tidak cocok; nilai dicek di middleware.
  matcher: [{ source: "/:path*", has: [{ type: "query", key: "utm_source" }] }],
};
