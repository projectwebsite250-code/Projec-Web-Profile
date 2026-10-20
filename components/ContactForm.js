"use client";

import { useState } from "react";
import { LIMITS, waLink } from "@/lib/inquiry";

const messages = {
  idle: "Tombol kirim membuka WhatsApp dengan pesan berisi isian Anda.",
  sent: "WhatsApp sudah dibuka. Tekan kirim di WhatsApp untuk menyampaikan permintaan Anda.",
  empty: "Semua kolom wajib diisi.",
  off: "Formulir belum aktif karena nomor WhatsApp perusahaan belum tersedia.",
};

export default function ContactForm({ services, whatsapp }) {
  const [status, setStatus] = useState(whatsapp ? "idle" : "off");

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, v.trim()]));
    if (Object.values(fields).some((v) => !v)) return setStatus("empty");
    fields.jenis = form.elements.jenis.selectedOptions[0].text;
    // Dibuka langsung dari event submit agar tidak diblokir sebagai pop-up.
    window.open(waLink(whatsapp, fields), "_blank", "noopener");
    setStatus("sent");
  };

  return (
    <form id="formulir" className="form" onSubmit={onSubmit}>
      <h3 className="h4">Formulir permintaan informasi</h3>

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

      <div className="field">
        <label htmlFor="f-kontak">Email atau nomor telepon</label>
        <input id="f-kontak" name="kontak" autoComplete="email" minLength={3} maxLength={LIMITS.kontak} required />
      </div>

      <div className="field">
        <label htmlFor="f-jenis">Jenis tenaga kerja yang dibutuhkan</label>
        <select id="f-jenis" name="jenis" required defaultValue="">
          <option value="" disabled>Pilih kategori</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          <option value="lainnya">Kombinasi / lainnya</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-deskripsi">Deskripsi kebutuhan</label>
        <textarea id="f-deskripsi" name="deskripsi" rows={4} maxLength={LIMITS.deskripsi} placeholder="Contoh: lokasi, jumlah tenaga kerja, perkiraan jadwal" required />
      </div>

      <button type="submit" className="btn btn-navy" disabled={!whatsapp}>
        Kirim lewat WhatsApp
      </button>

      <p className="form-note" role={status === "empty" ? "alert" : "status"}>
        {messages[status]}
      </p>
    </form>
  );
}
