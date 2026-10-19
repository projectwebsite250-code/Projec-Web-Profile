import { supabase } from "@/lib/supabase";
import { validateInquiry } from "@/lib/inquiry";
import { getContent } from "@/lib/cms";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
// shortcut: hitungan per IP disimpan di memori satu instance server; di serverless/multi-instance batas ini longgar. Pindahkan ke Upstash/Vercel KV jika spam berlanjut.
const hits = new Map();

function rateLimited(ip, now) {
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  return ++entry.count > MAX_PER_WINDOW;
}

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const { services } = await getContent();
  const result = validateInquiry(body, services.map((s) => s.id));
  if (result.spam) return Response.json({ ok: true });
  if (result.error) return Response.json({ error: result.error }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip, Date.now())) {
    return Response.json({ error: "Terlalu banyak permintaan. Silakan coba lagi beberapa menit lagi." }, { status: 429 });
  }

  // Tanpa .select(): role anon hanya punya izin INSERT, tidak boleh membaca balik barisnya.
  const { error } = await supabase.from("inquiries").insert(result.data);
  if (error) {
    console.error("[api/inquiries]", error);
    return Response.json({ error: "Gagal mengirim formulir. Silakan coba lagi atau hubungi kami langsung." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
