import type { ReactNode } from 'react';
import { Globe, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Button from '../ui/Button';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import { Label } from '../ui/SectionIntro';
import { brand, contactCta, whatsappUrl } from '../../data/site';

function ContactRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 py-4 border-b border-cream-100/10 last:border-b-0">
      <span className="mt-0.5 text-gold-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-cream-200/50">{label}</p>
        <div className="mt-1 text-[15px] text-cream-50 [overflow-wrap:anywhere]">{children}</div>
      </div>
    </div>
  );
}

export default function ContactCta() {
  const linkClass = 'hover:text-gold-400 transition-colors';
  return (
    <section id="contact" className="relative overflow-hidden bg-bark-900">
      <img src={contactCta.image} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-r from-bark-900 via-bark-900/90 to-bark-900/55" />

      <Container className="relative py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <Reveal className="lg:col-span-7 min-w-0">
            <Label tone="dark">Get in Touch</Label>
            <h2 className="mt-4 font-serif font-normal text-cream-50 text-[2.25rem] leading-[1.08] sm:text-[2.75rem] lg:text-[3.4rem] tracking-[-0.015em] text-balance">
              Let&rsquo;s Build Your <span className="gradient-gold italic">Next Collection</span> Together.
            </h2>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-cream-200/75">{contactCta.text}</p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Button variant="gold" href="#request-catalog" icon={<Mail size={16} />}>
                Request Catalog
              </Button>
              <Button variant="outlineLight" href={whatsappUrl} external arrow={false} icon={<MessageCircle size={16} />}>
                Chat on WhatsApp
              </Button>
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-5 min-w-0">
            <div className="rounded-2xl border border-cream-100/15 bg-cream-50/[0.06] backdrop-blur-md px-6 py-3 sm:px-8 sm:py-4">
              <ContactRow icon={<Mail size={18} />} label="Business Email">
                {brand.emails.map((email) => (
                  <a key={email} href={`mailto:${email}`} className={`block ${linkClass}`}>
                    {email}
                  </a>
                ))}
              </ContactRow>
              <ContactRow icon={<Phone size={18} />} label="Phone / WhatsApp">
                <a href={`tel:+${brand.phoneDigits}`} className={linkClass}>
                  {brand.phone}
                </a>
              </ContactRow>
              <ContactRow icon={<Globe size={18} />} label="Website">
                <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {brand.website}
                </a>
              </ContactRow>
              <ContactRow icon={<MapPin size={18} />} label="Location">
                {brand.location}
              </ContactRow>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
