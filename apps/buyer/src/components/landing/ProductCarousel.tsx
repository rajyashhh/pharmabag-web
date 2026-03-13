'use client';

interface Product {
  id: number;
  name: string;
  price: string;
}

const FEATURED_PRODUCTS: Product[] = [
  { id: 1, name: 'manforce', price: '₹545' },
  { id: 2, name: 'saridon', price: '₹545' },
  { id: 3, name: 'calpos 50', price: '₹545' },
  { id: 4, name: 'hylogel', price: '₹545' },
  { id: 5, name: 'ozempic', price: '₹545' },
  { id: 6, name: 'gollhrny', price: '₹545' },
  { id: 7, name: 'Foilyer', price: '₹545' },
  { id: 8, name: 'Fhtture', price: '₹545' },
];

export default function ProductCarousel() {
  return (
    <div className="px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-lg rounded-2xl p-4 md:p-6 hover:scale-105 hover:bg-white/40 transition-all duration-300 cursor-pointer group"
            >
              {/* Product Image Placeholder */}
              <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center">
                  <div className="w-12 h-16 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg"></div>
                </div>
              </div>

              {/* Product Info */}
              <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-gray-900 mt-2">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
