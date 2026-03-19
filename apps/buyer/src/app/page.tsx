'use client';

import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import ProductCarousel from '@/components/landing/ProductCarousel';
import TrustSection from '@/components/landing/TrustSection';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';
import LoginModal from '@/components/landing/LoginModal';

export default function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <main className="w-full">
      <Navbar onLoginClick={() => setIsLoginModalOpen(true)} />
      <HeroSection />
      <ProductCarousel />
      <TrustSection />
      <Testimonials />
      <Footer />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </main>
  );
}
