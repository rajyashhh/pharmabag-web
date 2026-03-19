'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react';

interface PremiumProductCardProps {
  name: string;
  price: string;
  image: string;
  onClick?: () => void;
}

export default function PremiumProductCard({ name, price, image, onClick }: PremiumProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[40px] p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden"
      onClick={onClick}
    >
      <div className="absolute top-6 right-6 z-10">
         <div className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <Eye className="w-5 h-5 text-gray-950" />
         </div>
      </div>

      <div className="relative aspect-square mb-6 overflow-hidden rounded-[32px] bg-white border border-gray-100 p-8 flex items-center justify-center group-hover:bg-lime-50/30 transition-colors duration-500">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-4 mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
           <button className="w-full h-12 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2">
              <ShoppingCart className="w-3.5 h-3.5" />
              Quick Add
           </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
           <div className="flex gap-0.5">
             {[1, 2, 3, 4, 5].map(i => (
               <Star key={i} className="w-2.5 h-2.5 fill-lime-400 text-lime-400" />
             ))}
           </div>
           <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">(48)</span>
        </div>
        
        <div>
           <h3 className="text-xl font-black text-gray-900 leading-none mb-1 group-hover:text-lime-600 transition-colors">{name}</h3>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">GSK Pharmaceuticals</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100/50">
          <p className="text-2xl font-black text-gray-950 tracking-tighter">{price}</p>
          <div className="px-3 py-1 bg-lime-100 rounded-lg">
             <span className="text-[10px] font-black text-lime-700 uppercase tracking-widest">In Stock</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
