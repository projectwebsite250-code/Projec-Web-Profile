// next/image menggagalkan seluruh halaman bila host foto tidak diizinkan di next.config.mjs,
// jadi alamat dari database disaring dulu. Mengembalikan undefined bila tidak boleh dipakai.
export function safeImageSrc(src, supabaseUrl) {
  const value = src?.trim();
  if (!value) return undefined;
  if (/^\/(?![/\\])[^?#]*$/.test(value)) return value;
  try {
    const url = new URL(value);
    const ok = supabaseUrl && url.origin === new URL(supabaseUrl).origin && url.pathname.startsWith("/storage/v1/object/public/") && !url.search;
    return ok ? url.href : undefined;
  } catch {
    return undefined;
  }
}
