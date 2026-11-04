-- Database website: data master (services, company_profile) + data masuk (inquiries, chat_logs).
-- Aman dijalankan ulang: "if not exists" / "drop ... if exists".
-- Akses:
--   services, company_profile : pengunjung hanya membaca; diubah lewat Table Editor dashboard.
--   inquiries, chat_logs      : tanpa akses publik; hanya server (secret key) yang menyimpan, admin membaca di dashboard.

create table if not exists public.services (
  id          text primary key check (id ~ '^[a-z0-9-]{1,40}$'),
  title       text not null check (char_length(title) between 1 and 80),
  summary     text not null check (char_length(summary) between 1 and 500),
  points      text[] not null default '{}',
  image_src   text,
  image_alt   text,
  image_label text,
  sort_order  int not null default 0,
  -- Foto wajib punya teks alternatif untuk pembaca layar.
  check (image_src is null or image_alt is not null)
);

-- section: kontak (bagian Kontak & footer), profil (Tentang Kami), wilayah (satu kota per baris).
create table if not exists public.company_profile (
  id         bigint generated always as identity primary key,
  section    text not null check (section in ('kontak', 'profil', 'wilayah')),
  label      text not null check (char_length(label) between 1 and 60),
  value      text not null check (char_length(value) between 1 and 1000),
  sort_order int not null default 0,
  unique (section, label)
);

create table if not exists public.inquiries (
  id         bigint generated always as identity primary key,
  nama       text not null check (char_length(nama) between 1 and 100),
  perusahaan text not null check (char_length(perusahaan) between 1 and 150),
  email      text not null check (char_length(email) between 3 and 150),
  telepon    text not null check (char_length(telepon) between 7 and 30),
  -- null = "Kombinasi / lainnya"; kiriman tetap ada walau layanannya dihapus.
  service_id text references public.services (id) on update cascade on delete set null,
  pesan      text not null check (char_length(pesan) between 1 and 2000),
  status     text not null default 'baru' check (status in ('baru', 'dihubungi', 'selesai')),
  created_at timestamptz not null default now()
);

create index if not exists inquiries_service_id_idx on public.inquiries (service_id);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

create table if not exists public.chat_logs (
  id           bigint generated always as identity primary key,
  session_id   uuid not null,
  user_message text not null check (char_length(user_message) <= 1000),
  bot_reply    text not null,
  -- Jenis pelanggaran dari lib/guard.js (bocor/janji/wilayah/kontak); null = jawaban lolos.
  blocked      text,
  -- Kategori gangguan (timeout/http/...); null = model berhasil menjawab.
  error        text,
  model        text not null,
  duration_ms  int not null,
  created_at   timestamptz not null default now()
);

create index if not exists chat_logs_session_id_idx on public.chat_logs (session_id, created_at);
create index if not exists chat_logs_created_at_idx on public.chat_logs (created_at desc);

alter table public.services enable row level security;
alter table public.company_profile enable row level security;
alter table public.inquiries enable row level security;
alter table public.chat_logs enable row level security;

revoke all on table public.services, public.company_profile, public.inquiries, public.chat_logs from anon, authenticated;

grant select on table public.services, public.company_profile to anon, authenticated;
-- Project baru tidak lagi otomatis memberi izin ke service_role, jadi ditulis eksplisit.
grant select on table public.services, public.company_profile to service_role;
grant insert on table public.inquiries, public.chat_logs to service_role;

drop policy if exists "publik baca layanan" on public.services;
create policy "publik baca layanan" on public.services
  for select to anon, authenticated
  using (true);

drop policy if exists "publik baca profil" on public.company_profile;
create policy "publik baca profil" on public.company_profile
  for select to anon, authenticated
  using (true);

-- inquiries & chat_logs sengaja tanpa policy: anon/authenticated tidak punya akses sama sekali.
