import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatWeDo from './components/WhatWeDo';
import WhyUs from './components/WhyUs';
import About from './components/About';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <WhatWeDo />
        <WhyUs />
        <About />
      </main>
      <Footer />
    </div>
  );
}
