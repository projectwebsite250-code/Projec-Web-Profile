"use client";

import { useState } from "react";
import { services } from "@/lib/content";

// shortcut: formulir belum mengirim data ke mana pun; sambungkan ke API route/email saat backend tersedia.
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <form id="formulir" className="form" onSubmit={onSubmit}>
      <h3 className="h4">Formulir permintaan informasi</h3>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-nama">Nama</label>
          <input id="f-nama" name="nama" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="f-perusahaan">Nama perusahaan</label>
          <input id="f-perusahaan" name="perusahaan" autoComplete="organization" required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-kontak">Email atau nomor telepon</label>
        <input id="f-kontak" name="kontak" autoComplete="email" required />
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
        <textarea id="f-deskripsi" name="deskripsi" rows={4} placeholder="Contoh: lokasi, jumlah tenaga kerja, perkiraan jadwal" required />
      </div>

      <button type="submit" className="btn btn-navy">Kirim Permintaan</button>

      <p className="form-note" role="status">
        {submitted
          ? "Terima kasih. Formulir ini belum terhubung ke sistem sehingga data belum terkirim — silakan hubungi kami melalui kontak di samping."
          : "Formulir masih dalam tahap pengembangan; data belum dikirim ke sistem."}
      </p>
    </form>
  );
}
