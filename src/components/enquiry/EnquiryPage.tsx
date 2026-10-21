import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Mail, MessageCircle, X } from 'lucide-react';
import EnquiryForm from './EnquiryForm';
import EnquirySuccess from './EnquirySuccess';
import BrandLogo from '../layout/BrandLogo';
import { Label } from '../ui/SectionIntro';
import { useHashRoute } from '../../hooks/useHashRoute';
import { brand, contactCta, hero, whatsappUrl } from '../../data/site';
import type { DeliveryMode, EnquiryForm as EnquiryFormData, Interest } from '../../lib/enquiry';

/** Which interests to pre-select, from the link that opened the page (#request-catalog/<key>). */
const presets: Record<string, Interest[]> = {
  'furniture-crafts': ['Furniture & Crafts'],
  furnitures: ['Furniture & Crafts'],
  doors: ['Doors'],
  flooring: ['Flooring'],
  'doors-flooring': ['Doors', 'Flooring'],
};

const benefits = ['Full product catalog', 'Factory price list', 'Samples on request', 'OEM & ODM custom orders'];

type EnquiryDialogProps = { preset: Interest[]; leaving: boolean; onClose: () => void };

function EnquiryDialog({ preset, leaving, onClose }: EnquiryDialogProps) {
  const [delivered, setDelivered] = useState<{ mode: DeliveryMode; form: EnquiryFormData } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock page scroll while open, move focus in, and give it back on close.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // The form may already have focused its first field (desktop); otherwise focus the dialog itself.
    if (!overlayRef.current?.contains(document.activeElement)) overlayRef.current?.focus({ preventScroll: true });
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

  // Bring the thank-you message into view.
  useEffect(() => {
    if (!delivered) return;
    overlayRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [delivered]);

  const iconButton =
    'flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400';

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-title"
      className={`fixed inset-0 z-[66] overflow-y-auto overscroll-contain bg-cream-50 outline-none lg:overflow-hidden ${
        leaving ? 'animate-sheet-out' : 'animate-sheet-in'
      }`}
    >
      <div className="lg:grid lg:h-full lg:grid-cols-12">
        {/* Brand panel */}
        <aside className="relative overflow-hidden bg-bark-900 text-cream-50 lg:col-span-5">
          <img src={hero.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-bark-900/80 via-bark-900/60 to-bark-900/95" />

          <div className="relative flex h-full flex-col gap-10 px-6 pb-10 pt-6 sm:px-10 lg:justify-between lg:px-12 lg:py-10 xl:px-14">
            <div className="flex items-center justify-between">
              <BrandLogo tone="light" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close enquiry form"
                className={`${iconButton} border-cream-100/30 bg-bark-900/30 text-cream-50 backdrop-blur-sm hover:border-gold-400 hover:bg-gold-400 hover:text-bark-900 lg:hidden`}
              >
                <X size={19} />
              </button>
            </div>

            <div>
              <Label tone="dark">Request Catalog</Label>
              <h2
                id="enquiry-title"
                className="mt-4 font-serif font-normal text-[2.1rem] leading-[1.1] tracking-[-0.015em] text-balance sm:text-[2.6rem] lg:text-[2.85rem]"
              >
                Let&rsquo;s Build Your <span className="gradient-gold italic">Next Collection</span> Together.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream-200/80 sm:text-base">{contactCta.text}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-[14.5px] text-cream-100/90">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-400/40 text-gold-400">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden space-y-3 border-t border-cream-100/15 pt-6 text-[14px] text-cream-200/75 lg:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cream-200/50">Prefer to reach us directly?</p>
              <a href={`mailto:${brand.email}`} className="flex items-center gap-2.5 transition-colors hover:text-gold-400">
                <Mail size={16} className="text-gold-400" /> {brand.email}
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition-colors hover:text-gold-400">
                <MessageCircle size={16} className="text-gold-400" /> {brand.phone} (WhatsApp)
              </a>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <div ref={panelRef} className="relative overscroll-contain lg:col-span-7 lg:h-full lg:overflow-y-auto">
          <div className="sticky top-0 z-10 hidden items-center justify-between border-b border-cream-200/80 px-10 py-4 glass lg:flex xl:px-14">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-bark-700 transition-colors hover:text-gold-600"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close enquiry form"
              className={`${iconButton} border-cream-300 bg-white text-bark-700 hover:border-gold-400 hover:bg-gold-400 hover:text-bark-900`}
            >
              <X size={18} />
            </button>
          </div>

          <div className="mx-auto max-w-2xl px-6 py-10 sm:px-10 lg:py-14">
            {delivered ? (
              <EnquirySuccess mode={delivered.mode} form={delivered.form} onClose={onClose} />
            ) : (
              <>
                <div className="mb-10">
                  <h3 className="font-serif font-normal text-[1.8rem] leading-tight text-bark-800 sm:text-[2.1rem]">Tell us what you need</h3>
                  <p className="mt-2 text-[15px] text-bark-600/80">
                    Share a few details and our team will send you the catalog and factory prices. Fields marked{' '}
                    <span className="text-gold-600">*</span> are required.
                  </p>
                </div>
                <EnquiryForm preset={preset} onDelivered={(mode, form) => setDelivered({ mode, form })} />
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-10 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-bark-600/80 transition-colors hover:text-gold-600 lg:hidden"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * "Request Catalog" page, opened by any link to #request-catalog (optionally #request-catalog/doors etc.
 * to pre-select an interest). Linkable, closes with Back / Esc, and animates in and out.
 */
export default function EnquiryPage() {
  const { segments, close } = useHashRoute('#request-catalog');
  const isOpen = segments !== null;
  const presetKey = segments?.[0] ?? '';

  const [session, setSession] = useState(isOpen ? 1 : 0);
  const [preset, setPreset] = useState<Interest[]>(presets[presetKey] ?? []);
  const [mounted, setMounted] = useState(isOpen);
  const [leaving, setLeaving] = useState(false);
  const wasOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen) {
      if (!wasOpen.current) {
        // A fresh opening: new form instance with this link's preset.
        setPreset(presets[presetKey] ?? []);
        setSession((n) => n + 1);
      }
      wasOpen.current = true;
      setMounted(true);
      setLeaving(false);
      return;
    }
    wasOpen.current = false;
    if (!mounted) return;
    setLeaving(true);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setLeaving(false);
    }, 250);
    return () => window.clearTimeout(timer);
    // `mounted` is read only to decide whether an exit animation is needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, presetKey]);

  if (!mounted) return null;
  return <EnquiryDialog key={session} preset={preset} leaving={leaving} onClose={close} />;
}
