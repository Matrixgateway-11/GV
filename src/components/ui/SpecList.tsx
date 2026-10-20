import type { Spec } from '../../data/site';

/** Label / value rows separated by hairlines — a compact product spec sheet. */
export default function SpecList({ specs, className = '' }: { specs: Spec[]; className?: string }) {
  return (
    <dl className={`border-t border-bark-800/10 ${className}`}>
      {specs.map((spec) => (
        <div key={spec.label} className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[9rem_1fr] gap-4 py-4 border-b border-bark-800/10">
          <dt className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.22em] text-gold-600 pt-0.5">{spec.label}</dt>
          <dd className="text-[15px] sm:text-base text-bark-700">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
