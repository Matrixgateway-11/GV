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

Hero → What We Do (Furnitures / Doors / Wood Flooring) → Why Partner With Us → Who We Are + Our Commitment → Contact & footer

## Structure

```
src/
  data/site.ts              ALL site copy: brand + contact details, product lines, reasons, commitment  <- edit text here
  data/gallery.ts           which photos the Furnitures gallery shows
  assets/brand/             logo mark + wordmark cut out of the logo, in dark and light (cream) versions
  assets/hero.webp          hero background photo
  assets/gallery/           photo library: indoor-NN.webp / outdoor-NN.webp (+ -thumb.webp)
  App.tsx                   page composition
  components/
    Navbar.tsx              fixed header, glass-on-scroll, active-section tracking, mobile menu, Request Catalog
    BrandLogo.tsx           logo (mark + wordmark), cross-fades between dark / light versions
    Hero.tsx                slogan, intro, Our Collections button, highlights
    WhatWeDo.tsx            the three product lines; Furnitures has the photo gallery,
                            Doors / Wood Flooring show a "gallery coming soon" panel until photos are added
    Gallery.tsx             image-only grid, 3 per row (2 on phones), click to enlarge
    Lightbox.tsx            full-size viewer: arrows / keyboard / swipe, Esc to close
    WhyUs.tsx               "Why Partner With Us?" cards
    About.tsx               Who We Are, audiences, Our Commitment
    Footer.tsx              contact CTA (email + WhatsApp), links, contact details
    SectionHeading.tsx      shared eyebrow + title + gold rule
  hooks/                    useReveal (scroll-reveal), useScrollProgress
  index.css                 reveal / zoom / glass / gold-gradient styles
tailwind.config.js          cream / bark / gold / sage palette, fonts (Playfair Display + Poppins), keyframes
public/                     favicon.png, apple-touch-icon.png
```

## Fonts

- **Playfair Display** — headings; the closest Google Font to the serif in the logo wordmark
- **Poppins** — body text and labels; matches the logo's "FURNITURES • DOORS • FLOORING" tagline

## Adding Doors / Flooring photos

Add the photos to `src/assets/gallery/` (as with indoor/outdoor), list them in `src/data/gallery.ts`,
then render a `<Gallery images={...} />` in that product line's block in `src/components/WhatWeDo.tsx`
in place of the "gallery coming soon" panel.
