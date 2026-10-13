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
  data/gallery.ts           indoor / outdoor photo lists (which ones are landscape)
  assets/hero.webp          hero background photo
  assets/gallery/           indoor-NN.webp / outdoor-NN.webp (+ -thumb.webp for the grid)
  App.tsx                   page composition + section headings
  components/
    Navbar.tsx              fixed header, glass-on-scroll, active-section tracking, mobile menu
    ScrollProgress.tsx      gold reading-progress bar
    Hero.tsx                full-bleed hero photo with mouse parallax
    CollectionSection.tsx   indoor (gold) / outdoor (sage) section header + gallery
    Gallery.tsx             image-only grid, 4 per row (2 on phones), click to enlarge
    Lightbox.tsx            full-size viewer: arrows / keyboard / swipe, Esc to close
    About.tsx               story, stats, value cards
    Footer.tsx              CTA, link columns, contact, socials
    BrandLogo.tsx           "Golden" + gold-gradient "Village" wordmark
  hooks/
    useReveal.ts            IntersectionObserver scroll-reveal
    useScrollProgress.ts    rAF-throttled scroll progress
  index.css                 reveal / zoom / glass / gold-gradient styles
tailwind.config.js          cream / bark / gold / sage palette, fonts, keyframes
```

## Gallery

Each gallery shows 4 photos per row (2 on phones), in file-number order. Every tile has the same
3:4 shape: tall photos fill it, and landscape photos listed as `wide` in `src/data/gallery.ts`
are shown whole over a blurred copy of themselves so furniture is never cropped off.

To add a photo, drop `indoor-23.webp` + `indoor-23-thumb.webp` (640px wide) into
`src/assets/gallery/indoor/` - it appears automatically. If it is a landscape shot, add its
number to the `wide` list.
