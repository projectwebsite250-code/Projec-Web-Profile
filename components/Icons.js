// Ikon garis sederhana (stroke 1.5) agar selaras dengan tipografi.
const base = { width: 32, height: 32, viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

const paths = {
  driver: (
    <>
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="3" />
      <path d="M5.5 13.5c3.5 1 7 1.5 10.5 1.5s7-.5 10.5-1.5M13.5 18.5 9 25.5M18.5 18.5 23 25.5" />
    </>
  ),
  security: (
    <>
      <path d="M16 4 6 8v7c0 6.5 4.3 11.3 10 13 5.7-1.7 10-6.5 10-13V8L16 4Z" />
      <path d="m11.5 16 3 3 6-6" />
    </>
  ),
  cleaning: (
    <>
      <path d="M11 4h6v4h-6zM12 8v3M16 8v3" />
      <path d="M9 13a3 3 0 0 1 3-2h4a3 3 0 0 1 3 2l1 13a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2l1-13Z" />
      <path d="M17 4h4l3 2M23 9h2M22 12l2 1" />
    </>
  ),
  borongan: (
    <>
      <path d="M6 21a10 10 0 0 1 20 0" />
      <path d="M4 21h24v3H4zM13 11.5V8h6v3.5" />
    </>
  ),
  tetap: (
    <>
      <rect x="6" y="5" width="20" height="24" rx="2" />
      <circle cx="16" cy="14" r="3.5" />
      <path d="M10.5 24c1-3 3-4.5 5.5-4.5s4.5 1.5 5.5 4.5M13 5V3h6v2" />
    </>
  ),
};

export function ServiceIcon({ name }) {
  return <svg {...base}>{paths[name]}</svg>;
}

export function Pin() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 14.5s4.5-4.2 4.5-7.8a4.5 4.5 0 0 0-9 0c0 3.6 4.5 7.8 4.5 7.8Z" />
      <circle cx="8" cy="6.5" r="1.6" />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}
