# Company Profile — Workforce Solutions

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
- **Content**: other text and the portfolio are in `lib/content.js`, which is also the fallback when Supabase cannot be read. Values in `[square brackets]` there are placeholders and are hidden from visitors and the chatbot.
- **Photos**: all photos are local files in `public/images/`: `hero.jpg` (portrait, ≥1400px tall), `about.jpg` (wide 21:9), and one per service: `driver.jpg`, `security.jpg`, `cleaning.jpg` (wide 21:9). The "Tenaga Borongan" service is a navy card without a photo by design. File names are case-sensitive (`.jpg` ≠ `.jpeg`). Until a file exists, a navy fallback panel shows in its place. Use real photos of the company or licensed stock; stock photos are illustrations, never project documentation. Replace them with real company photos when available (same file name and aspect ratio).
- **Photo credits**: the current photos are stock illustrations from Unsplash under the [Unsplash License](https://unsplash.com/license) (free for commercial use, no attribution required; credited here anyway). They were cropped to the slot ratio and re-encoded as JPEG; colours are unchanged.

  | File | Size | Photographer | Source |
  |---|---|---|---|
  | `hero.jpg` | 1200×1800 | John Kakuk | https://unsplash.com/photos/men-in-safety-vests-standing-in-front-of-a-construction-vehicle-hfj5CG9dvuU |
  | `about.jpg` | 2100×900 | Vitaly Gariev | https://unsplash.com/photos/diverse-business-team-collaborating-in-a-modern-office-_4tpElFQemQ |
  | `driver.jpg` | 1600×1000 | why kei | https://unsplash.com/photos/man-driving-a-car-wearing-wrist-watch-8e2gal_GIE8 |
  | `security.jpg` | 1200×1500 | Krzysztof Hepner | https://unsplash.com/photos/a-security-officer-walking-down-a-street-_D6rTxw4HAI |
  | `cleaning.jpg` | 2100×900 | Verne Ho | https://unsplash.com/photos/man-cleaning-on-floor-beside-white-wall-MwW-zrkYSIU |
- **Portfolio**: add real projects to `projects` in `lib/content.js` (shape is documented there) with photos at `public/images/projects/<slug>.jpg`. While the list is empty, the Portofolio section and menu item are hidden.
- **Form**: `components/ContactForm.js` posts to `app/api/inquiries/route.js`, which saves to `inquiries`. If `company_profile` has a `kontak` row labelled `WhatsApp` (any format, e.g. `0812-3456-7890`), the form also opens WhatsApp with the visitor's answers, so use only a real company number there. Tests: `node --test lib/inquiry.test.mjs`.
- **Chatbot**: `components/ChatBot.js` (floating widget) calls `app/api/chat/route.js`, which answers through the NVIDIA API (OpenAI-compatible, model `openai/gpt-oss-20b`) using the content from Supabase and `lib/content.js`, and logs each exchange to `chat_logs`. Set `NVIDIA_API_KEY` in `.env.local`, restart `npm run dev`, and set the same variable on your host (e.g. Vercel). The route needs a Node server, so a static export won't work. There's no per-visitor rate limit yet. Add one before heavy public traffic. Tests: `node --test lib/chat.test.mjs`.
- **Logo**: `public/images/logo.png` is a transparent cut-out of the original logo, and `app/icon.png` is the favicon.
