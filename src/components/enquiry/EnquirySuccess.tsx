import { useState } from 'react';
import { ArrowLeft, Check, Copy, Mail, MessageCircle } from 'lucide-react';
import { enquiryMailto, enquiryText, enquiryWhatsApp, fullPhone, type DeliveryMode, type EnquiryForm } from '../../lib/enquiry';
import { brand } from '../../data/site';

type EnquirySuccessProps = {
  mode: DeliveryMode;
  form: EnquiryForm;
  onClose: () => void;
};

const actionClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-cream-300 bg-white px-5 py-2.5 text-[13px] font-semibold text-bark-700 transition-colors hover:border-gold-400 hover:text-bark-800';

export default function EnquirySuccess({ mode, form, onClose }: EnquirySuccessProps) {
  const [copied, setCopied] = useState(false);
  const firstName = form.name.trim().split(/\s+/)[0];

  const copyDetails = async () => {
    try {
      await navigator.clipboard.writeText(enquiryText(form));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable — the details are still shown below */
    }
  };

  const message = {
    sent: `Your enquiry has been sent. Our team will get back to you at ${form.email.trim()} soon.`,
    'email-app': 'Your email app should now be open with your enquiry ready to go — just press Send to deliver it to our team.',
    whatsapp: 'WhatsApp should now be open with your enquiry ready — just press send in the chat.',
  }[mode];

  const summary: [string, string][] = [
    ['Name', form.name.trim()],
    ['Email', form.email.trim()],
    ['Phone', fullPhone(form)],
    ...(form.company.trim() ? ([['Company', form.company.trim()]] as [string, string][]) : []),
    ...(form.country.trim() ? ([['Country', form.country.trim()]] as [string, string][]) : []),
    ...(form.interests.length ? ([['Interested in', form.interests.join(', ')]] as [string, string][]) : []),
  ];

  return (
    <div role="status" aria-live="polite">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/15 text-gold-600 animate-fade-in">
        <Check size={30} strokeWidth={2.2} />
      </span>
      <h3 className="mt-6 font-serif font-normal text-[2rem] leading-tight text-bark-800 sm:text-[2.5rem]">Thank you, {firstName}.</h3>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-bark-600/85 sm:text-base">{message}</p>

      {mode === 'email-app' && (
        <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-bark-600/70">
          Nothing opened? Email us at{' '}
          <a href={`mailto:${brand.email}`} className="font-medium text-gold-600 underline-offset-4 hover:underline">
            {brand.email}
          </a>{' '}
          or send it on WhatsApp.
        </p>
      )}

      <dl className="mt-8 divide-y divide-cream-200 rounded-2xl border border-cream-300 bg-white/70">
        {summary.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-4 px-5 py-3.5 sm:grid-cols-[9rem_1fr]">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600 pt-0.5">{label}</dt>
            <dd className="text-[14.5px] text-bark-700 [overflow-wrap:anywhere]">{value}</dd>
          </div>
        ))}
      </dl>

      {mode !== 'sent' && (
        <div className="mt-6 flex flex-wrap gap-3">
          {mode === 'email-app' && (
            <a href={enquiryMailto(form)} className={actionClass}>
              <Mail size={15} className="text-gold-600" /> Open email again
            </a>
          )}
          <a href={enquiryWhatsApp(form)} target="_blank" rel="noopener noreferrer" className={actionClass}>
            <MessageCircle size={15} className="text-sage-600" /> {mode === 'whatsapp' ? 'Open WhatsApp again' : 'Send on WhatsApp'}
          </a>
          <button type="button" onClick={copyDetails} className={actionClass}>
            {copied ? <Check size={15} className="text-sage-600" /> : <Copy size={15} className="text-gold-600" />}
            {copied ? 'Copied' : 'Copy details'}
          </button>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 border-t border-cream-300 pt-8 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-3 rounded-full bg-bark-800 px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream-50 transition-colors hover:bg-gold-500 hover:text-bark-900"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <a
          href="#explore/furniture-crafts"
          className="inline-flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-bark-700 transition-colors hover:text-gold-600"
        >
          Explore the collections
        </a>
      </div>
    </div>
  );
}
