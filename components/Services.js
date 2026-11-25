import Photo from "./Photo";
import Reveal from "./Reveal";
import { Arrow, ServiceIcon } from "./Icons";

export default function Services({ services }) {
  return (
    <section id="layanan" className="section section-alt" aria-labelledby="services-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Layanan</p>
          <h2 id="services-title" className="h2">Empat kategori tenaga kerja untuk kebutuhan yang berbeda.</h2>
          <p className="section-intro">
            Pilih satu kategori atau kombinasikan beberapa layanan sesuai skala dan karakter operasional perusahaan Anda.
          </p>
        </Reveal>

        <div className="services">
          {services.map((s, i) => (
            <Reveal as="article" key={s.id} id={`layanan-${s.id}`} className="service" delay={(i % 2) * 120}>
              <div className="service-media">
                {s.image ? <Photo image={s.image} sizes="(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 400px" /> : <ServiceIcon name={s.id} />}
              </div>
              <div className="service-body">
                <h3 className="h3">{s.title}</h3>
                <p>{s.summary}</p>
                <ul className="service-points">
                  {s.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
                {/* ContactForm membaca data-service untuk memilih jenis layanan. */}
                <a href="#formulir" data-service={s.id} className="text-link">
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
