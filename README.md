# Company Profile — PT Bintang Eca Pratama

Next.js (App Router) + JavaScript + plain CSS.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Before launch
- **Database (Supabase)**: run `supabase/migrations/20261104000000_database.sql`, then `supabase/seed.sql`, in the SQL Editor. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY` in `.env.local` and on your host. Never give the secret key a `NEXT_PUBLIC_` prefix.
  - `services`, `company_profile`: services, contact, vision, mission, legal status and service areas. Edit them in the Table Editor; the site updates within 5 minutes. **The seeded contact, profile and service-area values are sample data, not real company data: replace them before real use.**
  - `inquiries`, `chat_logs`: contact form submissions and chatbot conversations. Only the server can write them, and they are read in the Table Editor. `chat_logs` has no automatic cleanup yet.
- **Content**: other text is in `lib/content.js`, which is also the fallback when Supabase cannot be read. Values in `[square brackets]` there are placeholders and are hidden from visitors and the chatbot.
- **Photos**: all photos are local files in `public/images/`: `hero.jpg` (landscape, ≥1700px wide), `about.jpg`, and one per service: `driver.jpg`, `security.jpg`, `cleaning.jpg`, `borongan.jpg`. Photos are cropped to fit, so keep the subject near the centre. A service without a photo in the database uses the local photo with the same id; if there is none, an icon shows. File names are case-sensitive (`.jpg` ≠ `.jpeg`). Until a file exists, a dark fallback panel shows in its place. Use real photos of the company or licensed stock; stock photos are illustrations, never project documentation. Replace them with real company photos when available (same file name and aspect ratio).
- **Photo credits**: the current photos are stock illustrations from Unsplash under the [Unsplash License](https://unsplash.com/license) (free for commercial use, no attribution required; credited here anyway). They were cropped to the slot ratio and re-encoded as JPEG; colours are unchanged.

  | File | Size | Photographer | Source |
  |---|---|---|---|
  | `hero.jpg` | 1776×1280 | unsplash.com/@sulyok_imaging | https://unsplash.com/photos/workers-walking-through-warehouse-aisle-c_4eaGRDSVU |
  | `about.jpg` | 1500×1181 | unsplash.com/@felixv143 | https://unsplash.com/photos/a-group-of-business-people-sitting-around-a-table-WEKYnsgn0x8 |
  | `driver.jpg` | 1200×1040 | unsplash.com/@mitchel3uo | https://unsplash.com/photos/man-standing-in-front-of-freight-truck-YhoXp0AdEWc |
  | `security.jpg` | 1200×1498 | unsplash.com/@fuerte | https://unsplash.com/photos/security-guard-standing-on-the-gray-floor-8FxJi5wuwKc |
  | `cleaning.jpg` | 1200×1399 | unsplash.com/@thegraphicspace | https://unsplash.com/photos/a-man-in-a-yellow-vest-is-cleaning-the-floor-kLZs4yoR0uU |
  | `borongan.jpg` | 1500×1176 | unsplash.com/@darrel23 | https://unsplash.com/photos/a-group-of-men-standing-around-a-large-metal-barrel-td8weHnM0-c |
- **Portfolio**: run `supabase/migrations/20261125000000_projects.sql`, then edit the `projects` table. A row shows only when `is_published` is true; with no published rows the section shows empty placeholder cards. Add real projects only. Photos: upload to the public `foto` bucket in Supabase Storage, copy the public URL into `image_src` and describe the photo in `image_alt`. `services.image_src` accepts the same URLs; any other host is ignored. `NEXT_PUBLIC_SUPABASE_URL` must be set at build time, because it is the only photo host allowed. Tests: `node --test lib/image.test.mjs`.
- **Form**: `components/ContactForm.js` posts to `app/api/inquiries/route.js`, which saves to `inquiries`. If `company_profile` has a `kontak` row labelled `WhatsApp` (any format, e.g. `0812-3456-7890`), the form also opens WhatsApp with the visitor's answers, so use only a real company number there. Tests: `node --test lib/inquiry.test.mjs`.
- **Chatbot**: `components/ChatBot.js` (floating widget) calls `app/api/chat/route.js`, which answers through the NVIDIA API (OpenAI-compatible, model `nvidia/nemotron-3-ultra-550b-a55b`) using the content from Supabase and `lib/content.js`, and logs each exchange to `chat_logs`. Set `NVIDIA_API_KEY` in `.env.local`, restart `npm run dev`, and set the same variable on your host (e.g. Vercel). The route needs a Node server, so a static export won't work. There's no per-visitor rate limit yet. Add one before heavy public traffic. Tests: `node --test lib/chat.test.mjs`.
- **Logo**: `public/images/logo.png` is a transparent cut-out of the original logo, and `app/icon.png` is the favicon.
