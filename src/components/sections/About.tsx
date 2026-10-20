import { Leaf } from 'lucide-react';
import Container from '../ui/Container';
import ImageCollage from '../ui/ImageCollage';
import Reveal from '../ui/Reveal';
import { Label } from '../ui/SectionIntro';
import { aboutImages, audiences, commitment, intro } from '../../data/site';

export default function About() {
  return (
    <section id="about" className="relative bg-cream-50 py-24 lg:py-32 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          <Reveal variant="left" className="lg:col-span-6 max-w-xl mx-auto lg:max-w-none w-full">
            <ImageCollage main={aboutImages.main} detail={aboutImages.detail} detailSide="right">
              <div className="absolute left-4 top-6 sm:left-6 sm:top-8 flex items-center gap-3 rounded-xl bg-cream-50/95 backdrop-blur px-4 py-3 shadow-[0_10px_40px_rgba(19,16,9,0.15)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-500/15">
                  <Leaf size={17} className="text-sage-600" />
                </span>
                <span>
                  <span className="block font-serif font-semibold text-lg leading-tight text-bark-800">SVLK Certified</span>
                  <span className="block text-xs text-bark-600/70">Legally sourced wood</span>
                </span>
              </div>
            </ImageCollage>
          </Reveal>

          <div className="lg:col-span-6">
            <Reveal>
              <Label>Who We Are</Label>
              <h2 className="mt-5 font-serif font-medium text-[2.6rem] leading-[1.02] sm:text-5xl lg:text-[4.25rem] tracking-[-0.01em] text-bark-800 text-balance">
                Authentic Indonesian <span className="gradient-gold italic">craftsmanship</span>
              </h2>
              <p className="mt-6 text-base sm:text-[17px] font-light leading-relaxed text-bark-600/80">{intro.partners}</p>
            </Reveal>

            <Reveal delay={100} className="mt-9">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-bark-600/60">We partner with</p>
              <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-serif text-xl sm:text-[1.4rem] text-bark-700">
                {audiences.map((audience, i) => (
                  <li key={audience} className="flex items-center gap-3">
                    {i > 0 && <span className="text-gold-500 text-sm">✦</span>}
                    {audience}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal as="figure" delay={180} className="mt-12 border-l-2 border-gold-400 pl-6 sm:pl-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold-600">Our Commitment</p>
              <blockquote className="mt-4 font-serif italic text-[1.65rem] sm:text-[2rem] leading-snug text-bark-800">
                &ldquo;{commitment.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-base sm:text-[17px] font-light leading-relaxed text-bark-600/80">{commitment.text}</figcaption>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
