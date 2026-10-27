import type { CSSProperties } from 'react';
import { Leaf } from 'lucide-react';
import Chips from '../ui/Chips';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import SectionIntro from '../ui/SectionIntro';
import { aboutImages, audiences, commitment, intro } from '../../data/site';

type AboutPhoto = (typeof aboutImages)[keyof typeof aboutImages];

/** Each photo keeps its own landscape shape (no crop, no padding), so rows are sized by the photos themselves. */
const shape = (image: AboutPhoto): CSSProperties => ({ aspectRatio: `${image.width} / ${image.height}` });

const Caption = ({ children, className = '' }: { children: string; className?: string }) => (
  <figcaption
    className={`absolute bottom-4 left-4 sm:bottom-6 sm:left-6 items-center gap-2 rounded-full bg-cream-50/90 px-4 py-2 text-[12px] font-medium text-bark-800 shadow-sm backdrop-blur-md ${className}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
    {children}
  </figcaption>
);

export default function About() {
  const { main, detail } = aboutImages;
  return (
    <section id="about" className="relative bg-cream-50 py-20 lg:py-28 overflow-hidden">
      <Container>
        <SectionIntro
          label="Who We Are"
          title={
            <>
              Authentic Indonesian <span className="gradient-gold italic">craftsmanship</span>
            </>
          }
          aside={
            <>
              <p>{intro.partners}</p>
              <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-bark-600/60">We partner with</p>
              <Chips items={audiences} className="mt-3" />
            </>
          }
        />

        {/* Wide lookbook photo across the full content width. */}
        <Reveal className="mt-12 lg:mt-16">
          <figure
            className="zoom-wrap relative overflow-hidden rounded-3xl bg-cream-200 shadow-[0_30px_70px_-24px_rgba(19,16,9,0.4)]"
            style={shape(main)}
          >
            <img
              src={main.src}
              srcSet={main.srcSet}
              sizes="(min-width: 1280px) 1200px, 94vw"
              alt={main.alt}
              width={main.width}
              height={main.height}
              loading="lazy"
              decoding="async"
              className="zoom-img absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bark-900/25 via-transparent to-transparent" />
            <Caption className="hidden sm:inline-flex">{main.caption}</Caption>
            <div className="absolute right-3 top-3 sm:right-6 sm:top-6 flex items-center gap-2 sm:gap-3 rounded-full sm:rounded-xl bg-cream-50/90 px-3 py-1.5 sm:px-4 sm:py-3 shadow-[0_10px_40px_rgba(19,16,9,0.15)] backdrop-blur-md">
              <span className="flex h-5 w-5 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-sage-500/15">
                <Leaf className="h-3 w-3 sm:h-[17px] sm:w-[17px] text-sage-600" />
              </span>
              <span>
                <span className="block font-serif font-semibold text-[12px] sm:text-lg leading-tight text-bark-800">SVLK Certified</span>
                <span className="hidden sm:block text-xs text-bark-600/70">Legally sourced wood</span>
              </span>
            </div>
          </figure>
        </Reveal>

        {/* Second photo + commitment, on the same columns as the header above. */}
        <div className="mt-6 lg:mt-8 grid lg:grid-cols-12 gap-10 lg:gap-12 lg:items-center">
          {/* Below desktop width the rows stack: the small photo is narrower and set to the right, so it never outsizes the wide one. */}
          <Reveal className="lg:col-span-5 w-[82%] sm:w-[68%] lg:w-full ml-auto lg:ml-0">
            <figure className="zoom-wrap relative overflow-hidden rounded-3xl bg-cream-200 shadow-[0_24px_60px_-24px_rgba(19,16,9,0.35)]" style={shape(detail)}>
              <img
                src={detail.src}
                srcSet={detail.srcSet}
                sizes="(min-width: 1024px) 40vw, 94vw"
                alt={detail.alt}
                width={detail.width}
                height={detail.height}
                loading="lazy"
                decoding="async"
                className="zoom-img absolute inset-0 h-full w-full object-cover"
              />
              <Caption className="inline-flex">{detail.caption}</Caption>
            </figure>
          </Reveal>

          <Reveal as="figure" delay={120} className="lg:col-span-7 border-l-2 border-gold-400 pl-6 sm:pl-8 lg:pl-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-600">Our Commitment</p>
            <blockquote className="mt-4 font-serif font-light italic text-[1.5rem] sm:text-[1.85rem] lg:text-[2.1rem] leading-snug text-bark-800 text-balance">
              &ldquo;{commitment.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 max-w-xl text-[15px] sm:text-base leading-relaxed text-bark-600/85">{commitment.text}</figcaption>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
