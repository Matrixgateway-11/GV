import { useEffect, useRef } from 'react';
import { ArrowLeft, Images, X } from 'lucide-react';
import Gallery from '../gallery/Gallery';
import Button from '../ui/Button';
import Container from '../ui/Container';
import { Label } from '../ui/SectionIntro';
import type { Collection } from '../../data/collections';
import { mailto } from '../../data/site';

type CollectionViewerProps = {
  collection: Collection;
  /** Active category id ('all' for every photo). */
  category: string;
  /** Plays the exit animation while the viewer is closing. */
  leaving: boolean;
  onCategory: (categoryId: string) => void;
  onClose: () => void;
};

function EmptyCategory({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-cream-300 bg-white/60 px-6 py-12 sm:px-10 sm:py-14 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-400/15 text-gold-600">
        <Images size={24} strokeWidth={1.6} />
      </span>
      <h3 className="mt-5 font-serif font-normal text-2xl sm:text-3xl text-bark-800">{label} — coming soon</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-bark-600/80">
        Photos for this category will be added soon. Contact us for the current catalog and factory price list.
      </p>
      <Button variant="dark" href={mailto(`${label} catalog request`)} className="mt-8">
        Request Catalog
      </Button>
    </div>
  );
}

/** Full-screen view of one collection: cover banner, sticky category tabs and the photo grid. */
export default function CollectionViewer({ collection, category, leaving, onCategory, onClose }: CollectionViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const tabs = [{ id: 'all', label: 'All', images: collection.all }, ...collection.categories];
  const active = tabs.find((tab) => tab.id === category) ?? tabs[0];

  // Lock page scroll while open, move focus in, and give it back on close.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Switching category after scrolling down brings the tab bar back to the top of the view.
  useEffect(() => {
    const scroller = scrollRef.current;
    const bar = tabsRef.current;
    if (scroller && bar && scroller.scrollTop > bar.offsetTop) scroller.scrollTo({ top: bar.offsetTop, behavior: 'smooth' });
  }, [active.id]);

  return (
    <div
      ref={scrollRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-title"
      className={`fixed inset-0 z-[65] overflow-y-auto overscroll-contain bg-cream-50 ${leaving ? 'animate-sheet-out' : 'animate-sheet-in'}`}
    >
      <header className="relative h-[19rem] sm:h-[22rem] lg:h-[25rem] overflow-hidden bg-bark-900">
        <img
          src={collection.cover.src}
          srcSet={collection.cover.srcSet}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bark-900/95 via-bark-900/45 to-bark-900/40" />

        <Container className="relative h-full flex flex-col justify-between py-5 sm:py-7">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-cream-100 hover:text-gold-400 transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={`Close ${collection.title}`}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-100/30 bg-bark-900/30 text-cream-50 backdrop-blur-sm hover:bg-gold-400 hover:border-gold-400 hover:text-bark-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="pb-1">
            <Label tone="dark">{collection.categories.length} Categories</Label>
            <h2 id="collection-title" className="mt-3 font-serif font-light text-cream-50 text-[2.5rem] leading-[1.05] sm:text-6xl tracking-[-0.02em]">
              {collection.title}
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] sm:text-base leading-relaxed text-cream-200/80">{collection.description}</p>
          </div>
        </Container>
      </header>

      <div ref={tabsRef} className="sticky top-0 z-10 glass border-b border-cream-200/80">
        <Container>
          <div role="tablist" aria-label={`${collection.title} categories`} className="no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 flex gap-2 overflow-x-auto py-3.5">
            {tabs.map((tab) => {
              const selected = tab.id === active.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => onCategory(tab.id)}
                  className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                    selected
                      ? 'border-bark-800 bg-bark-800 text-cream-50'
                      : 'border-cream-300 bg-white/70 text-bark-700 hover:border-gold-400 hover:text-bark-800'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[11px] font-semibold ${selected ? 'text-gold-400' : 'text-bark-600/55'}`}>
                    {tab.images.length > 0 ? tab.images.length : 'Soon'}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="py-10 lg:py-14">
        <div role="tabpanel" aria-label={active.label}>
          {active.images.length > 0 ? (
            <>
              <p className="mb-6 text-sm text-bark-600/70">
                {active.images.length} {active.images.length === 1 ? 'photo' : 'photos'}
              </p>
              <Gallery key={`${collection.id}-${active.id}`} images={active.images} label={`${collection.title} — ${active.label}`} columns={4} />
            </>
          ) : (
            <EmptyCategory label={active.label} />
          )}
        </div>
      </Container>
    </div>
  );
}
