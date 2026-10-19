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
- **Form**: `components/ContactForm.js` posts to `app/api/inquiries/route.js`, which validates (`lib/inquiry.js`), filters spam (honeypot, minimum fill time, per-IP limit) and inserts into the Supabase table `public.inquiries`. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` (and on your host). Read submissions in the Supabase Table Editor. Tests: `node --test lib/inquiry.test.mjs`.
- **Services & portfolio (Supabase)**: the Layanan and Portofolio sections read the tables `services` and `projects` (only rows with `is_published = true`; RLS enforces this). Photos live in the public Storage bucket `site-media` (JPG/PNG/WebP, max 5 MB) at `services/<id>.jpg` and `projects/<slug>.jpg`; the tables store only the path. Schema: run `supabase/migrations/20261019000000_content.sql`, then `supabase/seed.sql` once (re-running never duplicates or overwrites rows, but re-creates rows you deleted). Projects with slug `dummy-*` / `is_sample = true` are fictional test data and are shown with a "Contoh" badge; delete them with `delete from projects where slug like 'dummy-%';`. Edit content in the Supabase Table Editor. Changes appear immediately via a Database Webhook (INSERT/UPDATE/DELETE on both tables, POST to `https://<site>/api/revalidate`, header `x-revalidate-secret: <REVALIDATE_SECRET>`); without it, within 5 minutes. If Supabase is unreachable (error, not empty), services fall back to `lib/content.js` and the portfolio is hidden. The webhook endpoint only accepts the Supabase payload for `public.services` / `public.projects`. When replacing a photo, upload it under a new filename (the old URL is cached by browsers/CDN).
- **Chatbot**: `components/ChatBot.js` (floating widget) calls `app/api/chat/route.js`, which answers with Claude using the content in `lib/content.js`. Create `.env.local` with `ANTHROPIC_API_KEY=sk-ant-...` (key from console.anthropic.com), restart `npm run dev`, and set the same variable on your host (e.g. Vercel). The route needs a Node server, so a static export won't work. There's no per-visitor rate limit yet. Add one before heavy public traffic. Tests: `node --test lib/chat.test.mjs`.
- **Logo**: `public/images/logo.png` is a transparent cut-out of the original logo, and `app/icon.png` is the favicon.
