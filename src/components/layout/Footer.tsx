import { ArrowUp, Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import BrandLogo from './BrandLogo';
import Container from '../ui/Container';
import PinterestIcon from '../ui/PinterestIcon';
import { brand, productLines, taglineText } from '../../data/site';
import { scrollToSection } from '../../utils/scroll';

const companyLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Why Partner With Us', href: '#why' },
  { label: 'Our Commitment', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const socials = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: PinterestIcon, label: 'Pinterest' },
];

const headingClass = 'text-[11px] font-medium uppercase tracking-[0.3em] text-gold-400 mb-5';
const linkClass = 'text-cream-200/60 text-[15px] hover:text-gold-400 transition-colors text-left';

export default function Footer() {
  return (
    <footer className="relative bg-[#0e0c07] text-cream-100 pt-16 lg:pt-20 pb-8 overflow-hidden">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-12 lg:gap-10 pb-12 border-b border-cream-100/10">
          <div className="col-span-2 lg:col-span-4">
            <BrandLogo tone="light" layout="stacked" />
            <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-cream-200/55">
              Trusted B2B exporter of premium furniture, wood doors and wood flooring from {brand.location}.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-100/20 text-cream-200/70 hover:border-gold-400 hover:text-gold-400 transition-colors duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className={headingClass}>Collections</h4>
            <ul className="space-y-3">
              {productLines.map((line) => (
                <li key={line.id}>
                  <button onClick={() => scrollToSection(line.id)} className={linkClass}>
                    {line.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className={headingClass}>Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => scrollToSection(link.href)} className={linkClass}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-4">
            <h4 className={headingClass}>Contact</h4>
            <ul className="space-y-3 text-[15px] text-cream-200/65">
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="mt-1 shrink-0 text-gold-400" />
                <a href={`mailto:${brand.email}`} className="[overflow-wrap:anywhere] hover:text-gold-400 transition-colors">
                  {brand.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="mt-1 shrink-0 text-gold-400" />
                <a href={`tel:+${brand.phoneDigits}`} className="hover:text-gold-400 transition-colors">
                  {brand.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="text-xs tracking-wide text-cream-200/40">
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-gold-400/70">{taglineText}</p>
          <button
            onClick={() => scrollToSection('home')}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-cream-200/50 hover:text-gold-400 transition-colors"
          >
            Back to top <ArrowUp size={13} />
          </button>
        </div>
      </Container>
    </footer>
  );
}
