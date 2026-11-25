import Photo from "./Photo";
import Reveal from "./Reveal";

export default function Projects({ projects }) {
  const empty = !projects.length;

  return (
    <section id="portofolio" className="section section-alt" aria-labelledby="projects-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Portofolio</p>
          <h2 id="projects-title" className="h2">Portofolio penempatan tenaga kerja.</h2>
          <p className="section-intro">
            {empty ? "Portofolio kami sedang disiapkan." : "Beberapa penempatan tenaga kerja yang telah kami kerjakan bersama klien."}
          </p>
        </Reveal>

        {empty && (
          <div className="projects" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <div key={n} className="project project-empty">
                <div className="photo" />
                <span /><span /><span />
              </div>
            ))}
          </div>
        )}

        <div className="projects">
          {projects.map((p, i) => (
            <Reveal as="article" key={p.slug} className="project" delay={(i % 3) * 120}>
              <Photo image={p.image} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw" />
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
