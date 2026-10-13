import { ArrowUpRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import type { Product } from '../data/site';
import type { Accent } from './CollectionSection';

type ProductCardProps = {
  item: Product;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  accent: Accent;
};

const directions = ['reveal-left', 'reveal-up', 'reveal-right'];

export default function ProductCard({ item, index, isHovered, onHover, onLeave, accent }: ProductCardProps) {
  const ref = useReveal({ rootMargin: '0px 0px -60px 0px' });

  return (
    <div ref={ref} className={`reveal ${directions[index % 3]}`}>
      <article
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className="group relative bg-cream-50 rounded-2xl overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_60px_rgba(0,0,0,0.12)] transition-all duration-500"
      >
        <div className="zoom-wrap relative aspect-[4/5] overflow-hidden">
          <img src={item.image} alt={item.name} loading="lazy" className="zoom-img absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bark-900/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${accent.chipBg} ${accent.chipText} backdrop-blur-sm`}>
              {item.category}
            </span>
          </div>

          <div
            className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-400 ${
              isHovered ? `${accent.bg} text-cream-50 opacity-100 scale-100` : 'bg-cream-50/80 text-bark-700 opacity-0 scale-75'
            }`}
          >
            <ArrowUpRight size={16} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-serif text-2xl text-cream-50 font-medium leading-tight">{item.name}</h3>
          </div>
        </div>

        <div className="p-5">
          <p className="text-bark-600/70 text-sm font-light leading-relaxed">{item.description}</p>
        </div>
      </article>
    </div>
  );
}
