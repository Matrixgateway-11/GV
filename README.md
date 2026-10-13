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
  data/site.ts              brand details, nav links, products, values, stats  <- edit content here
  App.tsx                   page composition + section headings
  components/
    Navbar.tsx              fixed header, glass-on-scroll, active-section tracking, mobile menu
    ScrollProgress.tsx      gold reading-progress bar
    Hero.tsx                split indoor/outdoor hero with mouse parallax
    CollectionSection.tsx   indoor (gold) / outdoor (sage) product grids
    ProductCard.tsx         card with zoom-on-hover + reveal animation
    About.tsx               story, stats, value cards
    Footer.tsx              CTA, link columns, contact, socials
    BrandLogo.tsx           "Golden" + gold-gradient "Village" wordmark
  hooks/
    useReveal.ts            IntersectionObserver scroll-reveal
    useScrollProgress.ts    rAF-throttled scroll progress
  index.css                 reveal / zoom / glass / gold-gradient utilities
tailwind.config.js          cream / bark / gold / sage palette, fonts, keyframes
```

Images are served from Pexels.
