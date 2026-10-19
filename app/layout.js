import { Manrope, Inter } from "next/font/google";
import { brand } from "@/lib/content";
import "./globals.css";

const heading = Manrope({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-heading" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: `${brand.name} — Penyedia Tenaga Kerja Profesional`,
  description: brand.summary,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${heading.variable} ${body.variable}`} suppressHydrationWarning>
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
