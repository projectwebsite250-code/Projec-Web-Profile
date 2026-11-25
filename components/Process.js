import Reveal from "./Reveal";
import { process, reasons } from "@/lib/content";

export default function Process() {
  return (
    <section id="proses" className="section" aria-labelledby="process-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Proses Kerja</p>
          <h2 id="process-title" className="h2">Alur yang jelas dari diskusi pertama hingga penempatan.</h2>
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

        <Reveal className="why">
          <h3 className="h3">Dikerjakan dengan cara yang bisa Anda ikuti.</h3>
          <ul className="why-list">
            {reasons.map((r) => (
              <li key={r.title}>
                <h4 className="h4">{r.title}</h4>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
