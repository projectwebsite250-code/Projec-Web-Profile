import Photo from "./Photo";
import Reveal from "./Reveal";

export default function Projects({ projects }) {
  if (!projects.length) return null;
  const hasSamples = projects.some((p) => p.is_sample);

  return (
    <section id="portofolio" className="section section-off" aria-labelledby="projects-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow"><span>04</span>Portofolio</p>
            <h2 id="projects-title" className="h2">Portofolio penempatan tenaga kerja.</h2>
          </div>
          <p className="section-intro">
            {hasSamples
              ? "Proyek bertanda “Contoh” adalah ilustrasi untuk pengujian website, bukan proyek nyata perusahaan."
              : "Beberapa penempatan tenaga kerja yang telah kami kerjakan bersama klien."}
          </p>
        </Reveal>

        <div className="projects">
          {projects.map((p, i) => (
            <Reveal as="article" key={p.slug} className="project" delay={(i % 3) * 120}>
              <Photo image={p.image} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw" />
              {p.is_sample && <span className="project-badge">Contoh</span>}
              <p className="project-meta">{[p.serviceTitle, p.location, p.year].filter(Boolean).join(" · ")}</p>
              <h3 className="h4">{p.title}</h3>
              <p className="project-client">{p.client_name}</p>
              <p>{p.summary}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
