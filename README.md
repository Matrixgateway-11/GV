# Golden Village Furnitures — Furnitures • Doors • Flooring

Single-page B2B website ("From Indonesia to the World") built with
**React 18 + TypeScript + Vite + Tailwind CSS + lucide-react**.

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (or: npm run dev -- --port 5180)
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Page

Hero → What We Do → Explore the Collections → Furnitures (+ photos) → Doors (+ photos) →
Flooring (+ photos) → Why Partner With Us → Who We Are + Our Commitment → Get in Touch → footer

## Explore the Collections

Two large cards — **Furniture & Crafts** and **Doors & Flooring**. Clicking one opens a full-screen
collection view with category tabs (All, Chairs, Set Collections, Tables, Stools & Benches, Baskets,
Mirrors, Crafts & Decoration, Rugs & Carpets /
Doors, Flooring), photo counts and the click-to-enlarge viewer. Categories without photos show a
"coming soon" panel. Each view has its own link, e.g. `/#explore/furniture-crafts/chairs`, and the
browser Back button closes it. Edit which photos go in which category in `src/data/collections.ts`.

## Request Catalog form

Every "Request Catalog" button opens a full-screen enquiry page at `/#request-catalog`
(`/#request-catalog/doors`, `/furniture-crafts`, `/flooring` or `/doors-flooring` pre-tick that interest).
It asks for name, email, phone/WhatsApp, company, country, interests and a message, validates as the
visitor goes, keeps an unsent draft for the browser tab, and has a hidden spam trap.

The phone field has a searchable country-code picker (all 245 countries with flags). It pre-selects the
visitor's country from their time zone, and a full number typed as "+44 …" switches the code to match.

Delivery (`src/lib/enquiry.ts` → `api/enquiry.ts`):

- **Once the backend is set up** (see `admin/README.md`) — the form posts to the site's own server function
  `/api/enquiry`, which saves the enquiry for the admin panel (Supabase) and emails it to the team (Resend).
- **Until then** — the function answers "not configured", and "Send Enquiry" opens the visitor's email app
  with the full enquiry addressed to `brand.email` instead. "Send on WhatsApp instead" always works.
  No enquiry is lost either way.

## Admin panel and visit counting

- `admin/` — separate React app (its own Vercel project, Root Directory `admin`) with sign-in, a
  daily / weekly / monthly dashboard and the enquiry inbox. Runs in demo mode until connected.
  **Setup steps: `admin/README.md`.**
- `api/track.ts` + `src/lib/analytics.ts` — anonymous visit counting on the live site (no cookies,
  no IP addresses stored; visitors are told apart by a hash that changes daily).
- `api/enquiry.ts` — stores and emails enquiries; validates on the server, spam trap, max 5 per hour per sender.
- `supabase/schema.sql` — the database tables, access rules and dashboard queries (run once in Supabase).

Website environment variables (Vercel → the website project → Settings → Environment Variables):

| Variable | What it is |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **secret** key (server only — never in `VITE_` variables) |
| `RESEND_API_KEY` | Resend API key, for the new-enquiry emails |
| `ENQUIRY_TO` | Who gets the enquiry emails, comma-separated (the official addresses) |
| `ENQUIRY_FROM` | Optional sender once a domain is verified in Resend, e.g. `Golden Village <website@yourdomain.com>` |

## Structure

```
src/
  data/site.ts        ALL site copy: brand + contact details, hero, product lines + materials, reasons, commitment  <- edit text here
  data/gallery.ts     photo library helper + the one feature photo (and "View the collection" link) per product section
  data/collections.ts the two "Explore the Collections" collections and their category photo lists
  data/countries.ts   countries + dialling codes for the phone picker (flags: public/flags/<iso>.svg)
  data/timezones.ts   time zone -> country, to pre-select the visitor's dialling code
  data/stock.ts       PLACEHOLDER Pexels photos for the Doors / Flooring galleries — replace with real product photos
  assets/brand/       logo mark (house + chair) in dark and light versions
  assets/gallery/     furniture photo library: indoor-NN / outdoor-NN / chairs-NN / dining-NN / rugs-NN .webp (+ -thumb.webp)
  App.tsx             page composition
  components/
    layout/           Navbar, Footer, BrandLogo, ScrollProgress
    sections/         Hero, Intro, ExploreCollections, ProductSection (Furnitures / Doors / Flooring), WhyPartner, About, ContactCta
    collections/      CollectionViewer (full-screen collection view with category tabs)
    enquiry/          EnquiryPage (full-screen Request Catalog page), EnquiryForm, EnquirySuccess, PhoneField, form fields
    gallery/          Gallery (3 per row, 2 on phones, click to enlarge) + Lightbox
    ui/               reusable building blocks: Button, Chips, Container, Reveal, SectionIntro (+ Label,
                      SectionTitle), PinterestIcon
  hooks/              useReveal (scroll-reveal), useScrollProgress, useHashRoute (URL-linked full-screen pages),
                      useCollectionRoute (collection views)
  lib/enquiry.ts      enquiry form fields, validation, and sending (server / email app / WhatsApp)
  lib/analytics.ts    anonymous visit counting (live site only)
  lib/phone.ts        phone helpers: default country, "+code" detection, validation, formatting
  index.css           reveal / zoom / glass / gold-gradient styles
tailwind.config.js    cream / bark / gold / sage palette, fonts, keyframes (incl. marquee)
public/               favicon.png, apple-touch-icon.png, flags/ (country flags, from country-flag-icons, MIT)
api/                  Vercel server functions: enquiry.ts, track.ts (+ _lib/ helpers)
supabase/schema.sql   database setup for enquiries, visits and the admin panel
admin/                the admin panel (separate app — see admin/README.md)
```

## Fonts

- **Fraunces** — headings, the GOLDEN VILLAGE wordmark and accent italics
- **Plus Jakarta Sans** — body text, labels and navigation (an Indonesian-designed typeface)

## Replacing the placeholder door / flooring photos

`src/data/stock.ts` holds the Doors and Flooring galleries (3 photos each). Add the real photos
to `src/assets/gallery/`, list them there (or in `src/data/gallery.ts`) instead of the Pexels links, and
the sections update automatically. Odd-sized galleries show the first photo full-width on phones.
