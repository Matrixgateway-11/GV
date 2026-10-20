import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

const variants = {
  /** Gold fill — main call to action. */
  gold: 'bg-gold-400 text-bark-900 hover:bg-gold-500',
  /** Dark fill on light backgrounds. */
  dark: 'bg-bark-800 text-cream-50 hover:bg-gold-500 hover:text-bark-900',
  /** Cream fill on dark / photo backgrounds. */
  light: 'bg-cream-50 text-bark-800 hover:bg-gold-400 hover:text-bark-900 shadow-lg',
  /** Gold outline on light backgrounds. */
  outline: 'border border-gold-500/70 text-bark-800 hover:bg-gold-400 hover:border-gold-400 hover:text-bark-900',
  /** Cream outline on dark backgrounds. */
  outlineLight: 'border border-cream-100/30 text-cream-50 hover:border-gold-400 hover:text-gold-400',
};

type ButtonProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  /** Link target; renders an <a>. Without it a <button> is rendered. */
  href?: string;
  external?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  /** Show the trailing arrow (default true). */
  arrow?: boolean;
  className?: string;
};

export default function Button({ children, variant = 'gold', href, external, onClick, icon, arrow = true, className = '' }: ButtonProps) {
  const classes = `group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full text-[13px] sm:text-sm font-medium uppercase tracking-[0.14em] transition-all duration-300 ${variants[variant]} ${className}`;
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
