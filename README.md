# Golden Village — Furniture Collection

Single-page furniture showcase built with **React 18 + TypeScript + Vite + Tailwind CSS + lucide-react**.

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (or: npm run dev -- --port 5180)
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Structure

```
src/
  data/site.ts              brand details, nav links, values, stats  <- edit content here
  data/gallery.ts           indoor / outdoor gallery order and tile sizes
  assets/hero.webp          hero background photo
  assets/gallery/           indoor-NN.webp / outdoor-NN.webp (+ -thumb.webp for the grid)
  App.tsx                   page composition + section headings
  components/
    Navbar.tsx              fixed header, glass-on-scroll, active-section tracking, mobile menu
    ScrollProgress.tsx      gold reading-progress bar
    Hero.tsx                full-bleed hero photo with mouse parallax
    CollectionSection.tsx   indoor (gold) / outdoor (sage) section header + gallery
    Gallery.tsx             image-only 4-column grid (2 on phones), click to enlarge
    Lightbox.tsx            full-size viewer: arrows / keyboard / swipe, Esc to close
    About.tsx               story, stats, value cards
    Footer.tsx              CTA, link columns, contact, socials
    BrandLogo.tsx           "Golden" + gold-gradient "Village" wordmark
  hooks/
    useReveal.ts            IntersectionObserver scroll-reveal
    useScrollProgress.ts    rAF-throttled scroll progress
  index.css                 reveal / zoom / glass / gold-gradient / gallery-grid styles
tailwind.config.js          cream / bark / gold / sage palette, fonts, keyframes
```

## Gallery

Each gallery is a 4-column grid (2 columns on phones) where every row has the same height:

- tall photos take 1 column
- `wide(n)` photos take 2 columns, so landscape shots (sideboards, benches, sofas) are not cut off
- `feature(n)` photos take 2 columns x 2 rows

The order in `src/data/gallery.ts` is arranged so every row is completely filled. To add a photo,
drop `indoor-23.webp` + `indoor-23-thumb.webp` into `src/assets/gallery/indoor/` and add `23`
(or `wide(23)`) to the list, keeping tall photos in pairs.
