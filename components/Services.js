import Photo from "./Photo";
import Reveal from "./Reveal";
import { Arrow, ServiceIcon } from "./Icons";
import { services } from "@/lib/content";

export default function Services() {
  return (
    <section id="layanan" className="section" aria-labelledby="services-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow"><span>03</span>Layanan</p>
            <h2 id="services-title" className="h2">Lima kategori tenaga kerja untuk kebutuhan yang berbeda.</h2>
          </div>
          <p className="section-intro">
            Pilih satu kategori atau kombinasikan beberapa layanan sesuai skala dan karakter operasional perusahaan Anda.
          </p>
        </Reveal>

        <div className="services">
          {services.map((s, i) => (
            <Reveal as="article" key={s.id} id={`layanan-${s.id}`} className={`service service-${s.id}`} delay={(i % 2) * 120}>
              {s.image && (
                <div className="service-media">
                  <Photo image={s.image} sizes="(max-width: 960px) 100vw, 50vw" />
                </div>
              )}
              <div className="service-body">
                <div className="service-meta">
                  <span className="service-num">{String(i + 1).padStart(2, "0")}</span>
                  <ServiceIcon name={s.id} />
                </div>
                <h3 className="h3">{s.title}</h3>
                <p>{s.summary}</p>
                <ul className="service-points">
                  {s.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
                <a href="#kontak" className="text-link">
                  Tanyakan layanan ini <Arrow />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
