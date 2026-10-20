import Button from '../ui/Button';
import Container from '../ui/Container';
import ImageCollage from '../ui/ImageCollage';
import Reveal from '../ui/Reveal';
import { Label } from '../ui/SectionIntro';
import SpecList from '../ui/SpecList';
import { featureImages, mailto, productLines } from '../../data/site';

type ProductFeatureProps = {
  id: 'doors' | 'flooring';
  /** Put the photos on the right instead of the left. */
  reverse?: boolean;
  tone?: 'light' | 'muted';
};

/** Split layout for a product line: photo collage on one side, description + specs + enquiry on the other. */
export default function ProductFeature({ id, reverse = false, tone = 'light' }: ProductFeatureProps) {
  const line = productLines.find((item) => item.id === id)!;
  const images = featureImages[id];
  const muted = tone === 'muted';

  return (
    <section id={line.id} className={`relative py-24 lg:py-32 overflow-hidden ${muted ? 'bg-cream-100' : 'bg-cream-50'}`}>
      <Container>
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          <Reveal variant={reverse ? 'right' : 'left'} className={`lg:col-span-6 ${reverse ? 'lg:order-2' : ''}`}>
            <ImageCollage main={images.main} detail={images.detail} detailSide={reverse ? 'left' : 'right'} frame={muted ? 'cream-100' : 'cream-50'} />
          </Reveal>

          <div className={`lg:col-span-6 ${reverse ? 'lg:order-1' : ''}`}>
            <Reveal>
              <Label>{line.label}</Label>
              <h2 className="mt-5 font-serif font-medium text-[2.6rem] leading-[1.02] sm:text-5xl lg:text-[4.25rem] tracking-[-0.01em] text-bark-800">
                {line.title}
              </h2>
              <p className="mt-6 max-w-xl text-base sm:text-[17px] font-light leading-relaxed text-bark-600/80">{line.description}</p>
            </Reveal>
            <Reveal delay={100}>
              <SpecList specs={line.specs} className="mt-9" />
            </Reveal>
            <Reveal delay={180} className="mt-10">
              <Button variant="dark" href={mailto(line.enquiry.subject)}>
                {line.enquiry.label}
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
