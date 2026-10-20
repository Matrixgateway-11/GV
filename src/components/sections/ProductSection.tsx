import Gallery from '../gallery/Gallery';
import Chips from '../ui/Chips';
import Container from '../ui/Container';
import SectionIntro from '../ui/SectionIntro';
import { productGalleries } from '../../data/gallery';
import { productLines, type ProductLine } from '../../data/site';

type ProductSectionProps = {
  id: ProductLine['id'];
  /** Light cream (default) or the slightly deeper cream, to alternate sections. */
  tone?: 'light' | 'muted';
};

/** One product line: label + title, description + material tags, then its photo gallery. */
export default function ProductSection({ id, tone = 'light' }: ProductSectionProps) {
  const line = productLines.find((item) => item.id === id)!;

  return (
    <section id={line.id} className={`relative py-20 lg:py-24 ${tone === 'muted' ? 'bg-cream-100' : 'bg-cream-50'}`}>
      <Container size="narrow">
        <SectionIntro
          label={line.label}
          title={line.title}
          aside={
            <>
              <p>{line.description}</p>
              <Chips items={line.materials} className="mt-5" />
            </>
          }
        />
        <Gallery images={productGalleries[id]} label={line.title} className="mt-10 lg:mt-12" />
      </Container>
    </section>
  );
}
