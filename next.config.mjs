// Foto konten dilayani dari bucket publik Supabase Storage "site-media".
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL && new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/site-media/**" }]
      : [],
  },
};
export default nextConfig;
