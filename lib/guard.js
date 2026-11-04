// Pemeriksaan jawaban chatbot sebelum dikirim: prompt saja tidak cukup membuat model patuh.
// Bekerja per klausa dengan memperhatikan negasi/keraguan ("belum", "perlu dipastikan"),
// bukan sekadar melarang kata. Tetap heuristik: lihat keterbatasan di lib/guard.test.mjs.

const NEG = /\b(tidak|belum|tak|bukan|tanpa)\b/i;
const HEDGE = /\b(belum|tidak|tak|perlu (di)?pastikan|dipastikan|memastikan|konfirmasi|dikonfirmasi|diverifikasi|memverifikasi)\b/i;

// Janji tindak lanjut: "kami akan menghubungi", "akan kami proses", "akan segera ditindaklanjuti".
const FOLLOW_UP =
  /\b(kami|tim( kami)?|saya)\b(.{0,40}?)\b(akan|segera|nanti)\b(.{0,25}?)\b(meng?hubungi|hubungi|memproses|proses|menjadwalkan|jadwalkan|mengonfirmasi|konfirmasi|menindaklanjuti|tindak ?lanjuti|mengirim(kan)?|kirimkan|meninjau|tinjau|mengabari|mengabarkan|kabari|membalas|balas|memverifikasi|memastikan|menyusun penawaran|mengomunikasikan|menginformasikan|memberi(kan)? kabar|merespons|menanggapi)\b|\b(kami|tim kami)\s+(akan\s+)?segera\s+\w+|\bakan kami \w+|\bmenunggu (konfirmasi|kabar|informasi|jawaban|balasan|tindak lanjut)\b.{0,20}\b(selanjutnya|berikutnya|dari kami|lebih lanjut)\b|\bakan\b(.{0,15}?)\b(kami|segera)\s+(hubungi|proses|jadwalkan|konfirmasi|tindaklanjuti|kirim(kan)?|tinjau|kabari|balas|dihubungi|diproses|dijadwalkan|dikonfirmasi|ditindaklanjuti|dikirim|ditinjau)\b/i;

// shortcut: daftar kota/provinsi terbatas; nama tempat di luar daftar lolos. Tambah bila perlu.
const PLACES =
  /\b(Jakarta|Surabaya|Bandung|Medan|Semarang|Makassar|Palembang|Tangerang|Bekasi|Depok|Bogor|Batam|Pekanbaru|Malang|Yogyakarta|Jogja|Solo|Surakarta|Denpasar|Bali|Balikpapan|Samarinda|Banjarmasin|Pontianak|Manado|Padang|Lampung|Cirebon|Karawang|Cikarang|Serang|Cilegon|Sidoarjo|Gresik|Kediri|Jember|Mataram|Kupang|Jayapura|Ambon|Jambi|Bengkulu|Aceh|Riau|Banten|Jabodetabek|Jawa (Barat|Tengah|Timur)|Sumatera|Kalimantan|Sulawesi|Papua|seluruh Indonesia|berbagai (kota|lokasi|daerah|wilayah)|semua (kota|wilayah|daerah))\b/gi;
const SERVES = /\b(menyediakan|melayani|tersedia|beroperasi|menjangkau|hadir|termasuk|meliputi|mencakup|bisa|dapat|siap|sanggup)\b/i;

// Mengarahkan pengunjung ke kanal kontak; "ketika kontak sudah tersedia" adalah syarat jujur, bukan arahan.
const DIRECTIVE =
  /\b(hubungi|menghubungi|kontak|sampaikan|kirim|ajukan|mengajukan)\b.{0,40}\b(melalui|lewat|via)\b|\b(saluran|kanal) (resmi|kontak|lain)|\bformulir kontak\b|\b(silakan|mohon|harap)\b.{0,20}\b(hubungi|menghubungi|hubungkan|kunjungi|mengunjungi)\b|\bhalaman kontak\b|\b(jalur|saluran|kanal) (tersebut|itu)\b|\b(fasilitas|pihak|layanan) resmi\b/i;
const CONDITIONAL =
  /\b(ketika|saat|setelah|begitu|jika|bila|apabila)\b.{0,30}\b(tersedia|dibuka|diinformasikan|diumumkan|dipublikasikan)\b|\bakan (dibuka|diinformasikan|diumumkan|dipublikasikan)\b/i;
const CHANNEL_TYPES = [
  [/\b(WhatsApp|WA)\b/i, "WhatsApp"],
  [/\b(email|e-mail|surel)\b/i, "Email"],
  [/\b(telepon|telp|nomor (kantor|HP))\b/i, "Telepon"],
  [/\balamat (kantor|kami)\b/i, "Alamat"],
];
const PHONE = /(\+62|\b0)[\d\s-]{8,}\d/g;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/g;

const clauses = (text) =>
  text
    .split(/(?<=[.!?])\s+|\n+/)
    .flatMap((s) => s.split(/[;,:]|\b(?:namun|tetapi|tapi|sedangkan|atau)\b/i))
    .map((c) => c?.trim())
    .filter(Boolean);
const sentences = (text) => text.split(/(?<=[.!?])\s+|\n+/).filter((s) => s.trim());
const digits = (s) => s.replace(/\D/g, "").replace(/^62/, "0");

// Pengganti seluruh jawaban yang gagal checkReply; diuji lolos checkReply di guard.test.mjs.
export const safeReply = (contact, contactHint) =>
  `Maaf, saya belum bisa menjawab hal itu dengan pasti lewat chat ini. Ketersediaan, wilayah layanan, jadwal, dan biaya perlu dipastikan langsung dengan tim kami${
    contact.length ? ` melalui ${contactHint}` : ", dan informasi kontak resmi belum tersedia saat ini"
  }.`;

/** @returns {null | "bocor" | "janji" | "wilayah" | "kontak"} jenis pelanggaran pertama, atau null bila aman. */
export function checkReply(text, { contact = [], serviceAreas = [], system = "" } = {}) {
  // Model kadang menyalin prompt sistem; baris instruksi yang panjang tidak mungkin muncul di jawaban wajar.
  const norm = text.replace(/\s+/g, " ");
  if (system.split("\n").some((line) => line.length >= 60 && norm.includes(line.replace(/\s+/g, " ").trim()))) return "bocor";

  for (const c of clauses(text)) {
    const m = c.match(FOLLOW_UP);
    // Negasi di antara subjek dan kata kerja ("kami tidak dapat menghubungi") berarti bukan janji.
    if (m && !NEG.test(m[0])) return "janji";
  }

  const verified = serviceAreas.map((a) => a.toLowerCase());
  for (const s of sentences(text)) {
    const hedged = HEDGE.test(s);
    for (const c of clauses(s)) {
      const places = (c.match(PLACES) ?? []).filter((p) => !verified.includes(p.toLowerCase()));
      if (!places.length) continue;
      // Klaim melayani lokasi tanpa negasi, atau menyebut lokasi tanpa keraguan sama sekali.
      if ((SERVES.test(c) && !NEG.test(c)) || !hedged) return "wilayah";
    }
  }

  // Nomor/email yang tidak ada di data resmi selalu dianggap karangan.
  const knownDigits = contact.map((k) => digits(k.value)).filter(Boolean);
  const knownText = contact.map((k) => k.value.toLowerCase());
  if ((text.match(PHONE) ?? []).some((p) => !knownDigits.includes(digits(p)))) return "kontak";
  if ((text.match(EMAIL) ?? []).some((e) => !knownText.includes(e.toLowerCase()))) return "kontak";

  const labels = contact.map((k) => k.label);
  if (!labels.length) {
    for (const c of clauses(text)) {
      if (DIRECTIVE.test(c) && !NEG.test(c) && !CONDITIONAL.test(c)) return "kontak";
    }
  }
  // Jenis kanal yang tidak ada di data resmi; negasi dicek per kalimat ("..., termasuk WhatsApp, belum tersedia").
  for (const s of sentences(text)) {
    if (NEG.test(s) || CONDITIONAL.test(s)) continue;
    if (CHANNEL_TYPES.some(([re, label]) => re.test(s) && !labels.includes(label))) return "kontak";
  }
  return null;
}
