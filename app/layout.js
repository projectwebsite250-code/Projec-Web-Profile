import { Barlow, Plus_Jakarta_Sans } from "next/font/google";
import { brand } from "@/lib/content";
import "./globals.css";

const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
// Hanya untuk bagian Tentang Kami.
const about = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-about" });

export const metadata = {
  title: `${brand.name} — Penyedia Tenaga Kerja Profesional`,
  description: brand.summary,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${body.variable} ${about.variable}`} suppressHydrationWarning>
      <head>
        {/* Konten reveal hanya disembunyikan bila JS aktif, jadi tetap terbaca tanpa JS */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip-link" href="#konten">Langsung ke konten</a>
        {children}
      </body>
    </html>
  );
}
