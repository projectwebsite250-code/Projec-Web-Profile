"use client";

import { useEffect, useState } from "react";
import Photo from "./Photo";

const INTERVAL = 5000;

// Slide foto hero: crossfade + zoom perlahan, ganti otomatis, berhenti saat disorot/difokus.
export default function HeroSlider({ slides }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % slides.length), INTERVAL);
    return () => clearTimeout(id);
  }, [active, paused, slides.length]);

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div key={s.src} className={`hero-slide${i === active ? " is-active" : ""}`} aria-hidden={i !== active}>
          <Photo image={s} priority={i === 0} sizes="(max-width: 960px) 100vw, 42vw" />
        </div>
      ))}

      <p key={active} className="hero-caption" aria-live="polite">{slides[active].label}</p>

      <div className="hero-dots">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Tampilkan foto ${i + 1}: ${s.label}`}
            aria-current={i === active || undefined}
            className={paused ? "is-paused" : undefined}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}
