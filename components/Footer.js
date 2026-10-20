import Image from "next/image";
import Link from "next/link";
import { brand, contact } from "@/lib/content";

export default function Footer({ nav, services }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/#beranda" className="wordmark">
            <Image src="/images/logo.png" alt="" width={52} height={72} />
            <div>
              {brand.name}
              <span>{brand.tagline}</span>
            </div>
          </Link>
          <p>{brand.summary}</p>
        </div>

        <nav aria-label="Navigasi footer">
          <h2 className="footer-title">Navigasi</h2>
          <ul>
            {nav.map(({ id, label, href }) => <li key={id}><Link href={href ?? `/#${id}`}>{label}</Link></li>)}
          </ul>
        </nav>

        <div>
          <h2 className="footer-title">Layanan</h2>
          <ul>
            {services.map((s) => <li key={s.id}><Link href={`/#layanan-${s.id}`}>{s.title}</Link></li>)}
          </ul>
        </div>

        {contact.length > 0 && (
          <div>
            <h2 className="footer-title">Kontak</h2>
            <ul>
              {contact.map((c) => <li key={c.label}>{c.value}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {brand.name}. Seluruh hak dilindungi.</p>
        <a href="#konten">Kembali ke atas ↑</a>
      </div>
    </footer>
  );
}
