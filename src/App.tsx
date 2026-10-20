import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import ScrollProgress from './components/layout/ScrollProgress';
import About from './components/sections/About';
import ContactCta from './components/sections/ContactCta';
import Furnitures from './components/sections/Furnitures';
import Hero from './components/sections/Hero';
import Intro from './components/sections/Intro';
import ProductFeature from './components/sections/ProductFeature';
import WhyPartner from './components/sections/WhyPartner';

export default function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Furnitures />
        <ProductFeature id="doors" />
        <ProductFeature id="flooring" reverse tone="muted" />
        <WhyPartner />
        <About />
        <ContactCta />
      </main>
      <Footer />
    </div>
  );
}
