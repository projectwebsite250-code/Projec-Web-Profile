// Batas panjang sama dengan constraint check di tabel public.inquiries.
export const LIMITS = { nama: 100, perusahaan: 150, kontak: 150, deskripsi: 2000 };
// Bot biasanya mengirim formulir dalam hitungan milidetik setelah halaman dimuat.
export const MIN_FILL_MS = 3000;

// serviceIds: id layanan yang sedang tampil di website; "lainnya" selalu diterima.
// Mengembalikan { data } yang siap disimpan, atau { error } berisi pesan untuk pengunjung.
export function validateInquiry(body, serviceIds, now = Date.now()) {
  if (!body || typeof body !== "object") return { error: "Data formulir tidak valid." };
  // Honeypot: kolom tersembunyi yang hanya diisi bot. Pura-pura berhasil agar bot tidak mencoba lagi.
  if (body.website) return { spam: true };
  if (!(now - Number(body.startedAt) >= MIN_FILL_MS)) return { spam: true };

  const data = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    const value = typeof body[key] === "string" ? body[key].trim() : "";
    if (!value) return { error: "Semua kolom wajib diisi." };
    if (value.length > max) return { error: `Isian terlalu panjang (maksimal ${max} karakter).` };
    data[key] = value;
  }
  if (data.kontak.length < 3) return { error: "Email atau nomor telepon tidak valid." };
  if (body.jenis !== "lainnya" && !serviceIds.includes(body.jenis)) return { error: "Pilih jenis tenaga kerja." };
  data.jenis = body.jenis;
  return { data };
}
