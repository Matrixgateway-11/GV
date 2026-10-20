import { useCallback, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import Lightbox from './Lightbox';
import { useReveal } from '../../hooks/useReveal';
import type { GalleryImage } from '../../data/gallery';

type GalleryTileProps = {
  image: GalleryImage;
  index: number;
  /** Span both columns on phones (used to avoid a lone last tile in odd-sized galleries). */
  spanOnPhone?: boolean;
  accentText: string;
  onOpen: () => void;
};

function GalleryTile({ image, index, spanOnPhone = false, accentText, onOpen }: GalleryTileProps) {
  const ref = useReveal({ rootMargin: '0px 0px -60px 0px' });

  return (
    <div ref={ref} className={`reveal reveal-pop ${spanOnPhone ? 'col-span-2 sm:col-span-1' : ''}`} style={{ transitionDelay: `${(index % 3) * 120}ms` }}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${image.alt}`}
        className={`zoom-wrap group relative block w-full ${spanOnPhone ? 'aspect-[4/3] sm:aspect-[3/4]' : 'aspect-[3/4]'} overflow-hidden rounded-xl bg-cream-200 shadow-[0_2px_20px_rgba(19,16,9,0.06)] hover:shadow-[0_14px_40px_rgba(19,16,9,0.14)] transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50`}
      >
        {image.wide && (
          <img
            src={image.thumb}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover scale-125 blur-xl brightness-95"
          />
        )}
        <img
          src={image.thumb}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className={`zoom-img absolute inset-0 w-full h-full ${image.wide ? 'object-contain' : 'object-cover'}`}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-bark-900/55 via-bark-900/0 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500" />
        <span className="absolute left-4 bottom-4 inline-flex items-center gap-2 text-cream-50 text-[11px] font-medium uppercase tracking-[0.25em] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-500">
          <Maximize2 size={13} className={accentText} />
          View
        </span>
      </button>
    </div>
  );
}

type GalleryProps = {
  images: GalleryImage[];
  label: string;
  /** Colour of the small icon on hover. */
  accentText?: string;
  /** Tiles per row on large screens (2 on phones, 3 on tablets either way). */
  columns?: 3 | 4;
  className?: string;
};

export default function Gallery({ images, label, accentText = 'text-gold-400', columns = 3, className = '' }: GalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const gridCols = columns === 4 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3';

  return (
    <>
      <div className={`grid ${gridCols} gap-3 sm:gap-5 lg:gap-7 ${className}`}>
        {images.map((image, index) => (
          <GalleryTile
            key={image.src}
            image={image}
            index={index}
            spanOnPhone={index === 0 && images.length % 2 === 1}
            accentText={accentText}
            onOpen={() => setOpenIndex(index)}
          />
        ))}
      </div>

      <Lightbox images={images} index={openIndex} label={label} onClose={close} onChange={setOpenIndex} />
    </>
  );
}
