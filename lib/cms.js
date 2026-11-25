import { unstable_cache } from "next/cache";
import { supabase } from "./supabase";
import { toWaNumber } from "./inquiry";
import { safeImageSrc } from "./image";
import { projects as fallbackProjects, services as fallbackServices, contact, profile, serviceAreas, whatsapp, contactHintFor } from "./content";

const fetchContent = unstable_cache(
  async () => {
    if (!supabase) throw new Error("env Supabase belum diisi");
    // Supabase mati tidak boleh menahan halaman.
    const signal = AbortSignal.timeout(3000);
    const [s, p, j] = await Promise.all([
      supabase.from("services").select("id, title, summary, points, image_src, image_alt, image_label").order("sort_order").abortSignal(signal),
      supabase.from("company_profile").select("section, label, value").order("sort_order").abortSignal(signal),
      supabase.from("projects").select("slug, title, client_name, summary, service_id, location, year, image_src, image_alt").eq("is_published", true).order("sort_order").order("year", { ascending: false }).abortSignal(signal),
    ]);
    if (s.error) throw s.error;
    if (p.error) throw p.error;
    // Tabel kosong (seed belum dijalankan) diperlakukan sama seperti gagal baca.
    if (!s.data.length) throw new Error("tabel services kosong");
    // Portofolio hanya pelengkap: migration belum dijalankan tidak boleh menjatuhkan konten lain.
    if (j.error) console.warn("[cms] portofolio tidak terbaca:", j.error.message.slice(0, 200));
    return { services: s.data, profile: p.data, projects: j.data ?? [] };
  },
  ["cms-content-v2"],
  { revalidate: 300 }
);

const fallback = { services: fallbackServices, projects: fallbackProjects, contact, profile, serviceAreas, whatsapp, contactHint: contactHintFor(whatsapp) };

// Bentuk data sama dengan lib/content.js, sehingga komponen tidak perlu tahu sumbernya.
// Jika Supabase gagal dibaca, website tetap tampil memakai lib/content.js.
export async function getContent() {
  let rows;
  try {
    rows = await fetchContent();
  } catch (err) {
    // warn: sudah ditangani dengan cadangan, jadi bukan "Issue" di overlay Next. Dipotong karena Supabase yang mati bisa membalas satu halaman HTML.
    console.warn("[cms] memakai lib/content.js:", err.message.slice(0, 200));
    return fallback;
  }

  const photo = (src, title) => {
    const safe = safeImageSrc(src, process.env.NEXT_PUBLIC_SUPABASE_URL);
    if (src && !safe) console.warn("[cms] image_src diabaikan:", title);
    return safe;
  };
  const section = (name) => rows.profile.filter((r) => r.section === name);
  const contactRows = section("kontak").map(({ label, value }) => ({ label, value }));
  const wa = toWaNumber(contactRows.find((c) => c.label === "WhatsApp")?.value);
  return {
    // Layanan tanpa foto di database memakai foto lokal dengan id yang sama.
    services: rows.services.map(({ image_src, image_alt, image_label, ...s }) => {
      const src = photo(image_src, s.title);
      return {
        ...s,
        image: src ? { src, alt: image_alt, label: image_label ?? s.title } : fallbackServices.find((f) => f.id === s.id)?.image,
      };
    }),
    projects: rows.projects.map(({ image_src, image_alt, service_id, ...p }) => ({
      ...p,
      serviceTitle: rows.services.find((s) => s.id === service_id)?.title,
      image: { src: photo(image_src, p.title), alt: image_alt ?? p.title, label: p.title },
    })),
    contact: contactRows,
    profile: section("profil").map(({ label, value }) => ({ label, value })),
    serviceAreas: section("wilayah").map((r) => r.value),
    whatsapp: wa,
    contactHint: contactHintFor(wa),
  };
}
