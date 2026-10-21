import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import markLight from '../assets/logo-mark-light.png';
import markDark from '../assets/logo-mark-dark.png';
import type { EnquiryStatus } from '../lib/types';

export function BrandLogo({ tone, caption = 'Admin' }: { tone: 'light' | 'dark'; caption?: string }) {
  return (
    <span className="inline-flex items-center gap-3" aria-label={`Golden Village Furnitures ${caption}`}>
      <img src={tone === 'light' ? markLight : markDark} alt="" className="h-10 w-auto shrink-0" />
      <span className="flex flex-col">
        <span className="gradient-gold whitespace-nowrap font-serif text-[1.02rem] font-medium uppercase leading-none tracking-[0.1em]">Golden Village</span>
        <span className={`mt-1.5 text-[9px] font-semibold uppercase tracking-[0.42em] ${tone === 'light' ? 'text-cream-200/70' : 'text-bark-600/70'}`}>
          {caption}
        </span>
      </span>
    </span>
  );
}

export function Card({ title, subtitle, action, children, className = '' }: { title?: ReactNode; subtitle?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-cream-200 bg-white shadow-[0_1px_2px_rgba(19,16,9,0.04)] ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-semibold text-bark-800">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[13px] text-bark-600/65">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="px-5 pb-5 pt-4 sm:px-6">{children}</div>
    </section>
  );
}

type SegmentedProps<T extends string> = { value: T; options: { value: T; label: ReactNode }[]; onChange: (value: T) => void; label: string };

export function Segmented<T extends string>({ value, options, onChange, label }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full border border-cream-300 bg-white p-1">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 sm:px-4 ${
              selected ? 'bg-bark-800 text-cream-50' : 'text-bark-700 hover:text-bark-900'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label className="relative inline-flex cursor-pointer select-none items-center gap-2.5 text-[13px] text-bark-700">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gold-400 peer-focus-visible:ring-offset-2 ${
          checked ? 'bg-bark-800' : 'bg-cream-300'
        }`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? 'left-[1.125rem]' : 'left-0.5'}`} />
      </span>
      {label}
    </label>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; icon?: ReactNode };

export function Button({ variant = 'secondary', icon, children, className = '', ...props }: ButtonProps) {
  const styles = {
    primary: 'bg-bark-800 text-cream-50 hover:bg-gold-500 hover:text-bark-900 border-transparent',
    secondary: 'border-cream-300 bg-white text-bark-700 hover:border-gold-400 hover:text-bark-900',
    ghost: 'border-transparent text-bark-700 hover:bg-cream-100',
  }[variant];
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${styles} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export const Spinner = ({ className = '' }: { className?: string }) => <Loader2 size={18} className={`animate-spin text-gold-600 ${className}`} aria-hidden="true" />;

const statusStyles: Record<EnquiryStatus, { label: string; className: string; dot: string }> = {
  new: { label: 'New', className: 'bg-[#f6ecd9] text-[#6f5219]', dot: 'bg-[#ad7a26]' },
  contacted: { label: 'Contacted', className: 'bg-[#e4eef7] text-[#24507a]', dot: 'bg-[#3a73a8]' },
  closed: { label: 'Closed', className: 'bg-cream-200 text-bark-600', dot: 'bg-bark-600/50' },
};

export const statusLabel = (status: EnquiryStatus) => statusStyles[status].label;

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  const style = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold ${style.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {style.label}
    </span>
  );
}

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/15 text-gold-600">{icon}</span>
      <p className="mt-4 font-semibold text-bark-800">{title}</p>
      {children && <p className="mt-1.5 max-w-sm text-[14px] leading-relaxed text-bark-600/70">{children}</p>}
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
      <span>Couldn&rsquo;t load this: {message}</span>
      <button type="button" onClick={onRetry} className="font-semibold underline-offset-4 hover:underline">
        Try again
      </button>
    </div>
  );
}
