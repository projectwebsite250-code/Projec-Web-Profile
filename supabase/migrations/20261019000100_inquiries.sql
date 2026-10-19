-- Kiriman formulir kontak (app/api/inquiries). Batas panjang sama dengan LIMITS di lib/inquiry.js.
-- Aman dijalankan ulang: "if not exists" / "drop ... if exists".
-- Pengunjung (anon) hanya boleh INSERT kolom isian; tidak bisa membaca, mengubah, atau menghapus.
-- Kiriman dibaca lewat Table Editor dashboard (role postgres, tidak terkena RLS).

create table if not exists public.inquiries (
  id         bigint generated always as identity primary key,
  nama       text not null check (char_length(nama) between 1 and 100),
  perusahaan text not null check (char_length(perusahaan) between 1 and 150),
  kontak     text not null check (char_length(kontak) between 3 and 150),
  -- id layanan atau "lainnya"; bukan foreign key agar kiriman lama tetap ada walau layanannya dihapus
  jenis      text not null check (jenis ~ '^[a-z0-9-]{1,40}$'),
  deskripsi  text not null check (char_length(deskripsi) between 1 and 2000),
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

revoke all on table public.inquiries from anon, authenticated;
grant insert (nama, perusahaan, kontak, jenis, deskripsi) on table public.inquiries to anon, authenticated;

drop policy if exists "publik kirim formulir" on public.inquiries;
-- Isi divalidasi oleh constraint kolom di atas.
create policy "publik kirim formulir" on public.inquiries
  for insert to anon, authenticated
  with check (true);
