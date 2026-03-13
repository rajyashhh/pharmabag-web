import { z } from 'zod';
import { api } from '../api';

// ─── Schemas ────────────────────────────────────────

export const CartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  price: z.number(),
  quantity: z.number(),
  total: z.number(),
  image: z.string().optional(),
});

export const CartSchema = z.object({
  id: z.string(),
  items: z.array(CartItemSchema),
  subtotal: z.number(),
  total: z.number(),
  itemCount: z.number(),
});

// ─── Types ──────────────────────────────────────────

export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;

// ─── API Functions ──────────────────────────────────

export async function getCart(): Promise<Cart> {
  const { data } = await api.get('/cart');
  return CartSchema.parse(data);
}

export async function addToCart(productId: string, quantity: number = 1): Promise<Cart> {
  const { data } = await api.post('/cart/items', { productId, quantity });
  return CartSchema.parse(data);
}

export async function updateCartItem(itemId: string, quantity: number): Promise<Cart> {
  const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
  return CartSchema.parse(data);
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const { data } = await api.delete(`/cart/items/${itemId}`);
  return CartSchema.parse(data);
}

export async function clearCart(): Promise<void> {
  await api.delete('/cart');
}
