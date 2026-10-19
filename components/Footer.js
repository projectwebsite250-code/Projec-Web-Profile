import Image from "next/image";
import { brand, contact, nav, services } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#beranda" className="wordmark">
            <Image src="/images/logo.png" alt="" width={52} height={72} />
            <div>
              {brand.name}
              <span>{brand.tagline}</span>
            </div>
          </a>
          <p>{brand.summary}</p>
        </div>

        <nav aria-label="Navigasi footer">
          <h2 className="footer-title">Navigasi</h2>
          <ul>
            {nav.map(({ id, label }) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
          </ul>
        </nav>

        <div>
          <h2 className="footer-title">Layanan</h2>
          <ul>
            {services.map((s) => <li key={s.id}><a href={`#layanan-${s.id}`}>{s.title}</a></li>)}
          </ul>
        </div>

        <div>
          <h2 className="footer-title">Kontak</h2>
          <ul>
            {contact.map((c) => <li key={c.label} className="placeholder">{c.value}</li>)}
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {brand.name}. Seluruh hak dilindungi.</p>
        <a href="#beranda">Kembali ke atas ↑</a>
      </div>
    </footer>
  );
}
