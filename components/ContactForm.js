"use client";

import { useState } from "react";
import { LIMITS, OTHER_SERVICE, waLink } from "@/lib/inquiry";

const messages = {
  idle: "Data Anda disimpan untuk ditindaklanjuti oleh tim kami.",
  sending: "Mengirim…",
  sent: "Terima kasih, permintaan Anda sudah kami terima.",
  empty: "Semua kolom wajib diisi.",
};

export default function ContactForm({ services, whatsapp }) {
  const [status, setStatus] = useState("idle");
  const [errorText, setErrorText] = useState("");
  const [startedAt] = useState(() => Date.now());

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const { website, ...fields } = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, v.trim()]));
    if (Object.values(fields).some((v) => !v)) return setStatus("empty");

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

  const isAlert = status === "empty" || status === "error";

  return (
    <form id="formulir" className="form" onSubmit={onSubmit}>
      <h3 className="h4">Formulir permintaan informasi</h3>

      {/* Honeypot: tersembunyi dari pengunjung, biasanya hanya diisi bot. */}
      <input name="website" hidden tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-nama">Nama</label>
          <input id="f-nama" name="nama" autoComplete="name" maxLength={LIMITS.nama} required />
        </div>
        <div className="field">
          <label htmlFor="f-perusahaan">Nama perusahaan</label>
          <input id="f-perusahaan" name="perusahaan" autoComplete="organization" maxLength={LIMITS.perusahaan} required />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-email">Email</label>
          <input id="f-email" name="email" type="email" autoComplete="email" maxLength={LIMITS.email} required />
        </div>
        <div className="field">
          <label htmlFor="f-telepon">Nomor telepon</label>
          <input id="f-telepon" name="telepon" type="tel" autoComplete="tel" minLength={7} maxLength={LIMITS.telepon} required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-jenis">Jenis tenaga kerja yang dibutuhkan</label>
        <select id="f-jenis" name="jenis" required defaultValue="">
          <option value="" disabled>Pilih kategori</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          <option value={OTHER_SERVICE}>Kombinasi / lainnya</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-pesan">Deskripsi kebutuhan</label>
        <textarea id="f-pesan" name="pesan" rows={4} maxLength={LIMITS.pesan} placeholder="Contoh: lokasi, jumlah tenaga kerja, perkiraan jadwal" required />
      </div>

      <button type="submit" className="btn btn-navy" disabled={status === "sending"}>
        {whatsapp ? "Kirim & buka WhatsApp" : "Kirim"}
      </button>

      <p className="form-note" role={isAlert ? "alert" : "status"}>
        {status === "error" ? errorText : messages[status]}
      </p>
    </form>
  );
}
