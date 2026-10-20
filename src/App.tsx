import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import ScrollProgress from './components/layout/ScrollProgress';
import About from './components/sections/About';
import ContactCta from './components/sections/ContactCta';
import Hero from './components/sections/Hero';
import Intro from './components/sections/Intro';
import ProductSection from './components/sections/ProductSection';
import WhyPartner from './components/sections/WhyPartner';

export default function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <ProductSection id="furnitures" tone="muted" />
        <ProductSection id="doors" />
        <ProductSection id="flooring" tone="muted" />
        <WhyPartner />
        <About />
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}
