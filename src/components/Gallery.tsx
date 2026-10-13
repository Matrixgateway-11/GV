import { useCallback, useState, type CSSProperties } from 'react';
import { Maximize2 } from 'lucide-react';
import Lightbox from './Lightbox';
import { useReveal } from '../hooks/useReveal';
import type { GalleryImage } from '../data/gallery';

const spanClasses: Record<GalleryImage['span'], string> = {
  tall: '',
  wide: 'col-span-2',
  feature: 'col-span-2 row-span-2',
};

type GalleryTileProps = {
  image: GalleryImage;
  index: number;
  accentBg: string;
  onOpen: () => void;
};

function GalleryTile({ image, index, accentBg, onOpen }: GalleryTileProps) {
  const ref = useReveal({ rootMargin: '0px 0px -60px 0px' });

  return (
    <div
      ref={ref}
      className={`reveal reveal-up ${spanClasses[image.span]}`}
      style={{ transitionDelay: `${(index % 4) * 80}ms` }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${image.alt}`}
        className="zoom-wrap group relative block w-full h-full overflow-hidden rounded-2xl bg-cream-200 shadow-[0_4px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_60px_rgba(0,0,0,0.12)] transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
      >
        <img
          src={image.span === 'feature' ? image.src : image.thumb}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className="zoom-img absolute inset-0 w-full h-full object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-bark-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-cream-50 ${accentBg} opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-400`}
        >
          <Maximize2 size={15} />
        </span>
      </button>
    </div>
  );
}

type GalleryProps = {
  images: GalleryImage[];
  /** Width / height of a single tile; wide and feature tiles derive from it. */
  tileRatio: number;
  accentBg: string;
  label: string;
};

export default function Gallery({ images, tileRatio, accentBg, label }: GalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <>
      <div className="gallery" style={{ '--tile-ratio': tileRatio } as CSSProperties}>
        <div className="gallery-grid">
          {images.map((image, index) => (
            <GalleryTile
              key={image.src}
              image={image}
              index={index}
              accentBg={accentBg}
              onOpen={() => setOpenIndex(index)}
            />
          ))}
        </div>
      </div>

      <Lightbox images={images} index={openIndex} label={label} onClose={close} onChange={setOpenIndex} />
    </>
  );
}
