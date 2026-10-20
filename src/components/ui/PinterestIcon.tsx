import type { SVGProps } from 'react';

type PinterestIconProps = SVGProps<SVGSVGElement> & { size?: number };

/** Outline Pinterest mark, drawn to match lucide's 24px / 2px-stroke icon style. */
export default function PinterestIcon({ size = 24, ...props }: PinterestIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M11.4 10.4 8.6 20.6" />
      <path d="M10.3 14.3c.6.9 1.5 1.4 2.6 1.4 2.4 0 4.1-2 4.1-4.6 0-2.7-2.1-4.6-5-4.6-3 0-5 2-5 4.6 0 1 .3 1.8.9 2.3" />
    </svg>
  );
}
