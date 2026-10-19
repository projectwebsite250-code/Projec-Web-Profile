import { unstable_cache } from "next/cache";
import { supabase } from "./supabase";
import { services as fallbackServices } from "./content";

export const CMS_TAG = "cms";
const BUCKET = "site-media";

const mediaUrl = (path) => supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
const image = (path, alt, label) => (path ? { src: mediaUrl(path), alt, label } : undefined);

// Di-cache dan diberi tag; /api/revalidate (dipanggil webhook Supabase) menghapus cache ini saat konten berubah.
// Error tidak ikut di-cache, jadi permintaan berikutnya mencoba lagi.
const fetchContent = unstable_cache(
  async () => {
    const [s, p] = await Promise.all([
      supabase.from("services").select("id, title, summary, points, image_path, image_alt")
        .eq("is_published", true).order("sort_order"),
      supabase.from("projects").select("slug, service_id, title, client_name, location, year, summary, cover_path, cover_alt, is_sample")
        .eq("is_published", true).order("sort_order"),
    ]);
    if (s.error) throw s.error;
    if (p.error) throw p.error;
    return { services: s.data, projects: p.data };
  },
  ["cms-content"],
  { tags: [CMS_TAG], revalidate: 300 }
);

// Bentuk data sama dengan lib/content.js sehingga komponen tidak perlu tahu sumbernya.
// Hanya jika Supabase GAGAL dibaca, layanan memakai lib/content.js agar halaman tetap lengkap.
// Hasil kosong (semua layanan dibatalkan publikasinya) tetap dihormati sebagai kosong.
export async function getContent() {
  let rows;
  try {
    rows = await fetchContent();
  } catch (err) {
    console.error("[cms] gagal membaca Supabase, memakai lib/content.js:", err.message);
    return { services: fallbackServices, projects: [] };
  }

  const services = rows.services.map((s) => ({ ...s, image: image(s.image_path, s.image_alt, s.title) }));
  const titles = Object.fromEntries(services.map((s) => [s.id, s.title]));
  const projects = rows.projects.map((p) => ({
    ...p,
    serviceTitle: titles[p.service_id],
    image: image(p.cover_path, p.cover_alt, p.title) ?? { alt: p.title, label: p.title },
  }));
  return { services, projects };
}
