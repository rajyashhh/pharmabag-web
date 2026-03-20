'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import PremiumBrandsMegaMenu from '@/components/shared/PremiumBrandsMegaMenu';
import CartDrawer from '@/components/cart/CartDrawer';

import { useAuth } from '@pharmabag/api-client';

interface PremiumNavbarProps {
  onLoginClick?: () => void;
}

export default function PremiumNavbar({ onLoginClick }: PremiumNavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const navItems = [
    { label: 'Brands', href: '#', type: 'menu' },
    { label: 'Ethical', href: '/products?category=ethical' },
    { label: 'Generic', href: '/products?category=generic' },
    { label: 'Surgical', href: '/products?category=surgical' },
    { label: 'Ayurvedic', href: '/products?category=ayurvedic' },
    { label: 'OTC', href: '/products?category=otc' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsBrandsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsBrandsMenuOpen(false);
    }, 150);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-5'} px-6 md:px-12`}>
        <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
              <span className="text-3xl font-black text-black tracking-tighter italic pr-2">P</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-10">
              {navItems.map((item) => (
                item.type === 'menu' ? (
                  <div
                    key={item.label}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="relative cursor-pointer py-2"
                  >
                    <span className="text-[14px] font-semibold text-gray-800 hover:text-black transition-colors">{item.label}</span>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[14px] font-semibold text-gray-800 hover:text-black transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-6">
               <button className="text-black hover:text-gray-600 transition-colors">
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
               </button>
               
               <button 
                 onClick={() => setIsCartOpen(true)}
                 className="text-black hover:text-gray-600 transition-colors"
               >
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
               </button>

               <Link href="/profile" className="text-black hover:text-gray-600 transition-colors">
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
               </Link>

              {/* Login/Logout Protocol for Auth */}
              {!isAuthenticated ? (
                <button
                  onClick={onLoginClick}
                  className="hidden md:flex ml-2 px-5 py-2 rounded-full bg-black text-white hover:bg-gray-800 font-medium text-sm transition-all"
                >
                  Sign In
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-3 ml-2 border-l border-gray-300 pl-4">
                  <span className="text-xs font-bold text-gray-900">{user?.phone}</span>
                  <button 
                    onClick={() => logout()}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    title="Logout"
                  >
                    <X className="w-4 h-4 text-black" />
                  </button>
                </div>
              )}
            </div>
        </div>
      </nav>

      <PremiumBrandsMegaMenu
        isOpen={isBrandsMenuOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
