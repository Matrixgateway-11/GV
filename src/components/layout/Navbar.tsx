import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { navLinks } from '../../data/site';
import { scrollToSection } from '../../utils/scroll';

const sectionIds = navLinks.map((link) => link.href.slice(1));

/** Tracks whether the page has scrolled past the hero edge and which section is in the middle of the screen. */
function useScrollState() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const middle = window.innerHeight / 2;
      for (const id of sectionIds) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= middle && rect.bottom >= middle) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrolled, active };
}

export default function Navbar() {
  const { scrolled, active } = useScrollState();
  const [menuOpen, setMenuOpen] = useState(false);
  const solid = scrolled || menuOpen;

  const go = (href: string) => {
    setMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid ? 'glass shadow-[0_1px_0_rgba(19,16,9,0.06),0_8px_30px_rgba(19,16,9,0.05)]' : 'bg-gradient-to-b from-bark-900/50 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-[4.5rem]' : 'h-24'}`}>
          <button onClick={() => go('#home')} className="flex items-center" aria-label="Golden Village Furnitures — back to top">
            <BrandLogo tone={solid ? 'dark' : 'light'} />
          </button>

          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-3" aria-label="Main">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              const color = solid
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
                  className={`relative px-2 xl:px-3 py-2 text-[12px] font-medium uppercase tracking-[0.14em] xl:tracking-[0.2em] transition-colors duration-300 ${color}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-px bg-gold-400 transition-all duration-300 ${isActive ? 'w-6' : 'w-0'}`}
                  />
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => go('#contact')}
            className={`hidden lg:inline-flex items-center px-5 xl:px-6 py-3 rounded-full text-[12px] font-medium uppercase tracking-[0.12em] xl:tracking-[0.18em] border transition-all duration-300 ${
              solid
                ? 'border-gold-500/70 text-bark-800 hover:bg-gold-400 hover:border-gold-400'
                : 'border-cream-100/40 text-cream-50 hover:border-gold-400 hover:text-gold-400'
            }`}
          >
            Request Catalog
          </button>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className={`lg:hidden p-1 transition-colors ${solid ? 'text-bark-800' : 'text-cream-50'}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-[28rem]' : 'max-h-0'}`}>
        <nav className="px-6 pb-6 pt-2 flex flex-col border-t border-cream-200" aria-label="Mobile">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => go(link.href)}
              className={`text-left py-3.5 text-sm font-medium uppercase tracking-[0.2em] border-b border-cream-200 transition-colors ${
                active === link.href.slice(1) ? 'text-gold-600' : 'text-bark-700 hover:text-gold-600'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => go('#contact')}
            className="mt-5 py-3.5 rounded-full bg-gold-400 text-bark-900 text-[13px] font-medium uppercase tracking-[0.18em] hover:bg-gold-500 transition-colors"
          >
            Request Catalog
          </button>
        </nav>
      </div>
    </header>
  );
}
