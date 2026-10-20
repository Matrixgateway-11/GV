import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import { Label } from '../ui/SectionIntro';
import { reasons, whyImage } from '../../data/site';

export default function WhyPartner() {
  return (
    <section id="why" className="relative bg-bark-900 py-24 lg:py-32 overflow-hidden">
      <div className="absolute -top-40 -left-20 w-[480px] h-[480px] rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full bg-sage-500/10 blur-3xl" />

      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <Label tone="dark">Why Golden Village</Label>
                <h2 className="mt-5 font-serif font-medium text-cream-50 text-[2.6rem] leading-[1.02] sm:text-5xl lg:text-[4.25rem] tracking-[-0.01em]">
                  Why Partner <span className="gradient-gold italic">With Us?</span>
                </h2>
              </Reveal>
              <Reveal delay={120} className="mt-10">
                <div className="zoom-wrap relative overflow-hidden rounded-2xl aspect-[16/11] lg:aspect-[4/5]">
                  <img src={whyImage.src} alt={whyImage.alt} loading="lazy" decoding="async" className="zoom-img absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bark-900/50 to-transparent" />
                </div>
              </Reveal>
            </div>
          </div>

          <ul className="lg:col-span-7 border-t border-cream-100/10 self-center">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <Reveal
                  as="li"
                  key={reason.title}
                  delay={index * 70}
                  className="group grid grid-cols-[2.75rem_1fr] sm:grid-cols-[3.5rem_1fr] gap-5 sm:gap-7 py-8 sm:py-10 border-b border-cream-100/10"
                >
                  <span className="mt-1 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gold-400/35 text-gold-400 transition-colors duration-300 group-hover:bg-gold-400 group-hover:text-bark-900">
                    <Icon size={19} strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="font-serif font-medium text-[1.7rem] sm:text-[2.1rem] leading-tight text-cream-50">{reason.title}</h3>
                    <p className="mt-2 text-base sm:text-[17px] font-light leading-relaxed text-cream-200/65">{reason.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
