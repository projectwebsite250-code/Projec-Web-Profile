import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { CMS_TAG } from "@/lib/cms";

const TABLES = ["services", "projects"];

// Dipanggil Database Webhook Supabase setiap ada INSERT/UPDATE/DELETE di services atau projects,
// sehingga konten yang dibatalkan publikasinya langsung hilang dari halaman.
export async function POST(req) {
  const secret = Buffer.from(process.env.REVALIDATE_SECRET ?? "");
  const given = Buffer.from(req.headers.get("x-revalidate-secret") ?? "");
  if (!secret.length || given.length !== secret.length || !timingSafeEqual(given, secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Payload webhook Supabase berisi { type, table, schema, record, old_record }.
  const body = await req.json().catch(() => null);
  if (body?.schema !== "public" || !TABLES.includes(body?.table)) {
    return Response.json({ error: "Tabel tidak dipantau." }, { status: 400 });
  }
  revalidateTag(CMS_TAG);
  return Response.json({ revalidated: true });
}
