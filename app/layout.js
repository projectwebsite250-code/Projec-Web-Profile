import { Barlow, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import { brand } from "@/lib/content";
import "./globals.css";

const heading = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-heading" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: `${brand.name} — Penyedia Tenaga Kerja Profesional`,
  description: brand.summary,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${heading.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
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
