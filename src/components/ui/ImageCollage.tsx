import type { ReactNode } from 'react';

/** `width` / `height` are the photo's own pixel size — the frame takes the same shape, so nothing is cropped. */
export type CollageImage = { src: string; srcSet?: string; alt: string; width: number; height: number };

type ImageCollageProps = {
  /** Wide photo across the top. */
  main: CollageImage;
  /** Smaller photo overlapping the main photo's lower-right corner. */
  detail: CollageImage;
  /** Shown in the space beside the small photo, e.g. a badge. */
  badge?: ReactNode;
};

/** Two landscape photos, each shown whole in its own proportions — a wide main photo and a smaller one tucked under it. */
export default function ImageCollage({ main, detail, badge }: ImageCollageProps) {
  return (
    <div className="relative">
      {/* Thin gold outline set behind the main photo, offset up and to the left. */}
      <div
        aria-hidden="true"
        className="absolute -left-3 -top-3 w-[72%] rounded-2xl border border-gold-400/50 sm:-left-5 sm:-top-5"
        style={{ aspectRatio: `${(main.width * 0.72) / (main.height * 0.82)}` }}
      />
      <div
        className="zoom-wrap relative overflow-hidden rounded-2xl bg-cream-200 shadow-[0_24px_60px_rgba(19,16,9,0.16)]"
        style={{ aspectRatio: `${main.width} / ${main.height}` }}
      >
        <img
          src={main.src}
          srcSet={main.srcSet}
          sizes="(min-width: 1024px) 52vw, 92vw"
          alt={main.alt}
          width={main.width}
          height={main.height}
          loading="lazy"
          decoding="async"
          className="zoom-img absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* The small photo rises a little over the main one. The badge sits beside it, centred in the space
          below the main photo (the top padding equals the overlap, as both are a share of the width). */}
      <div className="relative -mt-[7%] flex justify-end gap-4 sm:gap-7">
        {badge && <div className="flex min-w-0 flex-1 items-center justify-center pt-[7%]">{badge}</div>}
        <div
          className="zoom-wrap relative w-[56%] shrink-0 overflow-hidden rounded-2xl border-[6px] border-cream-50 bg-cream-200 shadow-[0_20px_50px_rgba(19,16,9,0.22)] sm:w-[54%]"
          style={{ aspectRatio: `${detail.width} / ${detail.height}` }}
        >
          <img
            src={detail.src}
            srcSet={detail.srcSet}
            sizes="(min-width: 1024px) 28vw, 56vw"
            alt={detail.alt}
            width={detail.width}
            height={detail.height}
            loading="lazy"
            decoding="async"
            className="zoom-img absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
