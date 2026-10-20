import { useEffect, useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { brand, heroHighlights, heroImage, intro, taglineText } from '../data/site';
import { scrollToSection } from '../utils/scroll';

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const headingRef = useReveal();
  const copyRef = useReveal({ rootMargin: '0px 0px -40px 0px' });
  const actionsRef = useReveal({ rootMargin: '0px 0px -40px 0px' });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section id="home" className="relative min-h-screen min-h-[100svh] flex flex-col justify-center overflow-hidden bg-bark-900 pt-28 pb-28">
      {/* Full-bleed background that drifts gently with the cursor */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Teak outdoor sofa on a garden deck"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: `translate(${mouse.x * 0.3}px, ${mouse.y * 0.3}px) scale(1.05)`,
            transition: 'transform 0.6s ease-out',
          }}
        />
        {/* Bright photo: tint top (navbar) and bottom (scroll cue), and soften the centre behind the copy */}
        <div className="absolute inset-0 bg-gradient-to-b from-bark-900/65 via-bark-900/25 to-bark-900/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(19,16,9,0.32)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div ref={headingRef} className="reveal reveal-up text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-bark-900/30 backdrop-blur-sm mb-8">
            <Sparkles size={14} className="text-gold-400" />
            <span className="text-cream-100 text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase">{taglineText}</span>
          </div>
          <h1 className="font-serif text-[2.75rem] leading-[1.08] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal text-cream-50 text-balance">
            <span className="sr-only">{brand.name} — </span>
            From Indonesia
            <br />
            <span className="gradient-gold font-medium italic">to the World</span>
          </h1>
        </div>

        <div ref={copyRef} className="reveal reveal-up text-center mt-8 max-w-2xl mx-auto">
          <p className="text-cream-200/85 text-base sm:text-lg md:text-xl font-light leading-relaxed">{intro.lead}</p>
        </div>

        <div ref={actionsRef} className="reveal reveal-up mt-10 sm:mt-12 flex flex-col items-center gap-8">
          <button
            onClick={() => scrollToSection('collections')}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-cream-50/95 text-bark-800 font-medium tracking-wide hover:bg-gold-400 hover:text-cream-50 transition-all duration-400 shadow-lg"
          >
            <span>Our Collections</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-cream-200/75 text-xs sm:text-sm">
            {heroHighlights.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-gold-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <div className="flex flex-col items-center gap-2">
          <span className="text-cream-200/50 text-xs tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold-400 to-transparent animate-shimmer" />
        </div>
      </div>
    </section>
  );
}
