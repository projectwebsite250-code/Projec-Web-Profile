// Batas panjang isian formulir kontak; sama dengan constraint di tabel public.inquiries.
export const LIMITS = { nama: 100, perusahaan: 150, email: 150, telepon: 30, pesan: 2000 };
// Bot biasanya mengirim formulir dalam hitungan milidetik setelah halaman dimuat.
export const MIN_FILL_MS = 3000;
export const OTHER_SERVICE = "lainnya";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s()-]{7,30}$/;

// serviceIds: id layanan yang tampil di website. Mengembalikan { data } siap disimpan,
// { error } berisi pesan untuk pengunjung, atau { spam: true } untuk pengiriman oleh bot.
export function validateInquiry(body, serviceIds, now = Date.now()) {
  if (!body || typeof body !== "object") return { error: "Data formulir tidak valid." };
  // Honeypot: kolom tersembunyi yang hanya diisi bot.
  if (body.website) return { spam: true };
  if (!(now - Number(body.startedAt) >= MIN_FILL_MS)) return { spam: true };

  const data = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    const value = typeof body[key] === "string" ? body[key].trim() : "";
    if (!value) return { error: "Semua kolom wajib diisi." };
    if (value.length > max) return { error: `Isian terlalu panjang (maksimal ${max} karakter).` };
    data[key] = value;
  }
  if (!EMAIL.test(data.email)) return { error: "Alamat email tidak valid." };
  if (!PHONE.test(data.telepon)) return { error: "Nomor telepon tidak valid." };
  if (body.jenis !== OTHER_SERVICE && !serviceIds.includes(body.jenis)) return { error: "Pilih jenis tenaga kerja." };
  data.service_id = body.jenis === OTHER_SERVICE ? null : body.jenis;
  return { data };
}

// Nomor di database boleh ditulis bebas ("0812-3456-7890", "+62 812…"); wa.me butuh "628123456789".
// Placeholder "[Nomor WhatsApp]" menghasilkan "", sehingga WhatsApp tidak dibuka.
export const toWaNumber = (value = "") => {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
};

export const waLink = (number, { nama, perusahaan, email, telepon, jenis, pesan }) =>
  `https://wa.me/${number}?text=${encodeURIComponent(
    [
      "Halo, saya ingin mendiskusikan kebutuhan tenaga kerja.",
      `Nama: ${nama}`,
      `Perusahaan: ${perusahaan}`,
      `Email: ${email}`,
      `Telepon: ${telepon}`,
      `Jenis tenaga kerja: ${jenis}`,
      `Kebutuhan: ${pesan}`,
    ].join("\n")
  )}`;
