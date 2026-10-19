import Photo from "./Photo";
import Reveal from "./Reveal";
import { Arrow } from "./Icons";
import { images } from "@/lib/content";

export default function About() {
  return (
    <section id="tentang" className="section section-off" aria-labelledby="about-title">
      <div className="container">
        <div className="split">
          <Reveal className="split-head">
            <p className="eyebrow"><span>02</span>Tentang Kami</p>
            <h2 id="about-title" className="h2">
              Memahami operasional Anda lebih dulu, lalu menyiapkan orang yang tepat.
            </h2>
          </Reveal>

          <Reveal className="split-body" delay={120}>
            <p className="lead">
              Kami membantu perusahaan memenuhi kebutuhan tenaga kerja untuk posisi driver, security, cleaning service, pekerjaan borongan,
              hingga tenaga kerja tetap.
            </p>
            <p>
              Setiap kebutuhan dibahas bersama klien: lingkup pekerjaan, lokasi, jadwal, dan kualifikasi yang diharapkan.
              Dari sana, proses koordinasi dan persiapan tenaga kerja dijalankan secara terstruktur agar penempatan
              berjalan sesuai kesepakatan.
            </p>

            <dl className="facts">
              <div>
                <dt>Visi</dt>
                <dd className="placeholder">[Visi perusahaan akan dilengkapi]</dd>
              </div>
              <div>
                <dt>Misi</dt>
                <dd className="placeholder">[Misi perusahaan akan dilengkapi]</dd>
              </div>
              <div>
                <dt>Legalitas</dt>
                <dd className="placeholder">[Informasi badan usaha & perizinan]</dd>
              </div>
            </dl>

            <a href="#proses" className="text-link">
              Lihat cara kami bekerja <Arrow />
            </a>
          </Reveal>
        </div>

        <Reveal className="about-media">
          <Photo image={images.about} sizes="(max-width: 960px) 100vw, 75vw" />
        </Reveal>
      </div>
    </section>
  );
}
