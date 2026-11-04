import { unstable_cache } from "next/cache";
import { supabase } from "./supabase";
import { toWaNumber } from "./inquiry";
import { services as fallbackServices, contact, profile, serviceAreas, whatsapp, contactHintFor } from "./content";

const fetchContent = unstable_cache(
  async () => {
    if (!supabase) throw new Error("env Supabase belum diisi");
    const [s, p] = await Promise.all([
      supabase.from("services").select("id, title, summary, points, image_src, image_alt, image_label").order("sort_order"),
      supabase.from("company_profile").select("section, label, value").order("sort_order"),
    ]);
    if (s.error) throw s.error;
    if (p.error) throw p.error;
    // Tabel kosong (seed belum dijalankan) diperlakukan sama seperti gagal baca.
    if (!s.data.length) throw new Error("tabel services kosong");
    return { services: s.data, profile: p.data };
  },
  ["cms-content"],
  { revalidate: 300 }
);

const fallback = { services: fallbackServices, contact, profile, serviceAreas, whatsapp, contactHint: contactHintFor(whatsapp) };

// Bentuk data sama dengan lib/content.js, sehingga komponen tidak perlu tahu sumbernya.
// Jika Supabase gagal dibaca, website tetap tampil memakai lib/content.js.
export async function getContent() {
  let rows;
  try {
    rows = await fetchContent();
  } catch (err) {
    console.error("[cms] memakai lib/content.js:", err.message);
    return fallback;
  }

  const section = (name) => rows.profile.filter((r) => r.section === name);
  const contactRows = section("kontak").map(({ label, value }) => ({ label, value }));
  const wa = toWaNumber(contactRows.find((c) => c.label === "WhatsApp")?.value);
  return {
    services: rows.services.map(({ image_src, image_alt, image_label, ...s }) => ({
      ...s,
      ...(image_src && { image: { src: image_src, alt: image_alt, label: image_label ?? s.title } }),
    })),
    contact: contactRows,
    profile: section("profil").map(({ label, value }) => ({ label, value })),
    serviceAreas: section("wilayah").map((r) => r.value),
    whatsapp: wa,
    contactHint: contactHintFor(wa),
  };
}
