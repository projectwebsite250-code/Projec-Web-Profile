import Photo from "./Photo";
import { brand, images } from "@/lib/content";

export default function Hero({ services }) {
  return (
    <section id="beranda" className="hero" aria-labelledby="hero-title">
      <div className="hero-banner">
        <Photo image={images.hero} priority sizes="(max-width: 960px) 150vw, 100vw" position="center 60%" className="hero-photo" />
        <div className="container hero-content">
          <p className="eyebrow hero-anim">{brand.tagline}</p>
          <h1 id="hero-title" className="hero-title hero-anim">
            Tenaga Kerja Tepat. <em>Operasional Lebih Andal.</em>
          </h1>
          <p className="hero-lead hero-anim">
            Solusi penyediaan tenaga kerja untuk mendukung kebutuhan operasional bisnis Anda secara profesional dan terstruktur.
          </p>
          <div className="hero-actions hero-anim">
            <a href="#kontak" className="btn btn-gold">Konsultasikan Kebutuhan</a>
            <a href="#layanan" className="btn btn-ghost">Jelajahi Layanan</a>
          </div>
        </div>
      </div>

      <nav className="quick" aria-label="Akses cepat ke layanan">
        <ul className="container">
          {services.map((s) => (
            <li key={s.id}>
              <a href={`#layanan-${s.id}`}>{s.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
