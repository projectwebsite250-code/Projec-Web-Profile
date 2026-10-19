import Reveal from "./Reveal";
import { process } from "@/lib/content";

export default function Process() {
  return (
    <section id="proses" className="section section-dark" aria-labelledby="process-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow eyebrow-light"><span>05</span>Proses Kerja</p>
            <h2 id="process-title" className="h2">Alur yang jelas dari diskusi pertama hingga penempatan.</h2>
          </div>
          <p className="section-intro">
            Gambaran alur kerja berikut bersifat umum dan akan disesuaikan dengan prosedur aktual perusahaan serta kebutuhan
            setiap klien.
          </p>
        </Reveal>

        <Reveal as="ol" className="timeline">
          {process.map((step, i) => (
            <li key={step.title} style={{ "--i": i }}>
              <span className="timeline-num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="h4">{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
