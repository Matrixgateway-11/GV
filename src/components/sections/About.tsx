import { Leaf } from 'lucide-react';
import Container from '../ui/Container';
import ImageCollage from '../ui/ImageCollage';
import Reveal from '../ui/Reveal';
import Chips from '../ui/Chips';
import { Label, SectionTitle } from '../ui/SectionIntro';
import { aboutImages, audiences, commitment, intro } from '../../data/site';

export default function About() {
  return (
    <section id="about" className="relative bg-cream-50 py-20 lg:py-28 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <Reveal variant="left" className="lg:col-span-7 max-w-xl mx-auto lg:max-w-none w-full">
            <ImageCollage
              main={aboutImages.main}
              detail={aboutImages.detail}
              badge={
                <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-cream-200 bg-white/80 px-2.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_10px_40px_rgba(19,16,9,0.1)]">
                  <span className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-sage-500/15">
                    <Leaf size={15} className="text-sage-600" />
                  </span>
                  <span>
                    <span className="block font-serif font-semibold text-[15px] sm:text-lg leading-tight text-bark-800 sm:whitespace-nowrap">SVLK Certified</span>
                    <span className="hidden sm:block text-xs text-bark-600/70 whitespace-nowrap">Legally sourced wood</span>
                  </span>
                </div>
              }
            />
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal>
              <Label>Who We Are</Label>
              <SectionTitle className="mt-4">
                Authentic Indonesian <span className="gradient-gold italic">craftsmanship</span>
              </SectionTitle>
              <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-bark-600/85">{intro.partners}</p>
            </Reveal>

            <Reveal delay={100} className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-bark-600/60">We partner with</p>
              <Chips items={audiences} className="mt-3" />
            </Reveal>

            <Reveal as="figure" delay={180} className="mt-10 border-l-2 border-gold-400 pl-6 sm:pl-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-600">Our Commitment</p>
              <blockquote className="mt-3 font-serif font-light italic text-[1.4rem] sm:text-[1.65rem] leading-snug text-bark-800">
                &ldquo;{commitment.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-[15px] sm:text-base leading-relaxed text-bark-600/85">{commitment.text}</figcaption>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
