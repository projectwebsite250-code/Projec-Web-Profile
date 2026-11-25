-- Portofolio + bucket foto. Jalankan setelah 20261104000000_database.sql. Aman dijalankan ulang.
-- Diubah lewat Table Editor; pengunjung hanya melihat baris dengan is_published = true.

create table if not exists public.projects (
  slug         text primary key check (slug ~ '^[a-z0-9-]{1,60}$'),
  title        text not null check (char_length(title) between 1 and 120),
  client_name  text not null check (char_length(client_name) between 1 and 120),
  summary      text not null check (char_length(summary) between 1 and 500),
  service_id   text references public.services (id) on update cascade on delete set null,
  location     text check (char_length(location) <= 80),
  year         int check (year between 1990 and 2100),
  -- URL publik Supabase Storage, atau '/images/...' untuk file di folder public.
  image_src    text,
  image_alt    text,
  sort_order   int not null default 0,
  is_published boolean not null default false,
  -- Foto wajib punya teks alternatif untuk pembaca layar.
  check (image_src is null or image_alt is not null)
);

create index if not exists projects_service_id_idx on public.projects (service_id);

alter table public.projects enable row level security;
revoke all on table public.projects from anon, authenticated;
grant select on table public.projects to anon, authenticated, service_role;

drop policy if exists "publik baca portofolio" on public.projects;
create policy "publik baca portofolio" on public.projects
  for select to anon, authenticated
  using (is_published);

-- Bucket publik: siapa pun bisa melihat foto, hanya admin dashboard yang bisa mengunggah (tanpa policy insert).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('foto', 'foto', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
