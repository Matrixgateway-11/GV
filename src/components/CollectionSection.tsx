import { useState } from 'react';
import ProductCard from './ProductCard';
import { useReveal } from '../hooks/useReveal';
import type { Product } from '../data/site';

export type Accent = {
  text: string;
  bg: string;
  bgSoft: string;
  chipBg: string;
  chipText: string;
};

const accents: Record<'indoor' | 'outdoor', Accent> = {
  indoor: {
    text: 'text-gold-600',
    bg: 'bg-gold-400',
    bgSoft: 'bg-gold-400/10',
    chipBg: 'bg-gold-400/15',
    chipText: 'text-gold-600',
  },
  outdoor: {
    text: 'text-sage-600',
    bg: 'bg-sage-500',
    bgSoft: 'bg-sage-500/10',
    chipBg: 'bg-sage-500/15',
    chipText: 'text-sage-600',
  },
};

type CollectionSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: Product[];
  theme: 'indoor' | 'outdoor';
};

export default function CollectionSection({ id, eyebrow, title, subtitle, items, theme }: CollectionSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const headerRef = useReveal();
  const accent = accents[theme];

  return (
    <section id={id} className="relative py-24 lg:py-32 overflow-hidden">
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 ${accent.bgSoft}`} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={headerRef} className="reveal reveal-up text-center mb-16 lg:mb-20">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${accent.chipBg} mb-6`}>
            <span className={`w-1.5 h-1.5 rounded-full ${accent.bg}`} />
            <span className={`text-xs font-semibold tracking-[0.2em] uppercase ${accent.chipText}`}>{eyebrow}</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-bark-800 leading-tight text-balance">
            {title}
          </h2>
          <p className="mt-5 text-bark-600/70 text-lg font-light max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
          <div className={`mt-8 mx-auto w-20 h-px ${accent.bg} origin-center animate-line-grow`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {items.map((item, index) => (
            <ProductCard
              key={item.id}
              item={item}
              index={index}
              isHovered={hoveredId === item.id}
              onHover={() => setHoveredId(item.id)}
              onLeave={() => setHoveredId(null)}
              accent={accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
