'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ChevronRight, LayoutGrid, List } from 'lucide-react';
import PremiumNavbar from '@/components/shared/PremiumNavbar';
import PremiumFooter from '@/components/shared/PremiumFooter';
import PremiumProductCard from '@/components/shared/PremiumProductCard';
import { SkeletonCard } from '@/components/shared/LoaderSkeleton';
import EmptyState from '@/components/shared/EmptyState';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const { data: productsData, isLoading, isError } = useProducts({
    search: debouncedSearch,
    categoryId: selectedCategory || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
  });

  const { data: categoriesData } = useCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any)?.data ?? [];
  const products = productsData?.data ?? [];

  return (
    <main className="min-h-screen bg-[#f8fbfa]">
      <PremiumNavbar />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
              Browse Products
            </h1>
            <p className="text-lg text-gray-400 font-medium">
              Explore {products.length}+ pharmaceutical products
            </p>
          </motion.div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="flex-1 md:w-80 group relative">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-lime-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full h-14 bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl pl-14 pr-6 text-gray-900 font-medium focus:ring-4 focus:ring-lime-300 focus:bg-white outline-none transition-all shadow-lg shadow-black/5"
              />
            </div>

            <div className="flex bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl p-1 shadow-lg">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[40px] p-8 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-8">
                <Filter className="w-5 h-5 text-gray-900" />
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</p>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${!selectedCategory ? 'bg-lime-300 text-gray-900 font-bold' : 'text-gray-600 hover:bg-white/50 font-medium'}`}
                >
                  <span>All Products</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
                {categories.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${selectedCategory === cat.slug ? 'bg-lime-300 text-gray-900 font-bold' : 'text-gray-600 hover:bg-white/50 font-medium'}`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </div>

              {/* Price Range */}
              <div className="mt-12 pt-12 border-t border-white/40">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price Range</p>
                  <span className="text-sm font-bold text-gray-900">₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lime-400"
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>₹0</span>
                  <span>₹10,000+</span>
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {Array.from({ length: 9 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </motion.div>
              ) : isError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 gap-4"
                >
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <SlidersHorizontal className="w-10 h-10 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Something went wrong</h3>
                  <button className="text-lime-500 font-bold hover:underline">Try reloading the page</button>
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <EmptyState
                    icon={SlidersHorizontal}
                    title="No products found"
                    description={`We couldn't find any products matching "${searchTerm}" in this category.`}
                    actionLabel="Clear filters"
                    onAction={() => {
                        setSearchTerm('');
                        setSelectedCategory(null);
                        setPriceRange([0, 10000]);
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {products.map((product: any, idx: number) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <PremiumProductCard
                        name={product.name}
                        price={`₹${product.price}`}
                        image={product.image || '/product_placeholder.png'}
                        onClick={() => window.location.href = `/products/${product.id}`}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <PremiumFooter />
    </main>
  );
}
