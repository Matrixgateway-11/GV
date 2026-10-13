import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CollectionSection from './components/CollectionSection';
import About from './components/About';
import Footer from './components/Footer';
import { indoorProducts, outdoorProducts } from './data/site';

export default function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <CollectionSection
          id="indoor"
          eyebrow="Indoor Collection"
          title="Comfort shaped for the rooms you love"
          subtitle="Sofas, dining tables and bedroom pieces finished in natural fabrics and warm woods, made to soften every corner of your home."
          items={indoorProducts}
          theme="indoor"
        />
        <CollectionSection
          id="outdoor"
          eyebrow="Outdoor Collection"
          title="Pieces made for open air and long evenings"
          subtitle="Sun-ready loungers, dining sets and daybeds that carry the comfort of indoors out to your patio, garden or terrace."
          items={outdoorProducts}
          theme="outdoor"
        />
        <About />
      </main>
      <Footer />
    </div>
  );
}
