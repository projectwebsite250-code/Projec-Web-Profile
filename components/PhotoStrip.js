import Photo from "./Photo";

// Strip foto berjalan tanpa henti; set kedua hanya duplikat visual agar loop mulus.
export default function PhotoStrip({ photos }) {
  return (
    <section className="strip" aria-label="Galeri foto">
      <div className="strip-track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="strip-set" aria-hidden={copy === 1 || undefined}>
            {photos.map((p) => (
              <li key={p.src}>
                <Photo image={p} sizes="(max-width: 640px) 70vw, 360px" />
                <span>{p.label}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
