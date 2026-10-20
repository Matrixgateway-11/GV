import type { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  /** 'light' for cream backgrounds, 'dark' for the dark sections. */
  tone?: 'light' | 'dark';
  accent?: 'gold' | 'sage';
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'light',
  accent = 'gold',
  className = '',
}: SectionHeadingProps) {
  const ref = useReveal();
  const centered = align === 'center';
  const dot = accent === 'gold' ? 'bg-gold-400' : 'bg-sage-500';
  const chip =
    tone === 'dark'
      ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20'
      : accent === 'gold'
        ? 'bg-gold-400/15 text-gold-600'
        : 'bg-sage-500/15 text-sage-600';

  return (
    <div ref={ref} className={`reveal reveal-up ${centered ? 'text-center' : ''} ${className}`}>
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 sm:mb-6 ${chip}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase">{eyebrow}</span>
      </div>
      <h2
        className={`font-serif text-[2rem] leading-tight sm:text-4xl md:text-5xl lg:text-[3.25rem] text-balance ${
          tone === 'dark' ? 'text-cream-50' : 'text-bark-800'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 text-base sm:text-lg font-light leading-relaxed ${centered ? 'max-w-2xl mx-auto' : 'max-w-xl'} ${
            tone === 'dark' ? 'text-cream-200/70' : 'text-bark-600/75'
          }`}
        >
          {subtitle}
        </p>
      )}
      <div className={`mt-7 w-20 h-px ${dot} ${centered ? 'mx-auto origin-center' : 'origin-left'} animate-line-grow`} />
    </div>
  );
}
