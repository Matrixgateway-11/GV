import type { ReactNode } from 'react';

export type CollageImage = { src: string; srcSet?: string; alt: string };

type ImageCollageProps = {
  main: CollageImage;
  detail: CollageImage;
  /** Which side the smaller overlapping photo sits on. */
  detailSide?: 'left' | 'right';
  /** Border colour around the small photo — match the section background. */
  frame?: 'cream-50' | 'cream-100';
  /** Extra overlay content, e.g. a badge. */
  children?: ReactNode;
};

const frames = { 'cream-50': 'border-cream-50', 'cream-100': 'border-cream-100' };

/** Large portrait photo with a smaller square photo overlapping one bottom corner. */
export default function ImageCollage({ main, detail, detailSide = 'right', frame = 'cream-50', children }: ImageCollageProps) {
  const right = detailSide === 'right';
  return (
    <div className={`relative pb-16 sm:pb-20 ${right ? 'pr-8 sm:pr-14' : 'pl-8 sm:pl-14'}`}>
      <div className="zoom-wrap relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-200 shadow-[0_24px_60px_rgba(19,16,9,0.16)]">
        <img
          src={main.src}
          srcSet={main.srcSet}
          sizes="(min-width: 1024px) 42vw, 90vw"
          alt={main.alt}
          loading="lazy"
          decoding="async"
          className="zoom-img absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div
        className={`absolute bottom-0 ${right ? 'right-0' : 'left-0'} w-[46%] aspect-square overflow-hidden rounded-2xl border-[6px] ${frames[frame]} bg-cream-200 shadow-[0_20px_50px_rgba(19,16,9,0.22)]`}
      >
        <img
          src={detail.src}
          srcSet={detail.srcSet}
          sizes="(min-width: 1024px) 20vw, 42vw"
          alt={detail.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {children}
    </div>
  );
}
