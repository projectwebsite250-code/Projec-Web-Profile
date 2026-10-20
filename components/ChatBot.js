"use client";

import { useEffect, useRef, useState } from "react";
import { brand, contactHint } from "@/lib/content";
import { MAX_ASSISTANT_CHARS, MAX_MESSAGES, MAX_USER_CHARS } from "@/lib/chat";

const greeting = {
  role: "assistant",
  content: `Halo! Saya asisten virtual ${brand.name}. Ada yang bisa saya bantu terkait kebutuhan tenaga kerja Anda?`,
};
const errorText = `Maaf, chat sedang tidak tersedia. Silakan hubungi kami melalui ${contactHint}.`;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([greeting]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // iOS Safari tidak mengecilkan layout viewport (atau 100dvh) saat keyboard muncul,
  // jadi panel di mobile mengikuti area yang benar-benar terlihat lewat visualViewport.
  useEffect(() => {
    const vv = window.visualViewport;
    const el = chatRef.current;
    if (!open || !vv || !el) return;
    const place = () => {
      el.style.setProperty("--vv-top", `${vv.offsetTop}px`);
      el.style.setProperty("--vv-h", `${vv.height}px`);
    };
    const fit = () => {
      place();
      logRef.current?.scrollTo(0, logRef.current.scrollHeight);
    };
    fit();
    vv.addEventListener("resize", fit);
    vv.addEventListener("scroll", place);
    return () => {
      vv.removeEventListener("resize", fit);
      vv.removeEventListener("scroll", place);
    };
  }, [open]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const history = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    let reply = "";
    try {
      // Sapaan pembuka tidak dikirim karena API mewajibkan pesan pertama dari user.
      // Jawaban panjang dipotong agar riwayat tidak ditolak API dan chat tidak macet.
      const sent = history.slice(1).slice(-(MAX_MESSAGES - 1)).map((m) => ({ ...m, content: m.content.slice(0, MAX_ASSISTANT_CHARS) }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: sent }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: reply }]);
      }
    } catch {
      reply = "";
    }
    if (!reply.trim()) setMessages([...history, { role: "assistant", content: errorText }]);
    setBusy(false);
  };

  return (
    <div ref={chatRef} className={open ? "chat chat-open" : "chat"}>
      {open && (
        <section id="chat-panel" className="chat-panel" role="dialog" aria-label={`Chat dengan ${brand.name}`}>
          <header className="chat-head">
            <div>
              <p className="chat-title">Asisten {brand.name}</p>
              <p className="chat-sub">Biasanya membalas dalam hitungan detik</p>
            </div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Tutup chat">×</button>
          </header>

          <ol ref={logRef} className="chat-log" aria-live="polite">
            {messages.map((m, i) => (
              <li key={i} className={`chat-msg chat-${m.role}`}>
                {/* Model menulis Markdown: "* "/"- " jadi "• ", "#" judul dibuang, indeks ganjil hasil split = isi **tebal** */}
                {m.content ? m.content.replace(/^\s*[*-] /gm, "• ").replace(/^#+ /gm, "").split(/\*\*(.+?)\*\*/g).map((part, j) => (j % 2 ? <strong key={j}>{part}</strong> : part)) : <span className="chat-typing" aria-label="Sedang mengetik">•••</span>}
              </li>
            ))}
          </ol>

          <form className="chat-form" onSubmit={send}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={MAX_USER_CHARS}
              placeholder="Tulis pertanyaan Anda…"
              aria-label="Pesan"
            />
            <button type="submit" className="btn btn-navy" disabled={busy || !input.trim()}>Kirim</button>
          </form>
          <p className="chat-note">Dijawab otomatis oleh AI. Untuk penawaran resmi, gunakan {contactHint}.</p>
        </section>
      )}

      <button
        type="button"
        className="chat-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Tutup chat" : "Buka chat"}
      >
        {open ? "×" : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 5h16v11H9l-5 4V5Z" />
            <path d="M8 9.5h8M8 12.5h5" />
          </svg>
        )}
      </button>
    </div>
  );
}
