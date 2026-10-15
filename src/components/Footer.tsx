import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import BrandLogo from './BrandLogo';
import PinterestIcon from './PinterestIcon';
import { brand } from '../data/site';
import { scrollToSection } from '../utils/scroll';

const collectionLinks = [
  { label: 'Furnitures', href: '#furnitures' },
  { label: 'Doors', href: '#doors' },
  { label: 'Flooring', href: '#flooring' },
];

const companyLinks = ['About Us', 'Craftsmanship', 'Sustainability', 'Showroom'];

const socials = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: PinterestIcon, label: 'Pinterest' },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-bark-900 text-cream-100 pt-20 pb-8 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-sage-500/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 pb-16 border-b border-cream-100/10">
          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-balance">
            Ready to reimagine <span className="gradient-gold italic font-medium">your home?</span>
          </h2>
          <p className="mt-4 text-cream-200/60 text-lg font-light max-w-xl mx-auto">
            Drop by our showroom or book a one-on-one session with us.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${brand.email}?subject=Design%20consultation`}
              className="px-8 py-4 rounded-full bg-gold-400 text-bark-900 font-medium tracking-wide hover:bg-gold-500 transition-all duration-300"
            >
              Book a Consultation
            </a>
            <button
              onClick={() => scrollToSection('home')}
              className="px-8 py-4 rounded-full border border-cream-100/20 text-cream-50 font-medium tracking-wide hover:border-gold-400 hover:text-gold-400 transition-all duration-300"
            >
              Back to Top
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="mb-4">
              <BrandLogo />
            </div>
            <p className="text-cream-200/50 text-sm font-light leading-relaxed">
              Handcrafted furniture, doors and flooring — made in Indonesia for homes around the world.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-[0.15em] uppercase text-gold-400 mb-4">Collections</h4>
            <ul className="space-y-3">
              {collectionLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-cream-200/60 text-sm hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-[0.15em] uppercase text-gold-400 mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((label) => (
                <li key={label}>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="text-cream-200/60 text-sm hover:text-gold-400 transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-[0.15em] uppercase text-gold-400 mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-cream-200/60">
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-gold-400" />
                <a href={`mailto:${brand.email}`} className="hover:text-gold-400 transition-colors">
                  {brand.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-gold-400" />
                <a href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`} className="hover:text-gold-400 transition-colors">
                  {brand.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-gold-400" />
                <span>{brand.address}</span>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-5">
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
        </div>

        <div className="pt-8 border-t border-cream-100/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream-200/40 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} {brand.full}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-cream-200/40">
            <a href="#" className="hover:text-gold-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gold-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
