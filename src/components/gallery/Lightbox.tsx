import { useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryImage } from '../../data/gallery';

type LightboxProps = {
  images: GalleryImage[];
  index: number | null;
  label: string;
  onClose: () => void;
  onChange: (index: number) => void;
};

const controlClasses =
  'absolute flex items-center justify-center w-11 h-11 rounded-full bg-cream-50/10 text-cream-50 border border-cream-100/20 backdrop-blur-sm hover:bg-gold-400 hover:border-gold-400 hover:text-bark-900 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400';

export default function Lightbox({ images, index, label, onClose, onChange }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const open = index !== null;
  const count = images.length;

  const step = useCallback(
    (delta: number) => {
      if (index !== null) onChange((index + delta + count) % count);
    },
    [index, count, onChange],
  );

  // Lock page scroll while open, move focus in, and give it back on close.
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // Capture phase + stopPropagation: Esc closes only the photo, not a collection view underneath.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else return;
      e.stopImmediatePropagation();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, step, onClose]);

  if (index === null) return null;
  const image = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${label} gallery`}
      onClick={onClose}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-bark-900/95 backdrop-blur-sm animate-fade-in"
    >
      <img
        key={image.src}
        src={image.src}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[82vh] max-w-[88vw] md:max-w-[80vw] rounded-xl object-contain shadow-2xl animate-fade-in"
      />

      <button
        ref={closeRef}
        type="button"
        aria-label="Close gallery"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={`${controlClasses} top-4 right-4 md:top-6 md:right-6`}
      >
        <X size={20} />
      </button>

      <button
        type="button"
        aria-label="Previous photo"
        onClick={(e) => {
          e.stopPropagation();
          step(-1);
        }}
        className={`${controlClasses} left-3 md:left-6 top-1/2 -translate-y-1/2`}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        aria-label="Next photo"
        onClick={(e) => {
          e.stopPropagation();
          step(1);
        }}
        className={`${controlClasses} right-3 md:right-6 top-1/2 -translate-y-1/2`}
      >
        <ChevronRight size={22} />
      </button>

      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-cream-200/70 text-xs font-medium tracking-[0.25em]">
        {index + 1} / {count}
      </p>
    </div>
  );
}
