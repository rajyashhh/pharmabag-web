'use client';

import React from 'react';

const BrandsStrip = () => {
  const brands = [
    'SPAZIO',
    'Gamarance',
    'Gasparyan',
    'Ocean',
    'Eembrecque',
    'Helveior',
    'RODOND',
  ];

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent px-[4vw]">
      <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 flex-wrap">
        {brands.map((brand) => (
          <div
            key={brand}
            className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer whitespace-nowrap"
          >
            {brand}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsStrip;
