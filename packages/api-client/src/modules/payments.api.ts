import { z } from 'zod';
import { api } from '../api';

// ─── Schemas ────────────────────────────────────────

export const PaymentSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  amount: z.number(),
  currency: z.string().default('INR'),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'refunded']),
  method: z.string().optional(),
  transactionId: z.string().optional(),
  createdAt: z.string(),
});

export const InitiatePaymentSchema = z.object({
  orderId: z.string(),
  method: z.string().optional(),
});

export const PaymentResponseSchema = z.object({
  payment: PaymentSchema,
  gatewayOrderId: z.string().optional(),
  gatewayKey: z.string().optional(),
});

// ─── Types ──────────────────────────────────────────

export type Payment = z.infer<typeof PaymentSchema>;
export type InitiatePaymentInput = z.infer<typeof InitiatePaymentSchema>;
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;

// ─── API Functions ──────────────────────────────────

export async function initiatePayment(input: InitiatePaymentInput): Promise<PaymentResponse> {
  const body = InitiatePaymentSchema.parse(input);
  const { data } = await api.post('/payments/initiate', body);
  return PaymentResponseSchema.parse(data);
}

export async function verifyPayment(paymentId: string, transactionId: string): Promise<Payment> {
  const { data } = await api.post('/payments/verify', { paymentId, transactionId });
  return PaymentSchema.parse(data);
}

export async function getPaymentByOrderId(orderId: string): Promise<Payment> {
  const { data } = await api.get(`/payments/order/${orderId}`);
  return PaymentSchema.parse(data);
}

export async function getPaymentHistory(params?: {
  page?: number;
  limit?: number;
}): Promise<{ data: Payment[]; total: number }> {
  const { data } = await api.get('/payments', { params });
  return data;
}
