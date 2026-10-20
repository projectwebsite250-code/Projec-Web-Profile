# Company Profile — Workforce Solutions

Next.js (App Router) + JavaScript + plain CSS.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Before launch
- **Content**: all text, services, portfolio and contact details are in `lib/content.js`; there is no database. Values in `[square brackets]` in `contact` and `profile` (phone, email, address, vision, mission, legal status) are placeholders and are hidden from visitors and the chatbot until replaced with real data. Changes go live on the next deploy.
- **Photos**: all photos are local files in `public/images/`: `hero.jpg` (portrait, ≥1400px tall), `about.jpg` (wide 21:9), and one per service: `driver.jpg`, `security.jpg`, `cleaning.jpg` (wide 21:9), `tetap.jpg`. The "Tenaga Borongan" service is a navy card without a photo by design. File names are case-sensitive (`.jpg` ≠ `.jpeg`). Until a file exists, a navy fallback panel shows in its place. Use real photos of the company or licensed stock; stock photos are illustrations, never project documentation. Replace them with real company photos when available (same file name and aspect ratio).
- **Photo credits**: the current photos are stock illustrations from Unsplash under the [Unsplash License](https://unsplash.com/license) (free for commercial use, no attribution required; credited here anyway). They were cropped to the slot ratio and re-encoded as JPEG; colours are unchanged.

  | File | Size | Photographer | Source |
  |---|---|---|---|
  | `hero.jpg` | 1200×1800 | John Kakuk | https://unsplash.com/photos/men-in-safety-vests-standing-in-front-of-a-construction-vehicle-hfj5CG9dvuU |
  | `about.jpg` | 2100×900 | Vitaly Gariev | https://unsplash.com/photos/diverse-business-team-collaborating-in-a-modern-office-_4tpElFQemQ |
  | `driver.jpg` | 1600×1000 | why kei | https://unsplash.com/photos/man-driving-a-car-wearing-wrist-watch-8e2gal_GIE8 |
  | `security.jpg` | 1200×1500 | Krzysztof Hepner | https://unsplash.com/photos/a-security-officer-walking-down-a-street-_D6rTxw4HAI |
  | `cleaning.jpg` | 2100×900 | Verne Ho | https://unsplash.com/photos/man-cleaning-on-floor-beside-white-wall-MwW-zrkYSIU |
  | `tetap.jpg` | 1600×1200 | Centre for Ageing Better | https://unsplash.com/photos/women-walking-through-warehouse-aisle-ZlOlRnWk8zU |
- **Portfolio**: add real projects to `projects` in `lib/content.js` (shape is documented there) with photos at `public/images/projects/<slug>.jpg`. While the list is empty, the Portofolio section and menu item are hidden.
- **Form**: `components/ContactForm.js` opens WhatsApp (`wa.me`) with the visitor's answers as the message; nothing is stored. The WhatsApp number lives in one place: the `WhatsApp` entry of `contact` in `lib/content.js` (any format, e.g. `0812-3456-7890`). It feeds the contact list, footer, form and chatbot. If it is set back to a `[...]` placeholder, the form is disabled and the chatbot stops pointing visitors to it. Tests: `node --test lib/inquiry.test.mjs`.
- **Chatbot**: `components/ChatBot.js` (floating widget) calls `app/api/chat/route.js`, which answers through the NVIDIA API (OpenAI-compatible, model `openai/gpt-oss-20b`) using the content in `lib/content.js`. Set `NVIDIA_API_KEY` in `.env.local`, restart `npm run dev`, and set the same variable on your host (e.g. Vercel). The route needs a Node server, so a static export won't work. There's no per-visitor rate limit yet. Add one before heavy public traffic. Tests: `node --test lib/chat.test.mjs`.
- **Logo**: `public/images/logo.png` is a transparent cut-out of the original logo, and `app/icon.png` is the favicon.
