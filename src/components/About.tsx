import { Leaf } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useReveal } from '../hooks/useReveal';
import { aboutImage, audiences, brand, commitment, intro } from '../data/site';

export default function About() {
  const textRef = useReveal();
  const imageRef = useReveal({ rootMargin: '0px 0px -60px 0px' });

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-cream-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <SectionHeading
              eyebrow="Who We Are"
              align="left"
              title={
                <>
                  Authentic Indonesian <span className="gradient-gold italic">craftsmanship</span>
                </>
              }
              subtitle={intro.partners}
            />

            <div ref={textRef} className="reveal reveal-up mt-8">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-bark-600/60 mb-3">We partner with</p>
              <ul className="flex flex-wrap gap-2">
                {audiences.map((audience) => (
                  <li key={audience} className="px-3.5 py-1.5 rounded-full bg-cream-50 border border-cream-300 text-bark-700 text-xs sm:text-[13px]">
                    {audience}
                  </li>
                ))}
              </ul>

              <div className="mt-10 pl-6 border-l-2 border-gold-400">
                <h3 className="font-serif text-2xl sm:text-3xl text-bark-800 mb-3">Our Commitment</h3>
                <p className="text-base sm:text-lg text-bark-600/80 font-light leading-relaxed">{commitment}</p>
              </div>
            </div>
          </div>

          <div ref={imageRef} className="reveal reveal-right relative max-w-md mx-auto lg:max-w-none w-full">
            <div className="zoom-wrap rounded-3xl overflow-hidden shadow-[0_8px_60px_rgba(0,0,0,0.12)] aspect-[4/5]">
              <img
                src={aboutImage}
                alt={`Handcrafted solid wood stools and tables by ${brand.name}`}
                loading="lazy"
                className="zoom-img w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-gold-400/15 -z-0" />
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-sage-400/30" />

            <div className="absolute left-4 right-4 sm:right-auto sm:-left-6 bottom-6 sm:bottom-10 flex items-center gap-3 rounded-2xl bg-cream-50/95 backdrop-blur px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
              <span className="w-10 h-10 shrink-0 rounded-full bg-sage-500/15 flex items-center justify-center">
                <Leaf size={18} className="text-sage-600" />
              </span>
              <span>
                <span className="block font-serif text-lg text-bark-800 leading-tight">SVLK Certified</span>
                <span className="block text-xs text-bark-600/70">Legally sourced wood</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
