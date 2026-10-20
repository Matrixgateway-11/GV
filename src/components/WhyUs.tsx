import SectionHeading from './SectionHeading';
import { useReveal } from '../hooks/useReveal';
import { reasons, type Reason } from '../data/site';

function ReasonCard({ reason, index }: { reason: Reason; index: number }) {
  const ref = useReveal<HTMLLIElement>({ rootMargin: '0px 0px -50px 0px' });
  const Icon = reason.icon;

  return (
    <li
      ref={ref}
      className="reveal reveal-up w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
    >
      <div className="h-full rounded-2xl p-7 sm:p-8 bg-cream-50/[0.04] border border-cream-100/10 hover:border-gold-400/40 hover:bg-cream-50/[0.07] transition-all duration-400">
        <div className="w-12 h-12 rounded-xl bg-gold-400/15 flex items-center justify-center mb-5">
          <Icon size={22} className="text-gold-400" />
        </div>
        <h3 className="font-serif text-xl sm:text-2xl text-cream-50 mb-2">{reason.title}</h3>
        <p className="text-sm sm:text-[15px] text-cream-200/65 font-light leading-relaxed">{reason.description}</p>
      </div>
    </li>
  );
}

export default function WhyUs() {
  return (
    <section id="why" className="relative py-24 lg:py-32 bg-bark-900 overflow-hidden">
      <div className="absolute -top-24 left-1/4 w-[420px] h-[420px] rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full bg-sage-500/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Why Golden Village"
          tone="dark"
          title={
            <>
              Why Partner <span className="gradient-gold italic">With Us?</span>
            </>
          }
          className="mb-14 lg:mb-16"
        />

        <ul className="flex flex-wrap justify-center gap-6">
          {reasons.map((reason, index) => (
            <ReasonCard key={reason.title} reason={reason} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
