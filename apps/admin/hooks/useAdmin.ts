"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sendOtp, verifyOtp, getCurrentUser } from "@/api/auth.api";
import { getAdminDashboard, getAdminUsers, approveUser, rejectUser, blockUser, unblockUser, getAdminProducts, disableProduct, enableProduct, deleteProduct, getAdminOrders, updateAdminOrderStatus, getPayments, confirmPayment, rejectPayment } from "@/api/admin.api";
import { useAdminAuth } from "@/store";

export function useSendAdminOtp() { return useMutation({ mutationFn: sendOtp }); }

export function useVerifyAdminOtp() {
  const queryClient = useQueryClient();
  const { setUser } = useAdminAuth();
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("pb_token", data.accessToken);
      }
      setUser(data.user);
      void queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useAdminMe() { return useQuery({ queryKey: ["admin", "me"], queryFn: getCurrentUser, enabled: false, staleTime: 60_000, retry: 1 }); }
export function useAdminDashboard() { return useQuery({ queryKey: ["admin", "dashboard"], queryFn: getAdminDashboard, staleTime: 60_000, retry: 1 }); }
export function useAdminUsers() { return useQuery({ queryKey: ["admin", "users"], queryFn: () => getAdminUsers(1, 50), staleTime: 60_000, retry: 1 }); }
export function useAffirmUserStatus() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ userId, action }: { userId: string; action: "approve" | "reject" | "block" | "unblock" }) => {
    if (action === "approve") return approveUser(userId);
    if (action === "reject") return rejectUser(userId);
    if (action === "block") return blockUser(userId);
    return unblockUser(userId);
  }, onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin", "users"] }) }); }

export function useAdminProducts() { return useQuery({ queryKey: ["admin", "products"], queryFn: () => getAdminProducts(1, 50), staleTime: 60_000, retry: 1 }); }
export function useUpdateProductStatus() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ productId, action }: { productId: string; action: "disable" | "enable" }) => action === "enable" ? enableProduct(productId) : disableProduct(productId), onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin", "products"] }) }); }
export function useDeleteProduct() { const qc = useQueryClient(); return useMutation({ mutationFn: (productId: string) => deleteProduct(productId), onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin", "products"] }) }); }

export function useAdminOrders() { return useQuery({ queryKey: ["admin", "orders"], queryFn: () => getAdminOrders(1, 50), staleTime: 60_000, retry: 1 }); }
export function useUpdateAdminOrderStatus() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ orderId, status }: { orderId: string; status: string }) => updateAdminOrderStatus(orderId, status), onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin", "orders"] }) }); }

export function usePayments() { return useQuery({ queryKey: ["admin", "payments"], queryFn: () => getPayments(1, 50), staleTime: 60_000, retry: 1 }); }
export function useConfirmPayment() { const qc = useQueryClient(); return useMutation({ mutationFn: (paymentId: string) => confirmPayment(paymentId), onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin", "payments"] }) }); }
export function useRejectPayment() { const qc = useQueryClient(); return useMutation({ mutationFn: (paymentId: string) => rejectPayment(paymentId), onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin", "payments"] }) }); }
