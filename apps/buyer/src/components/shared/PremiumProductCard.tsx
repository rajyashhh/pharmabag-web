'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Share2, Plus, ArrowUpRight } from 'lucide-react';

interface PremiumProductCardProps {
  name: string;
  price: number | string;
  mrp?: number | string;
  image: string;
  moq?: number;
  ptr?: number | string;
  discountTag?: string; // e.g., "15% Off (9+0)"
  onClick?: () => void;
}

export default function PremiumProductCard({ 
  name, 
  price, 
  mrp,
  image, 
  moq = 162,
  ptr,
  discountTag = "15% Off (9+0)",
  onClick 
}: PremiumProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-[#f2fcf6] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative cursor-pointer flex flex-col w-full max-w-[280px]"
      onClick={onClick}
    >
      {/* Top Left Discount Tag - Overlapping */}
      <div className="absolute -top-3 -left-3 bg-white border border-gray-200 rounded-full px-3 py-1 text-[11px] font-medium text-gray-800 shadow-sm z-10">
        {discountTag}
      </div>

      {/* Top Actions */}
      <div className="flex justify-between items-start w-full relative z-10">
        <button className="p-1.5 text-black hover:text-gray-600 transition-colors mt-2">
          <Share2 className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <button className="p-1 text-black hover:text-gray-600 transition-colors">
          <Plus className="w-8 h-8" strokeWidth={1.5} />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square w-full flex items-center justify-center -mt-4 mb-2">
        <Image
           src={image === '/product_placeholder.png' ? '/product_placeholder.png' : image}
           alt={name}
           fill
           className="object-contain p-4 mix-blend-multiply"
        />
        {/* Teal right arrow ribbon */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-10 bg-[#14b8a6] flex items-center justify-center -mr-4 clip-path-arrow">
           {/* The ribbon has a cutout on the left, but CSS clip-path can do it, or just a simple block */}
           <div className="absolute left-0 w-0 h-0 border-y-[20px] border-y-transparent border-l-[12px] border-l-[#f2fcf6]"></div>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow justify-end">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-medium text-gray-900 leading-tight truncate pr-2">
            {name}
          </h3>
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        </div>

        <div className="w-full h-px bg-gray-300 mb-3"></div>

        <div className="grid grid-cols-3 gap-2 items-end pb-1 w-full">
          {/* MRP */}
          <div className="flex flex-col overflow-hidden">
             <span className="text-[11px] font-bold text-black uppercase mb-1">MRP</span>
             <span className="text-sm font-medium text-black truncate">₹{mrp || price}</span>
          </div>
          
          {/* MOQ */}
          <div className="flex flex-col items-center">
             <span className="text-[11px] font-bold text-black uppercase mb-1 whitespace-nowrap">MOQ {moq}</span>
             <span className="text-sm font-medium text-black h-5"></span> {/* Empty space for alignment */}
          </div>

          {/* N. RATE / PTR */}
          <div className="flex flex-col items-end overflow-hidden">
             <span className="text-[11px] font-bold text-black uppercase mb-1 whitespace-nowrap">{ptr ? 'PTR' : 'N. RATE'}</span>
             <span className="text-sm font-medium text-black truncate">₹{ptr || price}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
