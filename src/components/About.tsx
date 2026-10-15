import { Fragment } from 'react';
import { useReveal } from '../hooks/useReveal';
import { aboutImage, brand, stats, values, type Value } from '../data/site';

function ValueCard({ value, delay }: { value: Value; delay: number }) {
  const ref = useReveal({ rootMargin: '0px 0px -50px 0px' });
  const Icon = value.icon;

  return (
    <div
      ref={ref}
      className="reveal reveal-up bg-cream-50 rounded-2xl p-6 border border-cream-200 hover:border-gold-400/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all duration-400"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center mb-4">
        <Icon size={22} className="text-gold-600" />
      </div>
      <h3 className="font-serif text-xl font-medium text-bark-800 mb-2">{value.title}</h3>
      <p className="text-sm text-bark-600/70 font-light leading-relaxed">{value.description}</p>
    </div>
  );
}

export default function About() {
  const textRef = useReveal();
  const imageRef = useReveal({ rootMargin: '0px 0px -60px 0px' });

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-cream-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <div ref={textRef} className="reveal reveal-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/15 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-600">Our Story</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-bark-800 leading-tight text-balance">
              Furniture made to be <span className="gradient-gold italic font-medium">treasured</span>
            </h2>
            <p className="mt-6 text-bark-600/70 text-lg font-light leading-relaxed">
              {brand.full} began with one idea: the things we live with every day should make life feel a
              little richer. Whether it&rsquo;s a cosy reading corner indoors or a breezy terrace outside, every
              one of our collections is made to bring lasting warmth and beauty to the places you call home.
            </p>
            <div className="mt-8 flex items-center gap-6">
              {stats.map((stat, i) => (
                <Fragment key={stat.label}>
                  {i > 0 && <div className="w-px h-12 bg-cream-300" />}
                  <div>
                    <div className="font-serif text-4xl font-medium text-bark-800">{stat.value}</div>
                    <div className="text-sm text-bark-600/60 tracking-wide">{stat.label}</div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <div ref={imageRef} className="reveal reveal-right relative">
            <div className="zoom-wrap rounded-3xl overflow-hidden shadow-[0_8px_60px_rgba(0,0,0,0.1)] aspect-[5/4]">
              <img src={aboutImage} alt={`${brand.full} showroom`} loading="lazy" className="zoom-img w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-gold-400/15 -z-0" />
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-sage-400/30" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <ValueCard key={value.title} value={value} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
