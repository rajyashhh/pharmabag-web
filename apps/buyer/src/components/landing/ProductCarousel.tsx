'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/shared/ProductCard';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

const FEATURED_PRODUCTS: Product[] = [
  { id: 1, name: 'Manforce 100mg', price: '₹545', image: '/products/pharma_bottle.png' },
  { id: 2, name: 'Saridon Tablet', price: '₹120', image: '/products/pharma_bottle.png' },
  { id: 3, name: 'Calpol 500', price: '₹35', image: '/products/pharma_bottle.png' },
  { id: 4, name: 'Hylogel Eye Drops', price: '₹280', image: '/products/pharma_bottle.png' },
  { id: 5, name: 'Ozempic Pen', price: '₹14,500', image: '/products/pharma_bottle.png' },
  { id: 6, name: 'Gollhrny Syrup', price: '₹155', image: '/products/pharma_bottle.png' },
  { id: 7, name: 'Foilyer Cap', price: '₹89', image: '/products/pharma_bottle.png' },
  { id: 8, name: 'Fhtture Injection', price: '₹1,200', image: '/products/pharma_bottle.png' },
];

export default function ProductCarousel() {
  // Triple products for truly smooth infinite scroll
  const scrollProducts = [...FEATURED_PRODUCTS, ...FEATURED_PRODUCTS, ...FEATURED_PRODUCTS];

  return (
    <div className="w-full py-12 overflow-hidden bg-transparent">
      {/* Auto-scrolling Container using Framer Motion for better control */}
      <div className="relative">
        <motion.div 
          animate={{ x: [0, -1360] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            }
          }}
          className="flex gap-2.5 px-6"
        >
          {scrollProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="flex-shrink-0 w-40">
              <ProductCard 
                name={product.name} 
                price={product.price} 
                image={product.image} 
              />
            </div>
          ))}
        </motion.div>
        

      </div>
    </div>
  );
}
