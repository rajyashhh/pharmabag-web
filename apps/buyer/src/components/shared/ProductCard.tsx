'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  onClick?: () => void;
}

export default function ProductCard({ name, price, image, onClick }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl p-3 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-xl bg-[#f1f6ea]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-2 transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1 truncate text-center">{name}</h3>
      <p className="text-sm font-medium text-gray-900 text-center">{price}</p>
    </motion.div>
  );
}
