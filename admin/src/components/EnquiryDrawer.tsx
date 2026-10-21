import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, Copy, Mail, MessageCircle, Phone, X } from 'lucide-react';
import { Button, Segmented, Spinner, statusLabel } from './ui';
import { countryName, fullDateTime, phoneDigits, relativeTime } from '../lib/format';
import type { Enquiry, EnquiryPatch, EnquiryStatus } from '../lib/types';

type EnquiryDrawerProps = {
  enquiry: Enquiry;
  onClose: () => void;
  onUpdate: (patch: EnquiryPatch) => Promise<void>;
};

const statuses: EnquiryStatus[] = ['new', 'contacted', 'closed'];

function replyLink(enquiry: Enquiry) {
  const firstName = enquiry.name.split(/\s+/)[0];
  const about = enquiry.interests.length ? ` about ${enquiry.interests.join(', ').replace(/, ([^,]*)$/, ' and $1')}` : '';
  const body = `Dear ${firstName},\n\nThank you for your enquiry${about}.\n\n\n\nKind regards,\nGolden Village Furnitures`;
  return `mailto:${enquiry.email}?subject=${encodeURIComponent('Re: Your catalog request — Golden Village Furnitures')}&body=${encodeURIComponent(body)}`;
}

function detailsText(enquiry: Enquiry) {
  return [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone}`,
    enquiry.company && `Company: ${enquiry.company}`,
    enquiry.country && `Country: ${enquiry.country}`,
    enquiry.interests.length && `Interested in: ${enquiry.interests.join(', ')}`,
    `Received: ${fullDateTime(enquiry.created_at)}`,
    '',
    enquiry.message,
  ]
    .filter((line): line is string => typeof line === 'string')
    .join('\n');
}

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid grid-cols-[8.5rem_1fr] gap-3 py-2.5 text-[14px]">
    <dt className="text-bark-600/65">{label}</dt>
    <dd className="min-w-0 text-bark-800 [overflow-wrap:anywhere]">{children}</dd>
  </div>
);

const linkButton =
  'inline-flex items-center gap-1.5 rounded-full border border-cream-300 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-bark-700 transition-colors hover:border-gold-400 hover:text-bark-900';

/** Full details of one enquiry, with status, internal notes and quick reply actions. */
export default function EnquiryDrawer({ enquiry, onClose, onUpdate }: EnquiryDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState(enquiry.notes ?? '');
  const [saving, setSaving] = useState<'status' | 'notes' | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Switching to another enquiry starts fresh.
  useEffect(() => {
    setNotes(enquiry.notes ?? '');
    setError(null);
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enquiry.id]);

  // Lock page scroll, move focus in, close on Esc — set up once per opening, so focus isn't reset on re-renders.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  const save = async (kind: 'status' | 'notes', patch: EnquiryPatch) => {
    setSaving(kind);
    setError(null);
    try {
      await onUpdate(patch);
      if (kind === 'notes') setSaved(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save. Please try again.');
    } finally {
      setSaving(null);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(detailsText(enquiry));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const digits = phoneDigits(enquiry.phone);
  const notesChanged = notes !== (enquiry.notes ?? '');

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-bark-900/40 backdrop-blur-[2px] animate-fade-in motion-reduce:animate-none" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-name"
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-cream-50 shadow-[-20px_0_60px_-20px_rgba(19,16,9,0.35)] outline-none animate-drawer-in motion-reduce:animate-none"
      >
        <header className="flex items-center justify-between gap-4 border-b border-cream-200 bg-white px-5 py-4 sm:px-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-600">
            Enquiry · <span className="normal-case tracking-normal text-bark-600/70">{relativeTime(enquiry.created_at)}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-300 text-bark-700 hover:border-gold-400 hover:bg-gold-400 hover:text-bark-900"
          >
            <X size={17} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
          <h2 id="enquiry-name" className="font-serif text-[1.85rem] font-normal leading-tight text-bark-800">
            {enquiry.name}
          </h2>
          <p className="mt-1 text-[14px] text-bark-600/75">{[enquiry.company, enquiry.country].filter(Boolean).join(' · ') || 'No company given'}</p>
          {enquiry.is_test && <p className="mt-2 inline-block rounded-full bg-cream-200 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-bark-600">Sent from the test site</p>}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Segmented
              label="Status"
              value={enquiry.status}
              onChange={(status) => status !== enquiry.status && save('status', { status })}
              options={statuses.map((status) => ({ value: status, label: statusLabel(status) }))}
            />
            {saving === 'status' && <Spinner />}
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-800">
              {error}
            </p>
          )}

          <div className="mt-6 space-y-3 rounded-2xl border border-cream-200 bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <a href={`mailto:${enquiry.email}`} className="flex min-w-0 items-center gap-2.5 text-[14.5px] font-medium text-bark-800 hover:text-gold-600">
                <Mail size={16} className="shrink-0 text-gold-600" />
                <span className="truncate">{enquiry.email}</span>
              </a>
              <a href={replyLink(enquiry)} className={linkButton}>
                <Mail size={14} /> Reply by email
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-3">
              <span className="flex items-center gap-2.5 text-[14.5px] font-medium text-bark-800">
                <Phone size={16} className="shrink-0 text-gold-600" />
                {enquiry.phone}
              </span>
              <span className="flex gap-2">
                <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" className={linkButton}>
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <a href={`tel:+${digits}`} className={linkButton}>
                  <Phone size={14} /> Call
                </a>
              </span>
            </div>
          </div>

          <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600">Message</h3>
          <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-cream-100 px-5 py-4 text-[14.5px] leading-relaxed text-bark-800">{enquiry.message}</p>

          <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600">Details</h3>
          <dl className="mt-2 divide-y divide-cream-200">
            <Row label="Received">{fullDateTime(enquiry.created_at)}</Row>
            <Row label="Interested in">
              {enquiry.interests.length ? (
                <span className="flex flex-wrap gap-1.5">
                  {enquiry.interests.map((interest) => (
                    <span key={interest} className="rounded-full border border-cream-300 bg-white px-2.5 py-0.5 text-[12.5px]">
                      {interest}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-bark-600/60">Not specified</span>
              )}
            </Row>
            <Row label="Country">{enquiry.country ?? <span className="text-bark-600/60">Not given</span>}</Row>
            <Row label="Sent from">{enquiry.ip_country ? countryName(enquiry.ip_country) : <span className="text-bark-600/60">Unknown</span>}</Row>
            <Row label="Email alert">{enquiry.email_sent ? 'Sent to the team' : <span className="text-bark-600/60">Not sent (email not set up)</span>}</Row>
          </dl>

          <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600">Internal notes</h3>
          <textarea
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
              setSaved(false);
            }}
            rows={4}
            placeholder="Only visible to admins — e.g. “Sent catalog on 21 Oct, follow up next week”."
            className="mt-3 block w-full resize-y rounded-xl border border-cream-300 bg-white px-4 py-3 text-[14px] leading-relaxed text-bark-800 outline-none placeholder:text-bark-600/40 focus:border-gold-500 focus:ring-4 focus:ring-gold-400/20"
          />
          <div className="mt-3 flex items-center gap-3">
            <Button variant="primary" disabled={!notesChanged || saving === 'notes'} onClick={() => save('notes', { notes: notes.trim() || null })}>
              {saving === 'notes' ? 'Saving…' : 'Save notes'}
            </Button>
            {saved && !notesChanged && (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-sage-600">
                <Check size={15} /> Saved
              </span>
            )}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-cream-200 bg-white px-5 py-3.5 sm:px-7">
          <Button icon={copied ? <Check size={15} className="text-sage-600" /> : <Copy size={15} />} onClick={copy}>
            {copied ? 'Copied' : 'Copy details'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </footer>
      </div>
    </div>
  );
}
