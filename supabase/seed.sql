-- Data awal untuk pengujian. Jalankan SETELAH migration.
--
-- Semua insert memakai "on conflict do nothing": menjalankan ulang tidak menggandakan data dan tidak menimpa
-- perubahan di dashboard. Tetapi baris yang SUDAH DIHAPUS akan dibuat lagi, jadi jangan jalankan ulang setelah
-- data asli masuk.
--
-- services: teks diambil dari isi website saat ini (bukan data klien).

insert into public.services (id, title, summary, points, image_path, image_alt, sort_order, is_published) values
  ('driver', 'Driver',
   'Tenaga pengemudi untuk kendaraan operasional, distribusi, maupun kebutuhan transportasi perusahaan.',
   array['Kendaraan operasional', 'Distribusi & logistik', 'Antar-jemput karyawan'],
   'services/driver.jpg', 'Pengemudi profesional di balik kemudi', 1, true),
  ('security', 'Security',
   'Petugas keamanan untuk menjaga area kerja, fasilitas, dan aset bisnis sesuai kebutuhan lokasi.',
   array['Kantor & gedung', 'Area industri', 'Fasilitas komersial'],
   'services/security.jpg', 'Petugas keamanan berjaga di area kerja', 2, true),
  ('cleaning', 'Cleaning Service',
   'Petugas kebersihan untuk menjaga area kerja, fasilitas, dan ruang publik tetap bersih, rapi, dan nyaman.',
   array['Kantor & gedung', 'Area produksi', 'Fasilitas umum'],
   null, null, 3, true),
  ('borongan', 'Tenaga Borongan & Proyek',
   'Tenaga kerja untuk pekerjaan berbasis proyek atau volume tertentu dengan jangka waktu yang disepakati.',
   array['Pekerjaan proyek', 'Bongkar muat', 'Kebutuhan musiman'],
   null, null, 4, true),
  ('tetap', 'Tenaga Kerja Tetap',
   'Penyediaan tenaga kerja untuk posisi jangka panjang yang mendukung keberlangsungan operasional harian.',
   array['Posisi operasional', 'Staf pendukung', 'Penempatan jangka panjang'],
   'services/tetap.jpg', 'Tenaga kerja di fasilitas operasional', 5, true)
on conflict (id) do nothing;
