import { ArrowRight } from 'lucide-react';
import Chips from '../ui/Chips';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import { Label, SectionTitle } from '../ui/SectionIntro';
import { productFeatures } from '../../data/gallery';
import { productLines, type ProductLine } from '../../data/site';

type ProductSectionProps = {
  id: ProductLine['id'];
  /** Light cream (default) or the slightly deeper cream, to alternate sections. */
  tone?: 'light' | 'muted';
  /** Put the photo on the right instead of the left (alternate sections for rhythm). */
  reverse?: boolean;
};

/**
 * One product line as an editorial split: a single large feature photo beside the label, title,
 * description, material tags and a link into the full collection view.
 */
export default function ProductSection({ id, tone = 'light', reverse = false }: ProductSectionProps) {
  const line = productLines.find((item) => item.id === id)!;
  const feature = productFeatures[id];
  const { collection, category, label } = feature.explore;
  const exploreHref = `#explore/${collection}${category === 'all' ? '' : `/${category}`}`;

  return (
    <section id={line.id} className={`relative overflow-hidden py-20 lg:py-28 ${tone === 'muted' ? 'bg-cream-100' : 'bg-cream-50'}`}>
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          <Reveal variant={reverse ? 'right' : 'left'} className={`lg:col-span-7 ${reverse ? 'lg:order-2' : ''}`}>
            <figure className="relative">
              {/* Thin gold frame offset behind the photo */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 rounded-3xl border border-gold-400/45 translate-y-4 sm:translate-y-5 ${
                  reverse ? '-translate-x-4 sm:-translate-x-5' : 'translate-x-4 sm:translate-x-5'
                }`}
              />
              <div className="zoom-wrap relative aspect-[4/3] overflow-hidden rounded-3xl bg-cream-200 shadow-[0_30px_70px_-24px_rgba(19,16,9,0.4)]">
                <img
                  src={feature.src}
                  srcSet={feature.srcSet}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  alt={feature.alt}
                  loading="lazy"
                  decoding="async"
                  className="zoom-img absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bark-900/30 via-transparent to-transparent" />
                <figcaption className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 inline-flex items-center gap-2 rounded-full bg-cream-50/90 px-4 py-2 text-[12px] font-medium text-bark-800 shadow-sm backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  {feature.caption}
                </figcaption>
              </div>
            </figure>
          </Reveal>

          <Reveal delay={120} className={`lg:col-span-5 ${reverse ? 'lg:order-1' : ''}`}>
            <Label>{line.label}</Label>
            <SectionTitle className="mt-4">{line.title}</SectionTitle>
            <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-bark-600/85">{line.description}</p>
            <Chips items={line.materials} className="mt-6" />
            <a
              href={exploreHref}
              className="group mt-9 inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-bark-800 transition-colors hover:text-gold-600"
            >
              <span className="border-b border-gold-500/70 pb-1">{label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/60 transition-all duration-300 group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-bark-900">
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
