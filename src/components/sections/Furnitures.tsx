import Gallery from '../gallery/Gallery';
import Button from '../ui/Button';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import SectionIntro from '../ui/SectionIntro';
import SpecList from '../ui/SpecList';
import { furnitureGallery } from '../../data/gallery';
import { mailto, productLines } from '../../data/site';

const line = productLines[0];

export default function Furnitures() {
  return (
    <section id={line.id} className="relative bg-cream-100 py-24 lg:py-32 overflow-hidden">
      <Container size="narrow">
        <SectionIntro
          label={line.label}
          title={line.title}
          aside={
            <>
              <p>{line.description}</p>
              <SpecList specs={line.specs} className="mt-7" />
            </>
          }
        />

        <Gallery images={furnitureGallery} label={line.title} className="mt-14 lg:mt-20" />

        <Reveal className="mt-12 lg:mt-14 pt-8 border-t border-bark-800/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <p className="text-bark-600/80 text-[15px] sm:text-base font-light">Full catalog, factory price list and samples available on request.</p>
          <Button variant="dark" href={mailto(line.enquiry.subject)}>
            {line.enquiry.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
