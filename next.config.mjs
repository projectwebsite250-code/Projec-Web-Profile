const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // knowledge.md dibaca lewat fs saat runtime, jadi harus ikut dibundel ke fungsi /api/chat.
  outputFileTracingIncludes: { "/api/chat": ["./lib/knowledge.md"] },
  // Foto yang diunggah ke Supabase Storage (bucket publik).
  images: { remotePatterns: supabaseUrl ? [new URL("/storage/v1/object/public/**", supabaseUrl)] : [] },
};
export default nextConfig;
