import { z } from 'zod';
import { api } from '../api';

// ─── Schemas ────────────────────────────────────────

export const OrderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  price: z.number(),
  quantity: z.number(),
  total: z.number(),
});

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  items: z.array(OrderItemSchema),
  subtotal: z.number(),
  tax: z.number().optional(),
  deliveryCharge: z.number().optional(),
  total: z.number(),
  shippingAddress: z.string().optional(),
  paymentMethod: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const OrderListResponseSchema = z.object({
  data: z.array(OrderSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const CreateOrderSchema = z.object({
  shippingAddress: z.string().min(1),
  paymentMethod: z.string().optional(),
});

// ─── Types ──────────────────────────────────────────

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderListResponse = z.infer<typeof OrderListResponseSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// ─── API Functions ──────────────────────────────────

export async function getOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<OrderListResponse> {
  const { data } = await api.get('/orders', { params });
  return OrderListResponseSchema.parse(data);
}

export async function getOrderById(id: string): Promise<Order> {
  const { data } = await api.get(`/orders/${id}`);
  return OrderSchema.parse(data);
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const body = CreateOrderSchema.parse(input);
  const { data } = await api.post('/orders', body);
  return OrderSchema.parse(data);
}

export async function cancelOrder(id: string): Promise<Order> {
  const { data } = await api.patch(`/orders/${id}/cancel`);
  return OrderSchema.parse(data);
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return OrderSchema.parse(data);
}
