// Batas ini menjaga biaya API tetap wajar karena /api/chat terbuka untuk publik.
export const MAX_MESSAGES = 20;
export const MAX_USER_CHARS = 1000;
export const MAX_ASSISTANT_CHARS = 8000;

// Riwayat harus bergantian user/assistant, diawali dan diakhiri pesan user.
export function isValidHistory(messages) {
  return (
    Array.isArray(messages) &&
    messages.length % 2 === 1 &&
    messages.length <= MAX_MESSAGES &&
    messages.every((m, i) => {
      const role = i % 2 ? "assistant" : "user";
      const max = role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS;
      return m?.role === role && typeof m.content === "string" && m.content.trim() !== "" && m.content.length <= max;
    })
  );
}
