import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import { brand, hero, marqueeItems } from '../../data/site';
import { scrollToSection } from '../../utils/scroll';

/** Slow-moving strip of key points along the bottom of the hero. */
function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="relative z-10 border-t border-cream-100/10 bg-bark-900/40 backdrop-blur-sm overflow-hidden" aria-hidden="true">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-8 px-8 py-4 text-[11px] sm:text-xs uppercase tracking-[0.35em] text-cream-100/75 whitespace-nowrap">
            {item}
            <span className="text-gold-400">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section id="home" className="relative min-h-screen min-h-[100svh] flex flex-col bg-bark-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={hero.image}
          alt="Teak outdoor sofa set on a sunny terrace with olive trees"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: `translate(${mouse.x * 0.3}px, ${mouse.y * 0.3}px) scale(1.05)`, transition: 'transform 0.6s ease-out' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bark-900/65 via-bark-900/35 to-bark-900/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(19,16,9,0.45)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 flex-1 flex items-center pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-bark-900/30 backdrop-blur-sm mb-8">
              <Sparkles size={14} className="text-gold-400" />
              <span className="text-cream-100 text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase">{hero.eyebrow}</span>
            </div>
            <h1 className="font-serif font-light text-cream-50 text-[2.9rem] leading-[1.06] sm:text-6xl lg:text-[5.25rem] tracking-[-0.02em] text-balance">
              <span className="sr-only">{brand.name} — </span>
              {hero.titleLine1}
              <br />
              <span className="gradient-gold font-normal italic">{hero.titleLine2}</span>
            </h1>
          </Reveal>
          <Reveal delay={120} className="mt-8 max-w-3xl mx-auto">
            {/* Shadow keeps the copy readable over the bright parts of the photo. */}
            <p className="text-cream-50 font-semibold text-base sm:text-lg leading-relaxed text-balance [text-shadow:0_1px_14px_rgba(19,16,9,0.7)]">
              {hero.text}
              <span className="mt-2 block font-bold text-gold-300 tracking-wide">{brand.slogan}</span>
            </p>
          </Reveal>
          <Reveal delay={220} className="mt-11 flex justify-center">
            <Button variant="light" onClick={() => scrollToSection('collections')}>
              Our Collections
            </Button>
          </Reveal>
        </div>
      </div>

      <Marquee />
    </section>
  );
}
