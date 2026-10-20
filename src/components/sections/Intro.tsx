import { Check } from 'lucide-react';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import { Label } from '../ui/SectionIntro';
import { brand, intro } from '../../data/site';

/** Short "What We Do" statement between the hero and the product sections. */
export default function Intro() {
  return (
    <section id="collections" className="relative bg-cream-50 py-20 lg:py-24 overflow-hidden">
      <div className="absolute -top-32 right-0 w-[460px] h-[460px] rounded-full bg-gold-400/10 blur-3xl" />

      <Container size="narrow" className="relative text-center">
        <Reveal>
          <Label className="justify-center">What We Do</Label>
          <p className="mt-6 mx-auto max-w-3xl font-serif font-light text-[1.45rem] leading-[1.5] sm:text-[1.75rem] lg:text-[2rem] lg:leading-[1.45] text-bark-800 text-pretty">
            <span className="gradient-gold italic font-normal">{brand.name}</span> {intro.lead}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {intro.highlights.map((item) => (
              <li key={item} className="inline-flex items-center gap-2 text-sm text-bark-700 font-medium">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-400/20">
                  <Check size={12} className="text-gold-600" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
