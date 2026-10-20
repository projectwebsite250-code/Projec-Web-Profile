import ContactForm from "./ContactForm";
import Reveal from "./Reveal";
import { Pin } from "./Icons";
import { brand, contact, officeMap, whatsapp } from "@/lib/content";

export default function Contact({ services }) {
  return (
    <section id="kontak" className="section section-navy" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="cta">
          <p className="eyebrow eyebrow-light"><span>07</span>Kontak</p>
          <h2 id="contact-title" className="display">
            Diskusikan Kebutuhan
            <br />
            Tenaga Kerja Anda.
          </h2>
          <a href="#formulir" className="btn btn-gold">Hubungi Kami</a>
        </Reveal>

        <div className="contact">
          <div className="contact-info">
            <p>
              Sampaikan kebutuhan Anda melalui formulir atau kanal kontak di bawah. Tim kami akan menindaklanjuti untuk
              membahas detailnya.
            </p>
            {contact.length > 0 && (
              <dl>
                {contact.map((c) => (
                  <div key={c.label}>
                    <dt>{c.label}</dt>
                    <dd>{c.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {officeMap && (
              <figure className="contact-map">
                <iframe
                  src={officeMap.embed}
                  title={`Peta lokasi kantor ${brand.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <figcaption>
                  <a href={officeMap.link} target="_blank" rel="noopener noreferrer" className="text-link">
                    <Pin />
                    Buka di Google Maps
                  </a>
                </figcaption>
              </figure>
            )}
          </div>

          <ContactForm services={services} whatsapp={whatsapp} />
        </div>
      </div>
    </section>
  );
}
