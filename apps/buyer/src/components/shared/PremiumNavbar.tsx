'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, CreditCard, ShoppingCart, HelpCircle, Search, Menu, X } from 'lucide-react';
import PremiumBrandsMegaMenu from '@/components/shared/PremiumBrandsMegaMenu';
import CartDrawer from '@/components/cart/CartDrawer';
import SearchBar from '@/components/shared/SearchBar';

interface PremiumNavbarProps {
  onLoginClick?: () => void;
}

export default function PremiumNavbar({ onLoginClick }: PremiumNavbarProps) {
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out flex justify-center py-6 px-4 ${scrolled ? 'pt-4' : 'pt-8'}`}>
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`max-w-[1400px] w-full mx-auto px-8 py-4 rounded-[32px] backdrop-blur-3xl transition-all duration-500 border ${
            scrolled 
              ? 'bg-white/60 border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] py-3 scale-[0.98]' 
              : 'bg-white/40 border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
          }`}
        >
          <div className="flex items-center justify-between gap-8">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group relative shrink-0">
              <div className="absolute -inset-2 bg-lime-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src="/pharmabag_logo.png"
                alt="PharmaBag Logo"
                width={120}
                height={36}
                className="h-8 w-auto relative z-10 transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Navigation Engine */}
            <div className="hidden xl:flex items-center gap-1.5 p-1.5 bg-gray-950/5 rounded-2xl border border-white/40">
              {navItems.map((item) => (
                item.type === 'menu' ? (
                  <div
                    key={item.label}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="relative"
                  >
                    <button className="px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gray-950 hover:bg-white rounded-xl transition-all flex items-center gap-2">
                      {item.label}
                      <div className={`w-1 h-1 rounded-full bg-lime-500 transition-all duration-300 ${isBrandsMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                    </button>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gray-950 hover:bg-white rounded-xl transition-all"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* Global Search Integration */}
            <div className="hidden lg:block flex-1 max-w-md">
               <SearchBar />
            </div>

            {/* Utility Signals */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 pr-6 border-r border-gray-100">
                {[
                  { icon: HelpCircle, href: '/support', label: 'Support' },
                  { icon: CreditCard, href: '/payments', label: 'Ledger' },
                  { icon: Bell, href: '/notifications', label: 'Signals', badge: true },
                ].map((action) => (
                  <Link 
                    key={action.label}
                    href={action.href} 
                    className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-gray-950 hover:bg-white rounded-xl transition-all relative group shadow-sm bg-white/40 border border-white/60"
                  >
                    <action.icon className="w-[18px] h-[18px]" />
                    {action.badge && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full ring-4 ring-rose-500/10"></span>}
                    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-950 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all whitespace-nowrap z-50 pointer-events-none">
                      {action.label}
                    </span>
                  </Link>
                ))}
                
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-gray-950 hover:bg-white rounded-xl transition-all relative group shadow-sm bg-white/40 border border-white/60"
                >
                  <ShoppingCart className="w-[18px] h-[18px]" />
                  <span className="absolute -top-1.5 -right-1.5 bg-lime-400 text-[10px] font-black text-gray-900 px-2 py-0.5 rounded-full border-2 border-white shadow-lg ring-4 ring-lime-400/10">3</span>
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-950 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all whitespace-nowrap z-50 pointer-events-none">Cart</span>
                </button>

                <Link 
                  href="/profile" 
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-gray-950 hover:bg-white rounded-xl transition-all relative group shadow-sm bg-white/40 border border-white/60"
                >
                  <User className="w-[18px] h-[18px]" />
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-950 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all whitespace-nowrap z-50 pointer-events-none">Account</span>
                </Link>
              </div>

              {/* Login Protocol */}
              <button
                onClick={onLoginClick}
                className="px-8 py-3.5 rounded-2xl bg-gray-950 text-white hover:bg-black font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:shadow-2xl shadow-xl flex items-center gap-3 group ml-2"
              >
                Access Portal
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 group-hover:animate-ping" />
              </button>
            </div>
          </div>
        </motion.div>
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
