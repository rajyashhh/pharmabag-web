import { apiClient } from "@/lib/apiClient";
import type { User, Product, Order, Payout } from "@pharmabag/utils";

export async function getAdminDashboard() {
  const { data } = await apiClient.get<{ stats: any; orders: Order[]; products: Product[]; users?: User[] }>("/admin/dashboard");
  return data;
}

export async function getAdminUsers(page = 1, limit = 20) {
  const { data } = await apiClient.get<{ users: User[] }>(`/admin/users?page=${page}&limit=${limit}`);
  return data.users;
}

export async function getPendingUsers(page = 1, limit = 20) {
  const { data } = await apiClient.get<{ users: User[] }>(`/admin/users/pending?page=${page}&limit=${limit}`);
  return data.users;
}

export async function approveUser(userId: string) {
  const { data } = await apiClient.patch<{ user: User }>(`/admin/users/${userId}/approve`);
  return data.user;
}

export async function rejectUser(userId: string) {
  const { data } = await apiClient.patch<{ user: User }>(`/admin/users/${userId}/reject`);
  return data.user;
}

export async function blockUser(userId: string) {
  const { data } = await apiClient.patch<{ user: User }>(`/admin/users/${userId}/block`);
  return data.user;
}

export async function unblockUser(userId: string) {
  const { data } = await apiClient.patch<{ user: User }>(`/admin/users/${userId}/unblock`);
  return data.user;
}

export async function getAdminProducts(page = 1, limit = 20) {
  const { data } = await apiClient.get<{ products: Product[] }>(`/admin/products?page=${page}&limit=${limit}`);
  return data.products;
}

export async function disableProduct(productId: string) {
  const { data } = await apiClient.patch<{ product: Product }>(`/admin/products/${productId}/disable`);
  return data.product;
}

export async function enableProduct(productId: string) {
  const { data } = await apiClient.patch<{ product: Product }>(`/admin/products/${productId}/enable`);
  return data.product;
}

export async function deleteProduct(productId: string) {
  const { data } = await apiClient.delete<{ message: string }>(`/admin/products/${productId}`);
  return data;
}

export async function getAdminOrders(page = 1, limit = 20) {
  const { data } = await apiClient.get<{ orders: Order[] }>(`/admin/orders?page=${page}&limit=${limit}`);
  return data.orders;
}

export async function updateAdminOrderStatus(orderId: string, status: string) {
  const { data } = await apiClient.patch<{ order: Order }>(`/admin/orders/${orderId}/status`, { status });
  return data.order;
}

export async function getPayments(page = 1, limit = 20) {
  const { data } = await apiClient.get<{ payments: Payout[] }>(`/admin/payments?page=${page}&limit=${limit}`);
  return data.payments;
}

export async function confirmPayment(paymentId: string) {
  const { data } = await apiClient.patch<{ payment: Payout }>(`/admin/payments/${paymentId}/confirm`);
  return data.payment;
}

export async function rejectPayment(paymentId: string) {
  const { data } = await apiClient.patch<{ payment: Payout }>(`/admin/payments/${paymentId}/reject`);
  return data.payment;
}
