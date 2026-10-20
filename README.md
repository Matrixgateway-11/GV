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
collection view with category tabs (All, Chairs, Living Set, Tables, Lampshade, Rugs & Carpets /
Doors, Flooring), photo counts and the click-to-enlarge viewer. Categories without photos show a
"coming soon" panel. Each view has its own link, e.g. `/#explore/furniture-crafts/chairs`, and the
browser Back button closes it. Edit which photos go in which category in `src/data/collections.ts`.

## Structure

```
src/
  data/site.ts        ALL site copy: brand + contact details, hero, product lines + materials, reasons, commitment  <- edit text here
  data/gallery.ts     photo library helper + the one feature photo (and "View the collection" link) per product section
  data/collections.ts the two "Explore the Collections" collections and their category photo lists
  data/stock.ts       PLACEHOLDER Pexels photos for the Doors / Flooring galleries — replace with real product photos
  assets/brand/       logo mark (house + chair) in dark and light versions
  assets/gallery/     furniture photo library: indoor-NN / outdoor-NN / chairs-NN / dining-NN / rugs-NN .webp (+ -thumb.webp)
  App.tsx             page composition
  components/
    layout/           Navbar, Footer, BrandLogo, ScrollProgress
    sections/         Hero, Intro, ExploreCollections, ProductSection (Furnitures / Doors / Flooring), WhyPartner, About, ContactCta
    collections/      CollectionViewer (full-screen collection view with category tabs)
    gallery/          Gallery (3 per row, 2 on phones, click to enlarge) + Lightbox
    ui/               reusable building blocks: Button, Chips, Container, Reveal, SectionIntro (+ Label,
                      SectionTitle), ImageCollage, PinterestIcon
  hooks/              useReveal (scroll-reveal), useScrollProgress, useCollectionRoute (URL-linked collection views)
  index.css           reveal / zoom / glass / gold-gradient styles
tailwind.config.js    cream / bark / gold / sage palette, fonts, keyframes (incl. marquee)
public/               favicon.png, apple-touch-icon.png
```

## Fonts

- **Fraunces** — headings, the GOLDEN VILLAGE wordmark and accent italics
- **Plus Jakarta Sans** — body text, labels and navigation (an Indonesian-designed typeface)

## Replacing the placeholder door / flooring photos

`src/data/stock.ts` holds the Doors and Flooring galleries (3 photos each). Add the real photos
to `src/assets/gallery/`, list them there (or in `src/data/gallery.ts`) instead of the Pexels links, and
the sections update automatically. Odd-sized galleries show the first photo full-width on phones.
