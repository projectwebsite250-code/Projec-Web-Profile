// Seluruh teks situs ada di sini agar mudah diganti tanpa menyentuh komponen.
// Nilai dalam [kurung siku] adalah placeholder yang wajib diisi data asli perusahaan.

import { toWaNumber } from "./inquiry.js";

export const brand = {
  name: "PT Bintang Eca Pratama",
  tagline: "Workforce Solutions",
  summary:
    "Penyedia tenaga kerja untuk kebutuhan operasional bisnis dan industri: driver, security, cleaning service, tenaga borongan, dan tenaga kerja tetap.",
};

export const nav = [
  { id: "beranda", label: "Beranda" },
  { id: "tentang", label: "Tentang Kami" },
  { id: "layanan", label: "Layanan" },
  { id: "portofolio", label: "Portofolio" },
  { id: "proses", label: "Proses Kerja" },
  { id: "kontak", label: "Kontak" },
];

// Semua foto disimpan lokal di /public/images. Jika file belum ada, komponen Photo menampilkan panel fallback.
// Foto saat ini adalah foto stok ilustrasi (Unsplash License, sumber di README), bukan dokumentasi perusahaan.
export const images = {
  hero: { src: "/images/hero.jpg", alt: "Dua pekerja berompi keselamatan mengamati area pekerjaan", label: "Tim operasional di lapangan" },
  about: { src: "/images/about.jpg", alt: "Tim berdiskusi di meja rapat kantor", label: "Koordinasi tim" },
};

export const services = [
  {
    id: "driver",
    title: "Driver",
    summary:
      "Tenaga pengemudi untuk kendaraan operasional, distribusi, maupun kebutuhan transportasi perusahaan.",
    points: ["Kendaraan operasional", "Distribusi & logistik", "Antar-jemput karyawan"],
    image: { src: "/images/driver.jpg", alt: "Pengemudi memegang kemudi mobil", label: "Driver profesional" },
  },
  {
    id: "security",
    title: "Security",
    summary:
      "Petugas keamanan untuk menjaga area kerja, fasilitas, dan aset bisnis sesuai kebutuhan lokasi.",
    points: ["Kantor & gedung", "Area industri", "Fasilitas komersial"],
    image: { src: "/images/security.jpg", alt: "Petugas keamanan berompi reflektif berpatroli", label: "Petugas keamanan" },
  },
  {
    id: "cleaning",
    title: "Cleaning Service",
    summary:
      "Petugas kebersihan untuk menjaga area kerja, fasilitas, dan ruang publik tetap bersih, rapi, dan nyaman.",
    points: ["Kantor & gedung", "Area produksi", "Fasilitas umum"],
    image: { src: "/images/cleaning.jpg", alt: "Petugas kebersihan mengepel lantai koridor gedung", label: "Cleaning service" },
  },
  {
    id: "borongan",
    title: "Tenaga Borongan & Proyek",
    summary:
      "Tenaga kerja untuk pekerjaan berbasis proyek atau volume tertentu dengan jangka waktu yang disepakati.",
    points: ["Pekerjaan proyek", "Bongkar muat", "Kebutuhan musiman"],
  },
  {
    id: "tetap",
    title: "Tenaga Kerja Tetap",
    summary:
      "Penyediaan tenaga kerja untuk posisi jangka panjang yang mendukung keberlangsungan operasional harian.",
    points: ["Posisi operasional", "Staf pendukung", "Penempatan jangka panjang"],
    image: { src: "/images/tetap.jpg", alt: "Dua pekerja berdiskusi di lorong gudang", label: "Tenaga kerja tetap" },
  },
];

// Isi hanya dengan proyek nyata perusahaan; selama kosong, section dan menu Portofolio disembunyikan.
// Bentuk: { slug, serviceTitle, title, client_name, location, year, summary,
//           image: { src: "/images/projects/<slug>.jpg", alt, label } }
export const projects = [];

export const process = [
  { title: "Konsultasi kebutuhan", text: "Diskusi awal untuk memahami konteks bisnis, lokasi, dan tujuan operasional Anda." },
  { title: "Identifikasi kebutuhan tenaga kerja", text: "Merumuskan kategori, jumlah, kualifikasi, dan jadwal tenaga kerja yang diperlukan." },
  { title: "Koordinasi dan persiapan", text: "Menyiapkan tenaga kerja serta menyelaraskan teknis penempatan bersama tim Anda." },
  { title: "Penempatan sesuai kesepakatan", text: "Tenaga kerja ditempatkan sesuai ruang lingkup dan ketentuan yang telah disepakati." },
];

export const reasons = [
  { title: "Berangkat dari kebutuhan klien", text: "Setiap penempatan dimulai dari pemahaman atas kondisi dan target operasional Anda, bukan paket yang seragam." },
  { title: "Koordinasi yang terarah", text: "Satu jalur koordinasi untuk membahas kebutuhan, perubahan, dan penyesuaian tenaga kerja." },
  { title: "Lima kategori layanan", text: "Driver, security, cleaning service, tenaga borongan, dan tenaga kerja tetap dapat dikombinasikan sesuai kebutuhan." },
  { title: "Komunikasi dan tindak lanjut", text: "Informasi disampaikan dengan jelas sejak konsultasi hingga tenaga kerja ditempatkan." },
];

// Nilai "[...]" belum tersedia: disembunyikan dari pengunjung dan chatbot sampai diganti data asli.
const filled = (items) => items.filter((i) => !i.value.startsWith("["));

export const contact = filled([
  { label: "Telepon", value: "[Nomor telepon]" },
  // Satu-satunya tempat nomor WhatsApp (format bebas): dipakai daftar kontak, footer, formulir, dan chatbot.
  { label: "WhatsApp", value: "[Nomor WhatsApp]" },
  { label: "Email", value: "[Alamat email]" },
  { label: "Alamat", value: "[Alamat kantor perusahaan]" },
]);

export const profile = filled([
  { label: "Visi", value: "[Visi perusahaan]" },
  { label: "Misi", value: "[Misi perusahaan]" },
  { label: "Legalitas", value: "[Informasi badan usaha & perizinan]" },
]);

// "" bila WhatsApp belum diisi: formulir nonaktif dan chatbot tidak mengarahkan ke formulir.
export const whatsapp = toWaNumber(contact.find((c) => c.label === "WhatsApp")?.value);
export const contactHint = whatsapp ? "formulir kontak (terhubung ke WhatsApp)" : "kanal kontak di halaman ini";

// Lokasi peta di bagian Kontak. Default: nilai "Alamat" di atas; boleh diganti nama tempat persis
// di Google Maps (mis. "PT Bintang Eca Pratama, Jl. ...") atau koordinat "-6.2,106.8". Kosong = peta disembunyikan.
const mapQuery = contact.find((c) => c.label === "Alamat")?.value ?? "";
export const officeMap = mapQuery && {
  // Embed tanpa API key; pengunjung tetap bisa zoom & geser di dalam iframe.
  embed: `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`,
  link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
};
