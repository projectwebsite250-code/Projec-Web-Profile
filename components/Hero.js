import HeroSlider from "./HeroSlider";
import { brand, images } from "@/lib/content";

export default function Hero({ services }) {
  return (
    <section id="beranda" className="hero" aria-labelledby="hero-title">
      <div className="hero-content">
        <div className="hero-inner">
          <p className="eyebrow eyebrow-light hero-anim">
            <span>01</span>{brand.tagline}
          </p>
          <h1 id="hero-title" className="hero-title hero-anim">
            Tenaga Kerja Tepat.
            <br />
            <em>Operasional Lebih Andal.</em>
          </h1>
          <p className="hero-lead hero-anim">
            Solusi penyediaan tenaga kerja untuk mendukung kebutuhan operasional bisnis Anda secara profesional dan terstruktur.
          </p>
          <div className="hero-actions hero-anim">
            <a href="#kontak" className="btn btn-gold">Diskusikan Kebutuhan Anda</a>
            <a href="#layanan" className="btn btn-ghost">Jelajahi Layanan</a>
          </div>
        </div>

        <ul className="hero-index hero-anim" aria-label="Kategori layanan">
          {services.map((s, i) => (
            <li key={s.id}>
              <a href={`#layanan-${s.id}`}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="hero-media">
        <HeroSlider slides={[images.hero, ...services.filter((s) => s.image).map((s) => s.image)]} />
      </div>
    </section>
  );
}
