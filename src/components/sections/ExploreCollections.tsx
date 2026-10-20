import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import CollectionViewer from '../collections/CollectionViewer';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import SectionIntro from '../ui/SectionIntro';
import { collections, type Collection } from '../../data/collections';
import { useCollectionRoute } from '../../hooks/useCollectionRoute';

function CollectionCard({ collection, index, onOpen }: { collection: Collection; index: number; onOpen: () => void }) {
  const categoryLabels = collection.categories.map((category) => category.label).join(' · ');

  return (
    <Reveal as="article" delay={index * 120}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Explore ${collection.title}`}
        className="zoom-wrap group relative block w-full overflow-hidden rounded-2xl bg-bark-900 text-left aspect-[4/5] sm:aspect-[5/6] lg:aspect-[6/7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50"
      >
        <img
          src={collection.cover.src}
          srcSet={collection.cover.srcSet}
          sizes="(min-width: 768px) 50vw, 100vw"
          alt={collection.cover.alt}
          loading="lazy"
          decoding="async"
          className="zoom-img absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-bark-900/90 via-bark-900/25 to-bark-900/5" />
        <span className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-400">
            {collection.categories.length} Categories
          </span>
          <span className="mt-3 block font-serif font-light text-[2.4rem] leading-[1.02] sm:text-5xl lg:text-[3.4rem] tracking-[-0.02em] text-cream-50">
            {collection.title}
          </span>
          <span className="mt-4 block max-w-md text-sm leading-relaxed text-cream-200/80">{categoryLabels}</span>
          <span className="mt-7 inline-flex items-center gap-2 border-b border-gold-400/70 pb-1 text-[12px] font-semibold uppercase tracking-[0.24em] text-cream-50 transition-colors group-hover:text-gold-400">
            Explore
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </span>
      </button>
    </Reveal>
  );
}

type OpenView = { collection: Collection; category: string };

/** "Explore the Collections": two large cards that open a full-screen, URL-linked collection viewer. */
export default function ExploreCollections() {
  const { route, open, selectCategory, close } = useCollectionRoute();
  const current = collections.find((collection) => collection.id === route?.collection) ?? null;
  const category = route?.category ?? 'all';

  // Keep the last view mounted for a moment after closing so it can animate out.
  const [view, setView] = useState<OpenView | null>(current ? { collection: current, category } : null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (current) {
      setView({ collection: current, category });
      setLeaving(false);
      return;
    }
    if (!view) return;
    setLeaving(true);
    const timer = window.setTimeout(() => {
      setView(null);
      setLeaving(false);
    }, 250);
    return () => window.clearTimeout(timer);
    // `view` is read only to decide whether an exit animation is needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, category]);

  return (
    <section id="explore" className="relative bg-cream-50 pt-2 pb-20 lg:pb-24">
      <Container>
        <SectionIntro
          label="Collections"
          title={
            <>
              Explore the <span className="gradient-gold italic">Collections</span>
            </>
          }
          aside={<p>Browse our full range by category — open a collection to see every design inside it.</p>}
        />

        <div className="mt-10 lg:mt-12 grid gap-5 sm:gap-6 md:grid-cols-2">
          {collections.map((collection, index) => (
            <CollectionCard key={collection.id} collection={collection} index={index} onOpen={() => open(collection.id)} />
          ))}
        </div>
      </Container>

      {view && (
        <CollectionViewer
          collection={view.collection}
          category={view.category}
          leaving={leaving}
          onCategory={(categoryId) => selectCategory(view.collection.id, categoryId)}
          onClose={close}
        />
      )}
    </section>
  );
}
