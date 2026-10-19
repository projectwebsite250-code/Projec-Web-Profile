import Reveal from "./Reveal";
import { reasons } from "@/lib/content";

export default function WhyUs() {
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container why">
        <div className="why-head">
          <p className="eyebrow"><span>06</span>Mengapa Kami</p>
          <h2 id="why-title" className="display">
            Dikerjakan dengan cara yang <em>bisa Anda ikuti.</em>
          </h2>
          <p className="section-intro">
            Kami tidak menjanjikan angka. Yang kami tawarkan adalah proses yang transparan dan komunikasi yang konsisten.
          </p>
        </div>

        <ol className="why-list">
          {reasons.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 80}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="h4">{r.title}</h3>
                <p>{r.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
