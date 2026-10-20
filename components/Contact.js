import ContactForm from "./ContactForm";
import Reveal from "./Reveal";
import { contact, whatsapp } from "@/lib/content";

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
          </div>

          <ContactForm services={services} whatsapp={whatsapp} />
        </div>
      </div>
    </section>
  );
}
