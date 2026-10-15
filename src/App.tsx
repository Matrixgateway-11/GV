import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CollectionSection from './components/CollectionSection';
import About from './components/About';
import Footer from './components/Footer';
import { furnitureGallery } from './data/gallery';

export default function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <CollectionSection
          id="furnitures"
          eyebrow="Our Furnitures Collection"
          title="Comfort shaped for every space you love"
          subtitle="Rattan, cane, teak and hand-woven rope — indoor and outdoor pieces finished by hand in Indonesia for homes around the world."
          images={furnitureGallery}
          theme="gold"
        />
        <CollectionSection
          id="doors"
          eyebrow="Our Doors Collection"
          title="Doors that make an entrance"
          subtitle="Our doors collection is coming to the website soon. Get in touch and we'll share the full range with you."
          enquiry={{ label: 'Enquire about Doors', subject: 'Doors enquiry' }}
          theme="sage"
          tone="muted"
        />
        <CollectionSection
          id="flooring"
          eyebrow="Our Flooring Collection"
          title="Flooring with natural character"
          subtitle="Our flooring collection is coming to the website soon. Get in touch and we'll share the full range with you."
          enquiry={{ label: 'Enquire about Flooring', subject: 'Flooring enquiry' }}
          theme="gold"
        />
        <About />
      </main>
      <Footer />
    </div>
  );
}
