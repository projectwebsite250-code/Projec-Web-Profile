// Seluruh teks situs ada di sini agar mudah diganti tanpa menyentuh komponen.
// Nilai dalam [kurung siku] adalah placeholder yang wajib diisi data asli perusahaan.

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

// Foto disimpan lokal di /public/images. Jika file belum ada, komponen Photo menampilkan panel fallback.
export const images = {
  hero: { src: "/images/hero.jpg", alt: "Tenaga kerja profesional di lingkungan operasional", label: "Tim operasional di lapangan" },
  about: { src: "/images/about.jpg", alt: "Koordinasi tim operasional", label: "Koordinasi tim" },
};

export const services = [
  {
    id: "driver",
    title: "Driver",
    summary:
      "Tenaga pengemudi untuk kendaraan operasional, distribusi, maupun kebutuhan transportasi perusahaan.",
    points: ["Kendaraan operasional", "Distribusi & logistik", "Antar-jemput karyawan"],
    image: { src: "/images/driver.jpg", alt: "Pengemudi profesional di balik kemudi", label: "Driver profesional" },
  },
  {
    id: "security",
    title: "Security",
    summary:
      "Petugas keamanan untuk menjaga area kerja, fasilitas, dan aset bisnis sesuai kebutuhan lokasi.",
    points: ["Kantor & gedung", "Area industri", "Fasilitas komersial"],
    image: { src: "/images/security.jpg", alt: "Petugas keamanan berjaga di area kerja", label: "Petugas keamanan" },
  },
  {
    id: "cleaning",
    title: "Cleaning Service",
    summary:
      "Petugas kebersihan untuk menjaga area kerja, fasilitas, dan ruang publik tetap bersih, rapi, dan nyaman.",
    points: ["Kantor & gedung", "Area produksi", "Fasilitas umum"],
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
    image: { src: "/images/tetap.jpg", alt: "Tenaga kerja di fasilitas operasional", label: "Tenaga kerja tetap" },
  },
];

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

export const contact = [
  { label: "Telepon", value: "[Nomor telepon]" },
  { label: "WhatsApp", value: "[Nomor WhatsApp]" },
  { label: "Email", value: "[Alamat email]" },
  { label: "Alamat", value: "[Alamat kantor perusahaan]" },
];
