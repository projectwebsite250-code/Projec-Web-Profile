import OpenAI from "openai";
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

const errorText = "Maaf, terjadi gangguan. Silakan coba lagi atau hubungi kami melalui formulir kontak.";
const busyText = "Maaf, asisten sedang ramai. Silakan coba lagi sebentar lagi atau hubungi kami melalui formulir kontak.";

// shortcut: belum ada rate limit per pengunjung; tambahkan (mis. Upstash/Vercel KV) sebelum trafik publik besar.
export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!isValidHistory(body?.messages)) {
    return Response.json({ error: "Format percakapan tidak valid." }, { status: 400 });
  }
  if (!process.env.NVIDIA_API_KEY) {
    console.error("[api/chat] NVIDIA_API_KEY belum diset");
    return new Response(null, { status: 503 });
  }
  const messages = body.messages.map(({ role, content }) => ({ role, content }));
  const client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
    timeout: 30_000,
    maxRetries: 1,
  });

  const encoder = new TextEncoder();
  const abort = new AbortController();
  const output = new ReadableStream({
    async start(controller) {
      try {
        const stream = await client.chat.completions.create(
          {
            model: "openai/gpt-oss-20b",
            max_tokens: 2048,
            stream: true,
            messages: [{ role: "system", content: system }, ...messages],
          },
          { signal: abort.signal },
        );
        // Hanya `content`; `reasoning_content` (proses berpikir model) tidak dikirim ke pengunjung.
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        // Hanya status/nama error; objek error lengkap bisa memuat header permintaan.
        console.error("[api/chat]", err?.status ?? err?.name);
        controller.enqueue(encoder.encode(err?.status === 429 ? busyText : errorText));
      }
      controller.close();
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(output, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
