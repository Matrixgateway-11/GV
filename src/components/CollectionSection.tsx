import { ArrowRight } from 'lucide-react';
import Gallery from './Gallery';
import { useReveal } from '../hooks/useReveal';
import { brand } from '../data/site';
import type { GalleryImage } from '../data/gallery';

type Accent = {
  bg: string;
  bgSoft: string;
  chipBg: string;
  chipText: string;
};

const accents: Record<'gold' | 'sage', Accent> = {
  gold: {
    bg: 'bg-gold-400',
    bgSoft: 'bg-gold-400/10',
    chipBg: 'bg-gold-400/15',
    chipText: 'text-gold-600',
  },
  sage: {
    bg: 'bg-sage-500',
    bgSoft: 'bg-sage-500/10',
    chipBg: 'bg-sage-500/15',
    chipText: 'text-sage-600',
  },
};

type CollectionSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  theme: 'gold' | 'sage';
  /** Light cream (default) or the slightly deeper cream used to alternate sections. */
  tone?: 'light' | 'muted';
  /** Photos to show. Without photos the section shows an enquiry button instead. */
  images?: GalleryImage[];
  enquiry?: { label: string; subject: string };
};

export default function CollectionSection({
  id,
  eyebrow,
  title,
  subtitle,
  theme,
  tone = 'light',
  images,
  enquiry,
}: CollectionSectionProps) {
  const headerRef = useReveal();
  const accent = accents[theme];
  const hasGallery = !!images?.length;

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${hasGallery ? 'py-24 lg:py-32' : 'py-20 lg:py-24'} ${
        tone === 'muted' ? 'bg-cream-100' : ''
      }`}
    >
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 ${accent.bgSoft}`} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={headerRef} className={`reveal reveal-up text-center ${hasGallery ? 'mb-16 lg:mb-20' : ''}`}>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${accent.chipBg} mb-6`}>
            <span className={`w-1.5 h-1.5 rounded-full ${accent.bg}`} />
            <span className={`text-xs font-semibold tracking-[0.2em] uppercase ${accent.chipText}`}>{eyebrow}</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-bark-800 leading-tight text-balance">
            {title}
          </h2>
          <p className="mt-5 text-bark-600/70 text-lg font-light max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
          <div className={`mt-8 mx-auto w-20 h-px ${accent.bg} origin-center animate-line-grow`} />

          {!hasGallery && enquiry && (
            <a
              href={`mailto:${brand.email}?subject=${encodeURIComponent(enquiry.subject)}`}
              className="group mt-10 inline-flex items-center gap-3 px-8 py-4 rounded-full border border-gold-400 text-gold-600 font-medium tracking-wide hover:bg-gold-400 hover:text-cream-50 transition-all duration-300"
            >
              <span>{enquiry.label}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>

        {images && hasGallery && <Gallery images={images} accentBg={accent.bg} label={eyebrow} />}
      </div>
    </section>
  );
}
