import { z } from 'zod';
import { api } from '../api';
import { PRODUCTS as MOCK_PRODUCTS } from '@pharmabag/utils/mockData';

// ─── Schemas ────────────────────────────────────────

export const CartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string().optional(),
  name: z.string().optional(),
  price: z.number(),
  quantity: z.number(),
  total: z.number().optional(),
  image: z.string().optional(),
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    mrp: z.number().optional(),
    images: z.array(z.string()).optional(),
    manufacturer: z.string().optional(),
  }).optional(),
});

export const CartSchema = z.object({
  id: z.string().optional(),
  items: z.array(CartItemSchema),
  subtotal: z.number().optional(),
  total: z.number().optional(),
  itemCount: z.number().optional(),
});

// ─── Types ──────────────────────────────────────────

export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;

// ─── Mock Cart Store ────────────────────────────────

let mockCart: Cart = {
  id: 'mock-cart-1',
  items: [],
  subtotal: 0,
  total: 0,
  itemCount: 0,
};

function recalculateCart(): void {
  const subtotal = mockCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  mockCart.subtotal = subtotal;
  mockCart.total = subtotal;
  mockCart.itemCount = mockCart.items.length;
}

// ─── API Functions ──────────────────────────────────

export async function getCart(): Promise<Cart> {
  try {
    const { data } = await api.get('/cart');
    return data;
  } catch (err) {
    console.log('[Cart] Falling back to mock data for getCart');
    return structuredClone(mockCart);
  }
}

export async function addToCart(productId: string, quantity: number = 1): Promise<Cart> {
  try {
    const { data } = await api.post('/cart/add', { productId, quantity });
    return data;
  } catch (err) {
    console.log('[Cart] Falling back to mock data for addToCart');
    const product = MOCK_PRODUCTS.find((p: any) => p.id === productId);
    if (!product) throw new Error('Product not found');
    
    const existingItem = mockCart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      const images = Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []);
      mockCart.items.push({
        id: `cart-item-${Date.now()}`,
        productId,
        productName: product.name,
        name: product.name,
        price: product.price,
        quantity,
        total: product.price * quantity,
        image: images[0],
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          mrp: product.mrp,
          images: images.length > 0 ? images : undefined,
          manufacturer: product.manufacturer,
        },
      });
    }
    recalculateCart();
    return structuredClone(mockCart);
  }
}

export async function updateCartItem(itemId: string, quantity: number): Promise<Cart> {
  try {
    const { data } = await api.patch(`/cart/item/${itemId}`, { quantity });
    return data;
  } catch (err) {
    console.log('[Cart] Falling back to mock data for updateCartItem');
    const item = mockCart.items.find(i => i.id === itemId);
    if (!item) throw new Error('Cart item not found');
    
    item.quantity = quantity;
    item.total = item.price * quantity;
    recalculateCart();
    return structuredClone(mockCart);
  }
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  try {
    const { data } = await api.delete(`/cart/item/${itemId}`);
    return data;
  } catch (err) {
    console.log('[Cart] Falling back to mock data for removeCartItem');
    mockCart.items = mockCart.items.filter(item => item.id !== itemId);
    recalculateCart();
    return structuredClone(mockCart);
  }
}

export async function clearCart(): Promise<void> {
  try {
    await api.delete('/cart');
  } catch (err) {
    console.log('[Cart] Falling back to mock data for clearCart');
    mockCart.items = [];
    recalculateCart();
  }
}
