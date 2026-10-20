// Batas panjang isian formulir kontak.
export const LIMITS = { nama: 100, perusahaan: 150, kontak: 150, deskripsi: 2000 };

// Nomor di lib/content.js boleh ditulis bebas ("0812-3456-7890", "+62 812…"); wa.me butuh "628123456789".
// Placeholder "[Nomor WhatsApp]" menghasilkan "", sehingga formulir nonaktif.
export const toWaNumber = (value = "") => {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
};

export const waLink = (number, { nama, perusahaan, kontak, jenis, deskripsi }) =>
  `https://wa.me/${number}?text=${encodeURIComponent(
    [
      "Halo, saya ingin mendiskusikan kebutuhan tenaga kerja.",
      `Nama: ${nama}`,
      `Perusahaan: ${perusahaan}`,
      `Kontak: ${kontak}`,
      `Jenis tenaga kerja: ${jenis}`,
      `Kebutuhan: ${deskripsi}`,
    ].join("\n")
  )}`;
