import type { ReactNode } from 'react';

const widths = {
  default: 'max-w-7xl',
  narrow: 'max-w-5xl',
  wide: 'max-w-[90rem]',
};

type ContainerProps = {
  children: ReactNode;
  size?: keyof typeof widths;
  className?: string;
};

/** Centred page-width wrapper with the site's standard side gutters. */
export default function Container({ children, size = 'default', className = '' }: ContainerProps) {
  return <div className={`${widths[size]} mx-auto px-6 lg:px-10 ${className}`}>{children}</div>;
}
