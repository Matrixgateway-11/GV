import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { heroImage } from '../data/site';
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
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-bark-900">
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
            <span className="text-cream-100 text-xs font-medium tracking-[0.2em] uppercase">
              Handcrafted Furniture House
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-cream-50 leading-[1.05] text-balance">
            Every Room
            <br />
            <span className="gradient-gold font-medium italic">Deserves a Story</span>
          </h1>
        </div>

        <div ref={copyRef} className="reveal reveal-up text-center mt-8 max-w-2xl mx-auto">
          <p className="text-cream-200/80 text-lg md:text-xl font-light leading-relaxed">
            Thoughtfully made pieces for the rooms you live in and the gardens you escape to — From
            Indonesia to the World.
          </p>
        </div>

        <div ref={actionsRef} className="reveal reveal-up mt-12 flex justify-center">
          <button
            onClick={() => scrollToSection('indoor')}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-cream-50/95 text-bark-800 font-medium tracking-wide hover:bg-gold-400 hover:text-cream-50 transition-all duration-400 shadow-lg"
          >
            <span>Our Collections</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-cream-200/50 text-xs tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold-400 to-transparent animate-shimmer" />
        </div>
      </div>
    </section>
  );
}
