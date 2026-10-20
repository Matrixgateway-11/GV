import { ArrowRight, ArrowUp, Facebook, Globe, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import BrandLogo from './BrandLogo';
import PinterestIcon from './PinterestIcon';
import { brand, contactCta, mailto, productLines, taglineText, whatsappUrl } from '../data/site';
import { scrollToSection } from '../utils/scroll';

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

const headingClass = 'text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase text-gold-400 mb-4';
const linkClass = 'text-cream-200/60 text-sm hover:text-gold-400 transition-colors';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-bark-900 text-cream-100 pt-20 lg:pt-24 pb-8 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-sage-500/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 pb-16 border-b border-cream-100/10">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight text-balance max-w-3xl mx-auto">
            Let&rsquo;s Build Your <span className="gradient-gold italic">Next Collection</span> Together.
          </h2>
          <p className="mt-5 text-cream-200/65 text-base sm:text-lg font-light max-w-xl mx-auto">{contactCta.text}</p>
          <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={mailto('Catalog, factory price list & samples request')}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gold-400 text-bark-900 font-medium tracking-wide hover:bg-gold-500 transition-all duration-300"
            >
              <Mail size={18} />
              <span>Request Catalog</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-cream-100/25 text-cream-50 font-medium tracking-wide hover:border-gold-400 hover:text-gold-400 transition-all duration-300"
            >
              <MessageCircle size={18} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 lg:gap-8 mb-12">
          <div className="col-span-2 lg:col-span-4">
            <BrandLogo tone="light" layout="stacked" className="mb-5" />
            <p className="text-cream-200/55 text-sm font-light leading-relaxed max-w-sm">
              Trusted B2B exporter of premium furniture, wood doors and wood flooring from {brand.location}.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 rounded-full border border-cream-100/20 flex items-center justify-center hover:border-gold-400 hover:bg-gold-400/10 transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={16} className="text-cream-200/70 hover:text-gold-400 transition-colors" />
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
            <h4 className={headingClass}>Get in Touch</h4>
            <ul className="space-y-3 text-sm text-cream-200/65">
              {brand.emails.map((email) => (
                <li key={email} className="flex items-start gap-2.5">
                  <Mail size={15} className="text-gold-400 mt-0.5 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-gold-400 transition-colors break-all">
                    {email}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="text-gold-400 mt-0.5 shrink-0" />
                <a href={`tel:+${brand.phoneDigits}`} className="hover:text-gold-400 transition-colors">
                  {brand.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe size={15} className="text-gold-400 mt-0.5 shrink-0" />
                <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors break-all">
                  {brand.website}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-gold-400 mt-0.5 shrink-0" />
                <span>{brand.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-cream-100/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-cream-200/40 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p className="text-gold-400/70 text-[10px] sm:text-xs tracking-[0.3em] uppercase">{taglineText}</p>
          <button
            onClick={() => scrollToSection('home')}
            className="inline-flex items-center gap-1.5 text-xs text-cream-200/50 hover:text-gold-400 transition-colors"
          >
            Back to top <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
