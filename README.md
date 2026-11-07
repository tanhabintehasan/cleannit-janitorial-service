# Cleannit Janitorial Services — Website

Next.js 14 website with a built-in, password-protected admin panel. All content (text, images, services, locations, FAQs, schema data, contact info) is editable at `/admin` without touching code.

## Run locally

```bash
npm install
npm run build
npm start        # http://localhost:3000
```

## Admin panel

- URL: `/admin`
- Default login: **admin / Cleannit2026!** — change it immediately in the **Password** tab.
- Tabs: Global Settings · **Schema Markup Data** · Pages · Services · Locations · Blog · Messages (contact-form inbox) · Password.
- Every save re-renders the live site, JSON-LD schemas, sitemap.xml and llm.txt automatically. Editing a service/location/post refreshes its "Last updated" date.
- Image uploads auto-convert to WebP, auto-resize to ≤1600px and suggest alt text.

## Deployment (cPanel-friendly)

1. In cPanel: **Setup Node.js App** → Node 18+, application root = this folder, startup file: `server.js` (create: `require('next')` server) or use `npm start` via the app's "Run NPM Script".
2. Run `npm install` and `npm run build` on the server (or upload `.next` from a local build).
3. Set env `ADMIN_SECRET` to a long random string (session signing).
4. Point the domain's document root/proxy to the Node app port.
5. Ensure the `data/` and `public/uploads/` directories are writable and backed up — they hold all edited content.

## Structure

- `app/` — routes (pages + API). `app/admin/` — admin UI. `app/llm.txt/route.js` — llm.txt.
- `lib/default-content.js` — factory content seed. `data/content.json` — live content (created on first run; edit via admin).
- `lib/schema.js` — all JSON-LD generated from admin "Schema Markup Data".
- `public/images/` — optimized WebP images (real company photos + licensed stock).

## SEO files

- `/sitemap.xml` — auto-generated from content.
- `/robots.txt` — allows all, blocks `/admin` and `/api`.
- `/llm.txt` — Markdown plain-text business summary for LLM crawlers, linked in the footer.
