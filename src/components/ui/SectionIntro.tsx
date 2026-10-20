import type { ReactNode } from 'react';
import Reveal from './Reveal';

type LabelProps = { children: ReactNode; tone?: 'light' | 'dark'; className?: string };

/** Small uppercase label with a short gold rule before it. */
export function Label({ children, tone = 'light', className = '' }: LabelProps) {
  return (
    <p
      className={`flex items-center gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] ${
        tone === 'dark' ? 'text-gold-400' : 'text-gold-600'
      } ${className}`}
    >
      <span className="h-px w-7 bg-current opacity-70" />
      {children}
    </p>
  );
}

/** Shared large serif section title. */
export function SectionTitle({ children, tone = 'light', className = '' }: { children: ReactNode; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <h2
      className={`font-serif font-normal text-[2.25rem] leading-[1.08] sm:text-[2.75rem] lg:text-[3.25rem] tracking-[-0.015em] text-balance ${
        tone === 'dark' ? 'text-cream-50' : 'text-bark-800'
      } ${className}`}
    >
      {children}
    </h2>
  );
}

type SectionIntroProps = {
  label: string;
  title: ReactNode;
  /** Optional content shown beside the title on large screens (below it on small ones). */
  aside?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
};

/** Section header: label + serif title, with an optional aside column vertically centred beside it. */
export default function SectionIntro({ label, title, aside, tone = 'light', className = '' }: SectionIntroProps) {
  const dark = tone === 'dark';
  return (
    <Reveal className={`grid lg:grid-cols-12 gap-5 lg:gap-12 lg:items-center ${className}`}>
      <div className={aside ? 'lg:col-span-5' : 'lg:col-span-12'}>
        <Label tone={tone}>{label}</Label>
        <SectionTitle tone={tone} className="mt-4">
          {title}
        </SectionTitle>
      </div>
      {aside && (
        <div className={`lg:col-span-7 text-[15px] sm:text-base leading-relaxed ${dark ? 'text-cream-200/70' : 'text-bark-600/85'}`}>
          {aside}
        </div>
      )}
    </Reveal>
  );
}
