"use client";

import { useRef, useState } from "react";
import { LIMITS } from "@/lib/inquiry";

const messages = {
  idle: "Kami akan menghubungi Anda melalui kontak yang Anda isi.",
  sending: "Mengirim permintaan…",
  sent: "Terima kasih. Permintaan Anda sudah kami terima dan tim kami akan segera menghubungi Anda.",
};

export default function ContactForm({ services }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const startedAt = useRef(Date.now());

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), startedAt: startedAt.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error);
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err.message || "Gagal mengirim formulir. Periksa koneksi Anda lalu coba lagi.");
      setStatus("error");
    }
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

      {/* Honeypot anti-spam: tersembunyi dari pengunjung dan pembaca layar, biasanya diisi oleh bot. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn-navy" disabled={status === "sending"}>
        {status === "sending" ? "Mengirim…" : "Kirim Permintaan"}
      </button>

      <p className="form-note" role={status === "error" ? "alert" : "status"}>
        {status === "error" ? error : messages[status]}
      </p>
    </form>
  );
}
