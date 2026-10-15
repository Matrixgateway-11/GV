import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { navLinks } from '../data/site';
import { scrollToSection } from '../utils/scroll';

const sectionIds = navLinks.map((link) => link.href.slice(1));

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      const middle = window.innerHeight / 2;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= middle && rect.bottom >= middle) {
          setActive(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-[0_2px_30px_rgba(0,0,0,0.06)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'h-16' : 'h-24'
          }`}
        >
          <button onClick={() => go('#home')} className="flex items-center" aria-label="Go to top">
            <BrandLogo
              className={`transition-colors duration-300 ${scrolled ? 'text-bark-800' : 'text-cream-50'}`}
            />
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              const color = scrolled
                ? isActive
                  ? 'text-gold-600'
                  : 'text-bark-700 hover:text-gold-600'
                : isActive
                  ? 'text-gold-400'
                  : 'text-cream-100 hover:text-gold-400';

              return (
                <button
                  key={link.href}
                  onClick={() => go(link.href)}
                  className={`relative px-5 py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${color}`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gold-400 transition-all duration-300 ${
                      isActive ? 'w-8' : 'w-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => go('#collection')}
            className={`hidden lg:inline-flex items-center px-6 py-2.5 rounded-full text-sm font-medium tracking-wide border transition-all duration-300 ${
              scrolled
                ? 'border-gold-400 text-gold-600 hover:bg-gold-400 hover:text-cream-50'
                : 'border-cream-100/40 text-cream-50 hover:border-gold-400 hover:text-gold-400'
            }`}
          >
            Explore Collection
          </button>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className={`lg:hidden transition-colors ${scrolled ? 'text-bark-800' : 'text-cream-50'}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <nav className="glass px-6 py-4 flex flex-col gap-2 border-t border-cream-200">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => go(link.href)}
              className={`text-left py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                active === link.href.slice(1) ? 'text-gold-600 bg-cream-100' : 'text-bark-700 hover:bg-cream-100'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
