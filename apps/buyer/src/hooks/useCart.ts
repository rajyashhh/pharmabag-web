'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '@pharmabag/api-client';

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    staleTime: 15 * 1000, // 15s: keeps data fresh for shorter window, ensures relatively recent cart state
    gcTime: 60 * 1000,    // 1 minute: keeps data in cache for 1 minute for offline resilience
    refetchOnMount: true,    // Always refetch when component mounts (new page visit)
    refetchOnWindowFocus: true, // Refetch when user switches tabs/windows
    refetchIntervalInBackground: false, // Don't refetch in background (user not viewing)
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity?: number }) => {
      try {
        return await addToCart(productId, quantity);
      } catch (err: any) {
        const status = err?.response?.status;
        const errorMsg = err?.response?.data?.message || '';

        // If product already in cart, update quantity via PATCH instead
        if (status === 400 && errorMsg.toLowerCase().includes('already in cart')) {
          console.log('[Cart] Product already in cart, updating quantity instead');
          const freshCart = await getCart();
          const cartItem = freshCart.items.find((item) => item.productId === productId);

          if (cartItem) {
            const newQuantity = cartItem.quantity + (quantity || 1);
            return await updateCartItem(cartItem.id, newQuantity);
          }
          // Item exists per backend but we can't find it — just refetch
          return freshCart;
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    retry: (failureCount, error: any) => {
      const status = error?.response?.status ?? error?.status;
      if (status === 400 || status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
