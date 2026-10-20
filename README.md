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

Hero → What We Do (statement + Furnitures / Doors / Wood Flooring cards) → Furnitures → Doors →
Wood Flooring → Why Partner With Us → Who We Are + Our Commitment → Get in Touch → footer

## Structure

```
src/
  data/site.ts        ALL site copy: brand + contact details, hero, product lines + specs, reasons, commitment  <- edit text here
  data/gallery.ts     which of the furniture photos the Furnitures gallery shows
  data/stock.ts       PLACEHOLDER Pexels photos for Doors / Wood Flooring — replace with real product photos
  assets/brand/       logo mark (house + chair) in dark and light versions
  assets/gallery/     furniture photo library: indoor-NN.webp / outdoor-NN.webp (+ -thumb.webp)
  App.tsx             page composition
  components/
    layout/           Navbar, Footer, BrandLogo, ScrollProgress
    sections/         Hero, Intro, Furnitures, ProductFeature (Doors / Wood Flooring), WhyPartner, About, ContactCta
    gallery/          Gallery (3 per row, 2 on phones, click to enlarge) + Lightbox
    ui/               reusable building blocks: Button, Container, Reveal, SectionIntro + Label,
                      SpecList, ImageCollage, PinterestIcon
  hooks/              useReveal (scroll-reveal), useScrollProgress
  index.css           reveal / zoom / glass / gold-gradient styles
tailwind.config.js    cream / bark / gold / sage palette, fonts, keyframes (incl. marquee)
public/               favicon.png, apple-touch-icon.png
```

## Fonts

- **Cormorant Garamond** — headings and the GOLDEN VILLAGE wordmark
- **Jost** — body text, labels and navigation (close to the logo's tagline)

## Replacing the placeholder door / flooring photos

`src/data/stock.ts` holds the Doors and Wood Flooring images (each has a `main`, `detail` and `card`
photo). Add the real photos to `src/assets/`, import them there instead of the Pexels links, and the
sections update automatically.
