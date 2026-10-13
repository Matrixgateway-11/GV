import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CollectionSection from './components/CollectionSection';
import About from './components/About';
import Footer from './components/Footer';
import { indoorGallery, outdoorGallery } from './data/gallery';

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
          subtitle="Rattan, cane and solid-wood pieces — accent chairs, side tables, sideboards and shelving — finished by hand to bring warmth to every corner of your home."
          images={indoorGallery}
          tileRatio={3 / 4}
          theme="indoor"
        />
        <CollectionSection
          id="outdoor"
          eyebrow="Outdoor Collection"
          title="Pieces made for open air and long evenings"
          subtitle="Teak frames and hand-woven rope seating made for decks, gardens and terraces — built to weather the seasons in comfort."
          images={outdoorGallery}
          tileRatio={2 / 3}
          theme="outdoor"
        />
        <About />
      </main>
      <Footer />
    </div>
  );
}
