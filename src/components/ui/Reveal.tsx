import { createElement, type ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';

type RevealProps = {
  children: ReactNode;
  /** Direction the element animates in from. */
  variant?: 'up' | 'left' | 'right' | 'pop' | 'scale';
  /** Stagger delay in ms. */
  delay?: number;
  as?: 'div' | 'li' | 'figure' | 'article';
  className?: string;
  id?: string;
};

/** Fades / slides its children in once they scroll into view. */
export default function Reveal({ children, variant = 'up', delay = 0, as = 'div', className = '', id }: RevealProps) {
  const ref = useReveal<HTMLElement>({ rootMargin: '0px 0px -60px 0px' });

  return createElement(
    as,
    {
      ref,
      id,
      className: `reveal reveal-${variant} ${className}`,
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children,
  );
}
