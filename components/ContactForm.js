"use client";

import { useEffect, useRef, useState } from "react";
import { fieldError, LIMITS, OTHER_SERVICE, waLink } from "@/lib/inquiry";

const messages = {
  idle: "Data Anda disimpan untuk ditindaklanjuti oleh tim kami.",
  sending: "Mengirim…",
  sent: "Terima kasih, permintaan Anda sudah kami terima.",
  invalid: "Periksa kembali kolom yang ditandai.",
};

export default function ContactForm({ services, whatsapp }) {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [errorText, setErrorText] = useState("");
  const [errors, setErrors] = useState({});
  const [startedAt] = useState(() => Date.now());

  const clearError = (name) => setErrors((prev) => ({ ...prev, [name]: "" }));

  // Tautan "Tanyakan layanan ini" berada di luar formulir, jadi kliknya ditangkap di dokumen.
  useEffect(() => {
    const onClick = (e) => {
      const id = e.target.closest?.("[data-service]")?.dataset.service;
      if (!id) return;
      formRef.current.elements.jenis.value = id;
      clearError("jenis");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const { website, ...fields } = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, v.trim()]));

    const found = { jenis: fields.jenis ? "" : "Pilih jenis layanan." };
    for (const key of Object.keys(LIMITS)) found[key] = fieldError(key, fields[key]);
    setErrors(found);
    const firstInvalid = [...form.elements].find((el) => found[el.name]);
    if (firstInvalid) {
      firstInvalid.focus();
      return setStatus("invalid");
    }

    // Dibuka langsung dari event submit agar tidak diblokir sebagai pop-up.
    if (whatsapp) {
      const jenis = form.elements.jenis.selectedOptions[0].text;
      window.open(waLink(whatsapp, { ...fields, jenis }), "_blank", "noopener");
    }

    setStatus("sending");
    let error = "Gagal mengirim formulir. Periksa koneksi Anda lalu coba lagi.";
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, website, startedAt }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        return setStatus("sent");
      }
      error = data.error || error;
    } catch {
      // Pesan koneksi di atas yang ditampilkan.
    }
    setErrorText(error);
    setStatus("error");
  };

  const isAlert = status === "invalid" || status === "error";

  const field = (name) => ({
    id: `f-${name}`,
    name,
    maxLength: LIMITS[name],
    required: true,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `e-${name}` : undefined,
    onChange: () => errors[name] && clearError(name),
  });
  const fieldNote = (name) => errors[name] && <p id={`e-${name}`} className="field-error">{errors[name]}</p>;

  return (
    <form ref={formRef} id="formulir" className="form" onSubmit={onSubmit} noValidate>
      <h3 className="h3">Formulir permintaan informasi</h3>

      {/* Honeypot: tersembunyi dari pengunjung, biasanya hanya diisi bot. */}
      <input name="website" hidden tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-nama">Nama</label>
          <input {...field("nama")} autoComplete="name" />
          {fieldNote("nama")}
        </div>
        <div className="field">
          <label htmlFor="f-perusahaan">Nama perusahaan</label>
          <input {...field("perusahaan")} autoComplete="organization" />
          {fieldNote("perusahaan")}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-email">Email</label>
          <input {...field("email")} type="email" autoComplete="email" />
          {fieldNote("email")}
        </div>
        <div className="field">
          <label htmlFor="f-telepon">No. telepon / WhatsApp</label>
          <input {...field("telepon")} type="tel" autoComplete="tel" />
          {fieldNote("telepon")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-jenis">Jenis layanan yang dibutuhkan</label>
        <select {...field("jenis")} defaultValue="">
          <option value="" disabled>Pilih layanan</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          <option value={OTHER_SERVICE}>Kombinasi / lainnya</option>
        </select>
        {fieldNote("jenis")}
      </div>

      <div className="field">
        <label htmlFor="f-pesan">Pesan / kebutuhan</label>
        <textarea {...field("pesan")} rows={4} placeholder="Contoh: lokasi, jumlah tenaga kerja, perkiraan jadwal" />
        {fieldNote("pesan")}
      </div>

      <button type="submit" className="btn btn-gold" disabled={status === "sending"}>
        {whatsapp ? "Kirim & buka WhatsApp" : "Kirim Pesan"}
      </button>

      <p className="form-note" role={isAlert ? "alert" : "status"}>
        {status === "error" ? errorText : messages[status]}
      </p>
    </form>
  );
}
