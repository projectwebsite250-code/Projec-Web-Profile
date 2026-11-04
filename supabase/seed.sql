-- Data awal. Jalankan setelah migration. Aman dijalankan ulang, tapi menimpa isi baris yang sama.
-- PERHATIAN: telepon, email, alamat, wilayah, visi, misi, dan legalitas di bawah adalah DATA CONTOH
-- untuk keperluan tugas, bukan data asli perusahaan. Ganti lewat Table Editor sebelum website dipakai sungguhan.
-- WhatsApp sengaja tidak diisi: formulir mengirim data calon klien ke nomor itu, jadi harus nomor asli.

insert into public.services (id, title, summary, points, image_src, image_alt, image_label, sort_order) values
  ('driver', 'Driver',
   'Tenaga pengemudi untuk kendaraan operasional, distribusi, maupun kebutuhan transportasi perusahaan.',
   array['Kendaraan operasional', 'Distribusi & logistik', 'Antar-jemput karyawan'],
   '/images/driver.jpg', 'Pengemudi memegang kemudi mobil', 'Driver profesional', 1),
  ('security', 'Security',
   'Petugas keamanan untuk menjaga area kerja, fasilitas, dan aset bisnis sesuai kebutuhan lokasi.',
   array['Kantor & gedung', 'Area industri', 'Fasilitas komersial'],
   '/images/security.jpg', 'Petugas keamanan berompi reflektif berpatroli', 'Petugas keamanan', 2),
  ('cleaning', 'Cleaning Service',
   'Petugas kebersihan untuk menjaga area kerja, fasilitas, dan ruang publik tetap bersih, rapi, dan nyaman.',
   array['Kantor & gedung', 'Area produksi', 'Fasilitas umum'],
   '/images/cleaning.jpg', 'Petugas kebersihan mengepel lantai koridor gedung', 'Cleaning service', 3),
  ('borongan', 'Tenaga Borongan & Proyek',
   'Tenaga kerja untuk pekerjaan berbasis proyek atau volume tertentu dengan jangka waktu yang disepakati.',
   array['Pekerjaan proyek', 'Bongkar muat', 'Kebutuhan musiman'],
   null, null, null, 4)
on conflict (id) do update set
  title = excluded.title, summary = excluded.summary, points = excluded.points,
  image_src = excluded.image_src, image_alt = excluded.image_alt, image_label = excluded.image_label,
  sort_order = excluded.sort_order;

insert into public.company_profile (section, label, value, sort_order) values
  ('kontak', 'Telepon', '021-0000-0000', 1),
  ('kontak', 'Email', 'info@example.com', 2),
  ('kontak', 'Alamat', 'Jl. Contoh Raya No. 1, Jakarta Pusat (alamat contoh)', 3),
  ('profil', 'Visi', 'Menjadi mitra penyedia tenaga kerja yang andal dan dipercaya untuk mendukung operasional bisnis dan industri.', 1),
  ('profil', 'Misi', 'Memahami kebutuhan setiap klien, menyiapkan tenaga kerja yang sesuai, dan menjaga koordinasi yang jelas dari konsultasi hingga penempatan.', 2),
  ('profil', 'Legalitas', 'Perseroan Terbatas (PT). NIB 0000000000000 (data contoh, belum diverifikasi).', 3),
  ('wilayah', 'Jakarta', 'Jakarta', 1),
  ('wilayah', 'Bogor', 'Bogor', 2),
  ('wilayah', 'Depok', 'Depok', 3),
  ('wilayah', 'Tangerang', 'Tangerang', 4),
  ('wilayah', 'Bekasi', 'Bekasi', 5)
on conflict (section, label) do update set
  value = excluded.value, sort_order = excluded.sort_order;
