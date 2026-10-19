-- Data awal untuk pengujian. Jalankan SETELAH migration.
--
-- Semua insert memakai "on conflict do nothing": menjalankan ulang tidak menggandakan data dan tidak menimpa
-- perubahan di dashboard. Tetapi baris yang SUDAH DIHAPUS akan dibuat lagi, jadi jangan jalankan ulang setelah
-- data asli masuk.
--
-- services: teks diambil dari isi website saat ini (bukan data klien).
-- projects: SEMUA DATA DUMMY/FIKTIF (slug berawalan "dummy-", is_sample = true). Bukan proyek nyata.
--   Hapus semua dummy: delete from public.projects where slug like 'dummy-%';

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

insert into public.projects
  (slug, service_id, title, client_name, location, year, summary, cover_path, cover_alt, is_sample, sort_order, is_published)
values
  ('dummy-driver-distribusi', 'driver', 'Driver distribusi gudang regional', 'Klien Contoh A', 'Bekasi', 2025,
   'Contoh ilustrasi: 12 driver truk engkel untuk rute distribusi harian dari gudang ke 40 toko ritel.',
   'projects/dummy-driver-distribusi.jpg', 'Truk distribusi di area bongkar gudang', true, 1, true),
  ('dummy-security-kawasan', 'security', 'Pengamanan kawasan pergudangan', 'Klien Contoh B', 'Cikarang', 2024,
   'Contoh ilustrasi: 18 petugas keamanan dalam tiga shift untuk pos gerbang dan patroli area gudang.',
   'projects/dummy-security-kawasan.jpg', 'Petugas keamanan di pos gerbang kawasan', true, 2, true),
  ('dummy-cleaning-gedung', 'cleaning', 'Kebersihan gedung perkantoran 12 lantai', 'Klien Contoh C', 'Jakarta Selatan', 2025,
   'Contoh ilustrasi: 24 petugas kebersihan untuk area kantor, lobi, dan toilet dengan jadwal pagi dan sore.',
   'projects/dummy-cleaning-gedung.jpg', 'Petugas kebersihan merapikan lobi gedung', true, 3, true),
  ('dummy-borongan-musiman', 'borongan', 'Tenaga bongkar muat musim Lebaran', 'Klien Contoh D', 'Karawang', 2024,
   'Contoh ilustrasi: 30 tenaga bongkar muat selama enam minggu untuk menangani lonjakan pengiriman musiman.',
   null, null, true, 4, true),
  -- Sengaja TIDAK dipublikasikan: untuk menguji bahwa RLS menyembunyikannya dari website.
  ('dummy-tidak-terbit', 'tetap', 'Proyek uji yang tidak dipublikasikan', 'Klien Contoh E', 'Bandung', 2025,
   'Contoh ilustrasi: baris ini tidak boleh pernah tampil di website.',
   null, null, true, 5, false)
on conflict (slug) do nothing;
