# Company Profile — Workforce Solutions

Next.js (App Router) + JavaScript + plain CSS.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Before launch
- **Text and contact details**: all of it is in `lib/content.js`. Values in `[square brackets]` are placeholders (phone, WhatsApp, email, address, vision, mission, legal status).
- **Photos**: put these files in `public/images/`: `hero.jpg` (portrait, ≥1400px tall), `about.jpg` (wide 21:9), `driver.jpg`, `security.jpg`, `tetap.jpg`. Until they exist, a navy fallback panel shows in their place. Use real photos of the company or licensed stock.
- **Form**: `components/ContactForm.js` is UI only and does not send data. Connect it to an API route or email service when the backend is ready.
- **Chatbot**: `components/ChatBot.js` (floating widget) calls `app/api/chat/route.js`, which answers with Claude using the content in `lib/content.js`. Create `.env.local` with `ANTHROPIC_API_KEY=sk-ant-...` (key from console.anthropic.com), restart `npm run dev`, and set the same variable on your host (e.g. Vercel). The route needs a Node server, so a static export won't work. There's no per-visitor rate limit yet. Add one before heavy public traffic. Tests: `node --test lib/chat.test.mjs`.
- **Logo**: `public/images/logo.png` is a transparent cut-out of the original logo, and `app/icon.png` is the favicon.
