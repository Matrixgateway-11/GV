import { useCallback, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import Lightbox from './Lightbox';
import { useReveal } from '../hooks/useReveal';
import type { GalleryImage } from '../data/gallery';

type GalleryTileProps = {
  image: GalleryImage;
  index: number;
  accentBg: string;
  onOpen: () => void;
};

function GalleryTile({ image, index, accentBg, onOpen }: GalleryTileProps) {
  const ref = useReveal({ rootMargin: '0px 0px -60px 0px' });

  return (
    <div ref={ref} className="reveal reveal-up" style={{ transitionDelay: `${(index % 4) * 80}ms` }}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${image.alt}`}
        className="zoom-wrap group relative block w-full aspect-[3/4] overflow-hidden rounded-xl bg-cream-200 shadow-[0_4px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
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
        <span className="absolute inset-0 bg-gradient-to-t from-bark-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center text-cream-50 ${accentBg} opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-400`}
        >
          <Maximize2 size={14} />
        </span>
      </button>
    </div>
  );
}

type GalleryProps = {
  images: GalleryImage[];
  accentBg: string;
  label: string;
};

export default function Gallery({ images, accentBg, label }: GalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <>
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
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

      <Lightbox images={images} index={openIndex} label={label} onClose={close} onChange={setOpenIndex} />
    </>
  );
}
