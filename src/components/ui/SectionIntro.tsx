import type { ReactNode } from 'react';
import Reveal from './Reveal';

type LabelProps = { children: ReactNode; tone?: 'light' | 'dark'; className?: string };

/** Small uppercase label with a short gold rule before it. */
export function Label({ children, tone = 'light', className = '' }: LabelProps) {
  return (
    <p
      className={`flex items-center gap-3 text-[11px] sm:text-xs font-medium uppercase tracking-[0.32em] ${
        tone === 'dark' ? 'text-gold-400' : 'text-gold-600'
      } ${className}`}
    >
      <span className="h-px w-8 bg-current opacity-70" />
      {children}
    </p>
  );
}

type SectionIntroProps = {
  label: string;
  title: ReactNode;
  /** Optional text shown beside the title on large screens (below it on small ones). */
  aside?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
};

/** Editorial section header: label + large serif title, with an optional aside column. */
export default function SectionIntro({ label, title, aside, tone = 'light', className = '' }: SectionIntroProps) {
  const dark = tone === 'dark';
  return (
    <Reveal className={`grid lg:grid-cols-12 gap-6 lg:gap-12 items-end ${className}`}>
      <div className={aside ? 'lg:col-span-7' : 'lg:col-span-12'}>
        <Label tone={tone}>{label}</Label>
        <h2
          className={`mt-5 font-serif font-medium text-[2.6rem] leading-[1.02] sm:text-5xl lg:text-[4.25rem] tracking-[-0.01em] text-balance ${
            dark ? 'text-cream-50' : 'text-bark-800'
          }`}
        >
          {title}
        </h2>
      </div>
      {aside && (
        <div className={`lg:col-span-5 text-base sm:text-[17px] font-light leading-relaxed ${dark ? 'text-cream-200/70' : 'text-bark-600/80'}`}>
          {aside}
        </div>
      )}
    </Reveal>
  );
}
