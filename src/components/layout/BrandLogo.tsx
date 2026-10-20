import markDark from '../../assets/brand/logo-mark-dark.png';
import markLight from '../../assets/brand/logo-mark-light.png';
import { taglineText } from '../../data/site';

type BrandLogoProps = {
  /** 'light' = for dark backgrounds (cream chair), 'dark' = for light backgrounds (brown chair). */
  tone: 'light' | 'dark';
  /** Inline (navbar) or stacked with the full tagline (footer). */
  layout?: 'inline' | 'stacked';
  className?: string;
};

/** House + chair mark; both colour versions are stacked and cross-fade when the tone changes. */
function Mark({ tone, className }: { tone: 'light' | 'dark'; className: string }) {
  const showDark = tone === 'dark';
  return (
    <span className={`relative block shrink-0 ${className}`}>
      <img src={markLight} alt="" className={`h-full w-auto transition-opacity duration-300 ${showDark ? 'opacity-0' : 'opacity-100'}`} />
      <img src={markDark} alt="" className={`absolute inset-0 h-full w-auto transition-opacity duration-300 ${showDark ? 'opacity-100' : 'opacity-0'}`} />
    </span>
  );
}

export default function BrandLogo({ tone, layout = 'inline', className = '' }: BrandLogoProps) {
  const subTone = tone === 'light' ? 'text-cream-200/75' : 'text-bark-700/70';

  if (layout === 'stacked') {
    return (
      <span className={`inline-flex items-center gap-4 ${className}`} aria-label="Golden Village Furnitures">
        <Mark tone={tone} className="h-16" />
        <span className="flex flex-col">
          <span className="gradient-gold font-serif font-semibold uppercase tracking-[0.16em] text-[1.6rem] leading-none">Golden Village</span>
          <span className={`mt-2 text-[10px] font-medium uppercase tracking-[0.5em] ${subTone}`}>Furnitures</span>
          <span className="mt-3 text-[9px] uppercase tracking-[0.3em] text-gold-400/80">{taglineText}</span>
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="Golden Village Furnitures">
      <Mark tone={tone} className="h-10 sm:h-11" />
      <span className="flex flex-col">
        <span className="gradient-gold font-serif font-semibold uppercase tracking-[0.14em] text-[1.05rem] sm:text-[1.2rem] leading-none">
          Golden Village
        </span>
        <span className={`mt-1.5 text-[8.5px] sm:text-[9px] font-medium uppercase tracking-[0.55em] transition-colors duration-300 ${subTone}`}>
          Furnitures
        </span>
      </span>
    </span>
  );
}
