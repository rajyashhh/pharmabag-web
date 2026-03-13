import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import BrandStrip from '@/components/landing/BrandStrip';
import ProductCarousel from '@/components/landing/ProductCarousel';
import TrustSection from '@/components/landing/TrustSection';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-300 to-lime-200">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Brand Strip */}
      <BrandStrip />

      {/* Featured Products */}
      <ProductCarousel />

      {/* Trust Section */}
      <TrustSection />

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />
    </main>
  );
}
