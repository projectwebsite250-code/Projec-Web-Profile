"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { brand } from "@/lib/content";

export default function Navbar({ nav }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("beranda");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Section aktif = yang melintasi garis tengah viewport
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -54% 0px" }
    );
    nav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [nav]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 960 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="container nav-bar">
        <a href="#beranda" className="wordmark" onClick={close}>
          <Image src="/images/logo.png" alt="" width={52} height={72} priority />
          <div>
            {brand.name}
            <span>{brand.tagline}</span>
          </div>
        </a>

        <nav aria-label="Navigasi utama" className="nav-desktop">
          <ul>
            {nav.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? "true" : undefined}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#kontak" className="btn btn-nav">Konsultasi</a>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span />
        </button>
      </div>

      <nav id="menu-mobile" aria-label="Navigasi mobile" className="nav-mobile" hidden={!open}>
        <ul>
          {nav.map(({ id, label }, i) => (
            <li key={id}>
              <a href={`#${id}`} onClick={close} aria-current={active === id ? "true" : undefined}>
                <span>{String(i + 1).padStart(2, "0")}</span>{label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#kontak" className="btn btn-gold" onClick={close}>Konsultasi</a>
      </nav>
    </header>
  );
}
