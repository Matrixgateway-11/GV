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
  data/gallery.ts           which photos the Furnitures section shows
  assets/hero.webp          hero background photo
  assets/gallery/           indoor-NN.webp / outdoor-NN.webp (+ -thumb.webp for the grid)
  App.tsx                   page composition + section headings
  components/
    Navbar.tsx              fixed header, glass-on-scroll, active-section tracking, mobile menu
    ScrollProgress.tsx      gold reading-progress bar
    Hero.tsx                full-bleed hero photo with mouse parallax
    CollectionSection.tsx   section header + gallery, or an enquiry button
    Gallery.tsx             image-only grid, 3 per row (2 on phones), click to enlarge
    Lightbox.tsx            full-size viewer: arrows / keyboard / swipe, Esc to close
    About.tsx               story, stats, value cards
    Footer.tsx              CTA, link columns, contact, socials
    BrandLogo.tsx           "GOLDEN" + gold-gradient "VILLAGE" wordmark (Cinzel)
  hooks/
    useReveal.ts            IntersectionObserver scroll-reveal
    useScrollProgress.ts    rAF-throttled scroll progress
  index.css                 reveal / zoom / glass / gold-gradient styles
tailwind.config.js          cream / bark / gold / sage palette, fonts, keyframes
```

## Sections & gallery

The page has Furnitures, Doors and Flooring sections (`src/App.tsx`). Furnitures shows 6 photos
in 2 rows of 3 (2 per row on phones), picked in `src/data/gallery.ts` from the photo library in
`src/assets/gallery/` (22 indoor + 32 outdoor). Change a number there to feature a different photo;
tall photos suit the 3:4 tiles best.

Doors and Flooring show an enquiry button until they get photos: add a list in `gallery.ts` and
pass it as `images` to that section in `App.tsx`.
