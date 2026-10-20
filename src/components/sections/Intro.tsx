import { ArrowRight, Check } from 'lucide-react';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import { Label } from '../ui/SectionIntro';
import { brand, intro, productLines, type ProductLine } from '../../data/site';
import { scrollToSection } from '../../utils/scroll';

function CategoryCard({ line, index }: { line: ProductLine; index: number }) {
  return (
    <Reveal as="article" delay={index * 120} className="snap-start shrink-0 w-[80%] sm:w-[58%] md:w-auto">
      <button
        type="button"
        onClick={() => scrollToSection(line.id)}
        className="zoom-wrap group relative block w-full aspect-[4/5] overflow-hidden rounded-2xl bg-cream-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50"
        aria-label={`Explore ${line.title}`}
      >
        <img
          src={line.card.src}
          srcSet={line.card.srcSet}
          sizes="(min-width: 768px) 33vw, 80vw"
          alt={line.card.alt}
          loading="lazy"
          decoding="async"
          className="zoom-img absolute inset-0 w-full h-full object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-bark-900/90 via-bark-900/25 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
          <span className="block text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.3em] text-gold-400">{line.label}</span>
          <span className="mt-2 block font-serif font-medium text-[2rem] sm:text-[2.4rem] leading-none text-cream-50">{line.title}</span>
          <span className="mt-3 block text-sm text-cream-200/75 font-light">{line.summary}</span>
          <span className="mt-6 inline-flex items-center gap-2 pb-1 border-b border-gold-400/60 text-[11px] font-medium uppercase tracking-[0.25em] text-cream-50 transition-colors group-hover:text-gold-400">
            Explore
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </span>
      </button>
    </Reveal>
  );
}

export default function Intro() {
  return (
    <section id="collections" className="relative bg-cream-50 py-24 lg:py-32 overflow-hidden">
      <div className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full bg-gold-400/10 blur-3xl" />

      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-8">
            <Label>What We Do</Label>
            <p className="mt-7 font-serif text-[1.85rem] leading-[1.28] sm:text-4xl sm:leading-[1.25] lg:text-[2.85rem] lg:leading-[1.2] text-bark-800 text-pretty">
              <span className="gradient-gold italic font-medium">{brand.name}</span> {intro.lead}
            </p>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-4 lg:pt-16">
            <ul className="border-t border-bark-800/10">
              {intro.highlights.map((item) => (
                <li key={item} className="flex items-center gap-3 py-3.5 border-b border-bark-800/10 text-[15px] text-bark-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-400/15">
                    <Check size={13} className="text-gold-600" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="no-scrollbar mt-16 lg:mt-20 -mx-6 px-6 md:mx-0 md:px-0 flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-2 md:pb-0">
          {productLines.map((line, index) => (
            <CategoryCard key={line.id} line={line} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
