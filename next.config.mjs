/** @type {import('next').NextConfig} */
const nextConfig = {
  // knowledge.md dibaca lewat fs saat runtime, jadi harus ikut dibundel ke fungsi /api/chat.
  outputFileTracingIncludes: { "/api/chat": ["./lib/knowledge.md"] },
};
export default nextConfig;
