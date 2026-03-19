"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button, Input, Badge, StatusBadge } from "@/components/ui";
import { ORDERS, formatCurrency, formatDate } from "@pharmabag/utils";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@pharmabag/utils";
import { useAdminOrders, useUpdateAdminOrderStatus } from "@/hooks/useAdmin";

const FILTERS: { label: string; v: OrderStatus | "all" }[] = [
  { label: "All", v: "all" }, { label: "Pending", v: "pending" }, { label: "Processing", v: "processing" },
  { label: "Shipped", v: "shipped" }, { label: "Delivered", v: "delivered" }, { label: "Cancelled", v: "cancelled" },
];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const { data: ordersData, isLoading } = useAdminOrders();
  const updateStatus = useUpdateAdminOrderStatus();
  const allOrders = ordersData ?? ORDERS;

  const filtered = allOrders.filter(o =>
    (filter === "all" || o.status === filter) &&
    (!search || (o.orderNumber ?? '').toLowerCase().includes(search.toLowerCase()) || (o.buyerName ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  if (isLoading) return <AdminLayout><div className="min-h-screen p-6 text-center">Loading orders...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">Order Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{ORDERS.length} total orders · {ORDERS.filter(o => o.status === "pending").length} pending</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input placeholder="Search by order number or buyer…" value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
          </div>
          <div className="flex gap-1.5 flex-wrap" role="group">
            {FILTERS.map(({ label, v }) => (
              <button key={v} onClick={() => setFilter(v)}
                className={cn("px-3 py-2 rounded-xl text-xs font-medium border transition-all", filter === v ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:bg-accent/60")}>{label}</button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Platform orders">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  {["Order #", "Buyer", "Seller", "Items", "Amount", "Payment", "Status", "Action", "Date"].map(h => (
                    <th key={h} scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="py-12 text-center text-sm text-muted-foreground">No orders found</td></tr>
                ) : filtered.map((o, i) => (
                  <motion.tr key={o.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-4"><span className="font-mono text-xs font-medium text-foreground">{o.orderNumber}</span></td>
                    <td className="px-5 py-4"><div className="text-sm font-medium text-foreground">{o.buyerName}</div><div className="text-xs text-muted-foreground">{o.buyerBusiness}</div></td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{o.sellerName}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{o.items?.length ?? 0}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-foreground">{formatCurrency(o.finalAmount ?? o.total ?? 0)}</td>
                    <td className="px-5 py-4"><Badge variant={o.paymentStatus === "paid" ? "success" : o.paymentStatus === "pending" ? "warning" : "error"}>{o.paymentStatus}</Badge></td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-4"><button onClick={() => updateStatus.mutate({ orderId: o.id, status: o.status === "pending" ? "confirmed" : "shipped" })} className="text-xs text-primary underline">Override</button></td>
                    <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">{formatDate(o.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
