import Anthropic from "@anthropic-ai/sdk";
import { brand, services, process as steps, contact } from "@/lib/content";
import { isValidHistory } from "@/lib/chat";

const system = `Anda adalah asisten virtual di website ${brand.name}, perusahaan penyedia tenaga kerja.
Jawab dalam bahasa Indonesia yang sopan, singkat, dan jelas (maksimal 3 paragraf pendek).
Hanya bahas perusahaan, layanannya, dan kebutuhan tenaga kerja calon klien. Untuk topik lain, tolak dengan sopan.
Jangan mengarang harga, jumlah tenaga kerja, legalitas, atau janji yang tidak tercantum di bawah. Jika ditanya hal itu, arahkan ke tim lewat formulir kontak di halaman ini.
Nilai dalam [kurung siku] belum tersedia, jadi jangan menyebutkannya.

Tentang perusahaan: ${brand.summary}

Layanan:
${services.map((s) => `- ${s.title}: ${s.summary} (${s.points.join(", ")})`).join("\n")}

Proses kerja:
${steps.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`).join("\n")}

Kontak:
${contact.map((c) => `- ${c.label}: ${c.value}`).join("\n")}`;

const fallbackText = "Maaf, saya tidak bisa membantu pertanyaan itu. Silakan hubungi tim kami melalui formulir kontak.";
const errorText = "Maaf, terjadi gangguan. Silakan coba lagi atau hubungi kami melalui formulir kontak.";

// shortcut: belum ada rate limit per pengunjung; tambahkan (mis. Upstash/Vercel KV) sebelum trafik publik besar.
export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!isValidHistory(body?.messages)) {
    return Response.json({ error: "Format percakapan tidak valid." }, { status: 400 });
  }
  const messages = body.messages.map(({ role, content }) => ({ role, content }));

  const encoder = new TextEncoder();
  let stream;
  const output = new ReadableStream({
    async start(controller) {
      try {
        stream = new Anthropic().beta.messages.stream({
          model: "claude-opus-5-5",
          max_tokens: 2048,
          output_config: { effort: "low" },
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          system,
          messages,
        });
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") controller.enqueue(encoder.encode(fallbackText));
      } catch (err) {
        console.error("[api/chat]", err);
        controller.enqueue(encoder.encode(errorText));
      }
      controller.close();
    },
    cancel() {
      stream?.abort();
    },
  });

  return new Response(output, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
