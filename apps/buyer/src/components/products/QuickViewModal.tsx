'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/shared/Toast';
import { StockBasedButton } from '@/components/shared/StockBasedButton';
import { ShareButton } from '@/components/shared/ShareButton';
import { PriceSection } from '@/components/shared/PriceSection';
import { NotifyStockAlertModal } from '@/components/shared/NotifyStockAlertModal';
import { useAddToCart } from '@/hooks/useCart';
import { calculatePricing, getSellingPrice, getEffectiveDiscountPercent } from '@pharmabag/utils';
import type { Product } from '@pharmabag/utils';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const addToCart = useAddToCart();
  const [showStockAlert, setShowStockAlert] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;

    const moq = product.minimumOrderQuantity || 1;
    addToCart.mutate(
      { productId: product.id, quantity: moq },
      {
        onSuccess: () => {
          toast(`${product.name} added to cart!`, 'success');
          // Don't close modal - let user continue shopping
        },
        onError: (err: any) => {
          toast(err?.message || 'Failed to add to cart', 'error');
        },
      }
    );
  };

  const handleViewProduct = () => {
    if (!product) return;
    onClose();
    router.push(`/products/${product.id}`);
  };

  if (!product) return null;

  // Calculate pricing
  const dd = (product as any).discountDetails || (product as any).discountFormDetails;
  let sellingPrice = product.price ?? 0;
  let computedPtr: number | undefined;
  let buyGetTag = '';

  if (dd?.type && product.mrp && (product as any).gstPercent != null) {
    try {
      const pricing = calculatePricing(product.mrp, (product as any).gstPercent, dd);
      sellingPrice = getSellingPrice(pricing);
      computedPtr = pricing.ptr;
      if (pricing.get > 0) {
        buyGetTag = `Buy ${pricing.buy} Get ${pricing.get}`;
      }
    } catch {
      // Fallback
    }
  }

  const discount = product.mrp ? Math.round(getEffectiveDiscountPercent(product.mrp, sellingPrice)) : 0;
  const inStock = (product.stock ?? 0) > 0;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="quick-view-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Glassmorphism Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[820px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50"
            >
              {/* Top Actions */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <ShareButton
                  productName={product.name}
                  productPrice={sellingPrice}
                  productImage={product.images?.[0]}
                  productId={product.id}
                  discount={discount}
                  className="p-2.5 rounded-full bg-white/80 hover:bg-white border border-gray-100 shadow-sm"
                />
                <button
                  className="p-2.5 rounded-full bg-white/80 hover:bg-white border border-gray-100 shadow-sm transition-all hover:scale-105"
                  onClick={onClose}
                >
                  <X className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left: Product Image */}
                <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-l-3xl min-h-[350px]">
                  <div className="relative w-full h-[300px]">
                    <Image
                      src={product.images?.[0] || '/product_placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-lg"
                      sizes="400px"
                    />
                  </div>
                </div>

                {/* Right: Product Details */}
                <div className="p-7 pt-14 flex flex-col gap-6">
                  {/* Product Name & Category */}
                  <div>
                    {product.category && (
                      <span className="text-[10px] font-bold text-lime-700 bg-lime-100 px-3 py-1 rounded-2xl uppercase tracking-widest inline-block mb-3">
                        {typeof product.category === 'object' ? (product.category as any).name : product.category}
                      </span>
                    )}
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug pr-8">
                      {product.name}
                    </h2>
                    {product.manufacturer && (
                      <p className="text-sm text-gray-500 font-medium mt-2">by {product.manufacturer}</p>
                    )}
                  </div>

                  {/* Pricing */}
                  <PriceSection
                    mrp={product.mrp || sellingPrice}
                    sellingPrice={sellingPrice}
                    ptr={computedPtr}
                    gstPercent={(product as any).gstPercent}
                    discountPercent={discount}
                    buyGetTag={buyGetTag}
                    compact={true}
                  />

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm bg-gray-50/50 rounded-2xl p-4">
                    {product.minimumOrderQuantity && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-bold">Min Qty:</span>
                        <span className="text-gray-900 font-medium">{product.minimumOrderQuantity}</span>
                      </div>
                    )}
                    
                    {product.stock !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-bold">Stock:</span>
                        <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                          {inStock ? `${product.stock} units` : 'Out of Stock'}
                        </span>
                      </div>
                    )}

                    {product.expiryDate && (
                      <div className="flex justify-between col-span-2">
                        <span className="text-gray-600 font-bold">Expiry:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(product.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div className="text-sm text-gray-600 line-clamp-3">
                      {product.description}
                    </div>
                  )}

                  {/* Chemical Composition */}
                  {(product as any).chemicalComposition && (
                    <div className="text-sm">
                      <span className="font-bold text-gray-600">Chemical: </span>
                      <span className="text-gray-700">{(product as any).chemicalComposition}</span>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="w-full h-px bg-gray-200" />

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <StockBasedButton
                        stock={product.stock ?? 0}
                        moq={product.minimumOrderQuantity || 1}
                        onAddToCart={handleAddToCart}
                        onNotifyStockAlert={() => setShowStockAlert(true)}
                        isLoading={addToCart.isPending}
                        disabled={false}
                      />
                    </div>

                    <button
                      onClick={handleViewProduct}
                      className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-colors shadow-lg"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock Alert Modal */}
      <NotifyStockAlertModal
        isOpen={showStockAlert}
        productName={product.name}
        productId={product.id}
        onClose={() => setShowStockAlert(false)}
      />
    </>
  );
}
