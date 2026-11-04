// Pita berjalan berisi nama layanan. Hanya hiasan: daftar yang sama sudah bisa dibaca dan diklik di hero.
export default function Ticker({ services }) {
  const items = [...services, ...services, ...services];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <ul key={copy}>
            {items.map((s, i) => <li key={i}>{s.title}</li>)}
          </ul>
        ))}
      </div>
    </div>
  );
}
