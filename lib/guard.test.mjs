// Jalankan: node --test lib/guard.test.mjs
// Keterbatasan yang diketahui (sengaja didokumentasikan, bukan diuji sebagai "lolos"):
// - Daftar kota terbatas; nama tempat di luar daftar tidak dikenali sebagai klaim wilayah.
// - Janji dengan kata kerja di luar daftar ("kami akan mengurus semuanya") lolos.
// - Kalimat berisi keraguan bisa menyamarkan klaim wilayah tanpa kata kerja layanan.
// - Klausa dengan negasi apa pun dilewati pemeriksaan kanal kontak.
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkReply, safeReply } from "./guard.js";

const none = { contact: [], serviceAreas: [] };
const withWa = { contact: [{ label: "WhatsApp", value: "0812-3456-7890" }], serviceAreas: [] };

test("menolak janji tindak lanjut", () => {
  for (const t of [
    "Kami akan segera menghubungi Anda besok.",
    "Tim kami akan memproses permintaan Anda setelah konfirmasi lebih lanjut.",
    "Permintaan Anda akan segera ditindaklanjuti.",
    "Detail penawaran akan kami kirimkan.",
    "Kami akan meninjau kebutuhan Anda dan mengonfirmasi kembali.",
    "Silakan beri tahu kapan, nanti kami jadwalkan. Kami akan menjadwalkan sesi konsultasi.",
    // Lolos di preview gpt-oss-20b sebelum pola "segera" ditambahkan.
    "Kami akan segera membantu setelah memperoleh konfirmasi.",
    "Silakan berikan keterangan singkat dan kami akan mengomunikasikan langkah selanjutnya setelah proses internal selesai.",
    "Konfirmasi ketersediaan akan kami pastikan bersama tim setelah diskusi awal.",
    "Jika Anda ingin melanjutkan proses konsultasi, silakan menunggu konfirmasi selanjutnya.",
  ]) assert.equal(checkReply(t, none), "janji", t);
});

test("menolak klaim wilayah yang belum terverifikasi", () => {
  for (const t of [
    "Kami menyediakan petugas keamanan di berbagai lokasi, termasuk Surabaya.",
    "Ya, kami melayani Surabaya, namun jadwal perlu dipastikan.",
    "Tenaga security tersedia di Jakarta dan Bandung.",
    "Kami beroperasi di seluruh Indonesia.",
    "Penempatan di Surabaya bisa dilakukan minggu depan.",
  ]) assert.equal(checkReply(t, none), "wilayah", t);
});

test("menolak arahan ke kanal kontak yang belum ada", () => {
  for (const t of [
    "Silakan hubungi tim kami melalui saluran resmi yang tersedia.",
    "Anda bisa menunggu pengumuman resmi dari perusahaan melalui saluran resmi mereka.",
    "Hubungi kami lewat WhatsApp untuk detailnya.",
    "Silakan kirim email ke info@contoh.co.id.",
    // Lolos di preview gpt-oss-20b sebelum pola arahan tanpa "melalui" ditambahkan.
    "Silakan hubungi tim kami untuk memverifikasi detail kebutuhan Anda.",
    "Silakan kunjungi halaman kontak resmi PT Bintang Eca Pratama di website kami.",
    "Karena kontak belum tersedia di sini, mohon hubungkan ke pihak kami di fasilitas resmi PT Bintang Eca Pratama.",
  ]) assert.equal(checkReply(t, none), "kontak", t);
});

test("menolak nomor/email karangan meski kontak resmi ada", () => {
  assert.equal(checkReply("Hubungi kami di 0811-2222-3333.", withWa), "kontak");
  assert.equal(checkReply("Kirim ke sales@bep.co.id ya.", withWa), "kontak");
  assert.equal(checkReply("Hubungi kami melalui email untuk detailnya.", withWa), "kontak");
});

test("meloloskan jawaban yang benar", () => {
  for (const t of [
    "Bisa. Setiap kerja sama diawali konsultasi kebutuhan untuk memahami konteks bisnis, lokasi, dan tujuan operasional Anda.",
    "Ya, layanan Driver dan Security dapat digabungkan dalam satu kerja sama sesuai kebutuhan Anda.",
    "Informasi nomor WhatsApp dan detail kontak lainnya belum tersedia saat ini.",
    "Maaf, saya tidak dapat menghubungi Anda atau menjadwalkan panggilan dari sini. Informasi kontak perusahaan juga belum tersedia saat ini.",
    "Ketersediaan tenaga kerja untuk lokasi Surabaya serta jadwal mulai minggu depan perlu dipastikan dengan tim.",
    "Untuk menyiapkan 50 tenaga security di Surabaya mulai minggu depan, kami memerlukan konfirmasi lebih lanjut mengenai detail kebutuhan.",
    "Layanan di Surabaya belum dapat kami pastikan saat ini.",
    "Saya akan membantu menjelaskan layanan yang tersedia.",
    "Pada tahap ini kami akan berdiskusi untuk memahami konteks bisnis, lokasi, dan tujuan operasional Anda.",
    "Ketersediaan tenaga kerja untuk durasi 2 minggu perlu dipastikan terlebih dahulu melalui konsultasi dengan tim kami.",
    "Informasi kontak resmi kami, termasuk nomor WhatsApp, belum tersedia untuk disampaikan melalui kanal ini.",
    "Detail tersebut perlu diverifikasi langsung dengan tim melalui kanal resmi ketika tersedia.",
    // Arahan bersyarat ke kanal yang belum ada itu jujur, bukan klaim kanal sudah ada.
    "Anda bisa menanyakan langsung ke tim kami saat saluran resmi sudah dibuka.",
    "Anda bisa mengajukan permintaan melalui saluran komunikasi perusahaan yang akan diinformasikan nanti.",
    "Proses kami: konsultasi kebutuhan, identifikasi tenaga kerja, koordinasi, lalu penempatan sesuai kesepakatan.",
  ]) assert.equal(checkReply(t, none), null, t);
});

test("menolak jawaban yang menyalin prompt sistem", () => {
  const system = "Anda adalah asisten virtual di website PT Contoh, perusahaan penyedia tenaga kerja.\nJawab dalam bahasa Indonesia yang sopan, singkat, dan jelas (maksimal 3 paragraf pendek).";
  const leaked = "Proses standar kami dimulai dari konsultasi.ganza asisten virtual di website PT Contoh, perusahaan penyedia tenaga kerja.\nJawab dalam bahasa Indonesia yang sopan, singkat, dan jelas (maksimal 3 paragraf pendek).";
  assert.equal(checkReply(leaked, { ...none, system }), "bocor");
  assert.equal(checkReply("Bisa. Setiap kerja sama diawali konsultasi kebutuhan.", { ...none, system }), null);
});

test("jawaban pengganti selalu lolos pemeriksaan", () => {
  assert.equal(checkReply(safeReply([], "kanal kontak di halaman ini"), none), null);
  assert.equal(checkReply(safeReply(withWa.contact, "formulir kontak (terhubung ke WhatsApp)"), withWa), null);
});

test("meloloskan kontak dan wilayah yang memang terverifikasi", () => {
  assert.equal(checkReply("Silakan hubungi kami melalui WhatsApp di 0812 3456 7890.", withWa), null);
  assert.equal(checkReply("Kami melayani Surabaya.", { contact: [], serviceAreas: ["Surabaya"] }), null);
});
