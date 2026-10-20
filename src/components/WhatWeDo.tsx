import { ArrowRight } from 'lucide-react';
import Gallery from './Gallery';
import SectionHeading from './SectionHeading';
import { useReveal } from '../hooks/useReveal';
import { mailto, productLines, type ProductLine } from '../data/site';
import { furnitureGallery } from '../data/gallery';

const [furnitures, doors, flooring] = productLines;

function MaterialChips({ items, centered = false }: { items: string[]; centered?: boolean }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${centered ? 'justify-center' : ''}`}>
      {items.map((item) => (
        <li key={item} className="px-3.5 py-1.5 rounded-full border border-gold-400/35 bg-cream-50 text-bark-700 text-xs sm:text-[13px]">
          {item}
        </li>
      ))}
    </ul>
  );
}

function EnquiryButton({ line, solid = false }: { line: ProductLine; solid?: boolean }) {
  return (
    <a
      href={mailto(line.enquiry.subject)}
      className={`group inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm sm:text-[15px] font-medium tracking-wide transition-all duration-300 ${
        solid
          ? 'bg-bark-800 text-cream-50 hover:bg-gold-500'
          : 'border border-gold-400 text-gold-600 hover:bg-gold-400 hover:text-cream-50'
      }`}
    >
      <span>{line.enquiry.label}</span>
      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </a>
  );
}

function LineTitle({ line, centered = false }: { line: ProductLine; centered?: boolean }) {
  return (
    <>
      <div className={`flex items-center gap-3 mb-4 ${centered ? 'justify-center' : ''}`}>
        <span className="font-serif italic text-gold-500 text-xl">{line.number}</span>
        <span className="h-px w-10 bg-gold-400/60" />
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gold-600">{line.eyebrow}</span>
      </div>
      <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-bark-800 leading-tight">{line.title}</h3>
      <p className={`mt-4 text-base sm:text-lg text-bark-600/80 font-light leading-relaxed ${centered ? 'max-w-2xl mx-auto' : ''}`}>
        {line.description}
      </p>
    </>
  );
}

/** Simple gold line art used until real door / flooring photos are added. */
function DoorArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 140" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M8 136V4h80v132" />
      <path d="M2 136h92" />
      <rect x="16" y="12" width="64" height="124" rx="1" />
      <rect x="24" y="20" width="48" height="46" rx="1" />
      <rect x="24" y="76" width="48" height="52" rx="1" />
      <path d="M32 28h32M32 58h32" opacity="0.45" />
      <circle cx="71" cy="71" r="2.5" />
    </svg>
  );
}

function FloorArt({ className }: { className?: string }) {
  const cells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = col * 40;
      const y = row * 40;
      const lines = (row + col) % 2 === 0 ? [`M${x} ${y + 13.3}h40`, `M${x} ${y + 26.6}h40`] : [`M${x + 13.3} ${y}v40`, `M${x + 26.6} ${y}v40`];
      cells.push(...lines.map((d) => <path key={d} d={d} />));
    }
  }
  return (
    <svg viewBox="-1 -1 122 122" fill="none" stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden="true">
      <rect x="0" y="0" width="120" height="120" rx="2" />
      <path d="M40 0v120M80 0v120M0 40h120M0 80h120" />
      {cells}
    </svg>
  );
}

function ComingSoonPanel({ line }: { line: ProductLine }) {
  return (
    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-bark-900 shadow-[0_24px_60px_rgba(19,16,9,0.22)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.2),transparent_65%)]" />
      <div className="absolute inset-4 sm:inset-6 rounded-2xl border border-gold-400/20" />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
        {line.id === 'doors' ? (
          <DoorArt className="h-28 sm:h-36 text-gold-400" />
        ) : (
          <FloorArt className="h-24 sm:h-32 text-gold-400" />
        )}
        <p className="mt-6 font-serif text-xl sm:text-2xl text-cream-50">{line.title} gallery coming soon</p>
        <p className="mt-2 text-sm text-cream-200/60 font-light">Full catalog available on request</p>
      </div>
    </div>
  );
}

function FurnituresBlock() {
  const ref = useReveal();
  return (
    <div id={furnitures.id} className="scroll-mt-24">
      <div ref={ref} className="reveal reveal-up max-w-3xl mx-auto text-center mb-10 lg:mb-14">
        <LineTitle line={furnitures} centered />
        <div className="mt-6">
          <MaterialChips items={furnitures.materials} centered />
        </div>
      </div>
      <Gallery images={furnitureGallery} accentBg="bg-gold-400" label={furnitures.eyebrow} />
      <div className="mt-10 lg:mt-12 text-center">
        <EnquiryButton line={furnitures} />
      </div>
    </div>
  );
}

function FeatureBlock({ line, reverse = false }: { line: ProductLine; reverse?: boolean }) {
  const textRef = useReveal();
  const panelRef = useReveal({ rootMargin: '0px 0px -60px 0px' });
  return (
    <div id={line.id} className="scroll-mt-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div ref={textRef} className={`reveal ${reverse ? 'reveal-right lg:order-2' : 'reveal-left'}`}>
        <LineTitle line={line} />
        <div className="mt-6">
          <MaterialChips items={line.materials} />
        </div>
        <div className="mt-8">
          <EnquiryButton line={line} solid />
        </div>
      </div>
      <div ref={panelRef} className={`reveal ${reverse ? 'reveal-left lg:order-1' : 'reveal-right'}`}>
        <ComingSoonPanel line={line} />
      </div>
    </div>
  );
}

export default function WhatWeDo() {
  return (
    <section id="collections" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 bg-gold-400/10" />
      <div className="absolute bottom-1/4 -left-40 w-[420px] h-[420px] rounded-full blur-3xl opacity-30 bg-sage-500/10" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Our Collections"
          title={
            <>
              What We <span className="gradient-gold italic">Do</span>
            </>
          }
          className="mb-16 lg:mb-20"
        />

        <FurnituresBlock />

        <div className="my-20 lg:my-28 h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-cream-300 to-transparent" />

        <div className="max-w-5xl mx-auto space-y-20 lg:space-y-28">
          <FeatureBlock line={doors} />
          <FeatureBlock line={flooring} reverse />
        </div>
      </div>
    </section>
  );
}
