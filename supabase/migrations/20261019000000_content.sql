-- Konten website (layanan & portofolio) + bucket foto.
-- Aman dijalankan ulang: semua objek memakai "if not exists" / "on conflict" / "drop ... if exists".
-- Konten dikelola lewat Table Editor dashboard (role postgres, tidak terkena RLS); pengunjung hanya bisa membaca.

create table if not exists public.services (
  id           text primary key check (id ~ '^[a-z0-9-]{1,40}$'),
  title        text not null check (char_length(title) between 1 and 80),
  summary      text not null check (char_length(summary) between 1 and 500),
  points       text[] not null default '{}' check (cardinality(points) <= 6),
  image_path   text check (char_length(image_path) <= 200),
  image_alt    text check (char_length(image_alt) <= 200),
  sort_order   int not null default 0,
  is_published boolean not null default false,
  -- Foto wajib punya teks alternatif untuk pembaca layar
  check (image_path is null or image_alt is not null)
);

create table if not exists public.projects (
  id           bigint generated always as identity primary key,
  slug         text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  service_id   text not null references public.services (id) on update cascade on delete restrict,
  title        text not null check (char_length(title) between 1 and 120),
  client_name  text not null check (char_length(client_name) between 1 and 120),
  location     text check (char_length(location) <= 120),
  year         smallint check (year between 2000 and 2100),
  summary      text not null check (char_length(summary) between 1 and 600),
  cover_path   text check (char_length(cover_path) <= 200),
  cover_alt    text check (char_length(cover_alt) <= 200),
  -- true = data contoh/dummy; website menampilkan label "Contoh" agar tidak dianggap proyek nyata
  is_sample    boolean not null default false,
  sort_order   int not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  check (cover_path is null or cover_alt is not null)
);

create index if not exists projects_service_id_idx on public.projects (service_id);

-- Akses: pengunjung hanya SELECT baris yang dipublikasikan. Tidak ada INSERT/UPDATE/DELETE untuk publik.
alter table public.services enable row level security;
alter table public.projects enable row level security;

revoke all on table public.services, public.projects from anon, authenticated;
grant select on table public.services, public.projects to anon, authenticated;

drop policy if exists "publik baca layanan terbit" on public.services;
create policy "publik baca layanan terbit" on public.services
  for select to anon, authenticated
  using (is_published);

drop policy if exists "publik baca proyek terbit" on public.projects;
create policy "publik baca proyek terbit" on public.projects
  for select to anon, authenticated
  using (is_published);

-- Bucket publik: file bisa dibuka lewat URL-nya, tapi daftar file tidak bisa dilihat dan publik tidak bisa
-- mengunggah/mengubah/menghapus karena tidak ada policy di storage.objects untuk anon/authenticated.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
