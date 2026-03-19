"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, Flag, Eye } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button, Input, Badge, ApprovalBadge } from "@/components/ui";
import { PRODUCTS, formatCurrency } from "@pharmabag/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAdminProducts, useUpdateProductStatus } from "@/hooks/useAdmin";

const EMOJI: Record<string, string> = { "eye-drops": "👁️", capsules: "🔴", tablets: "💊", syrups: "🧪", vitamins: "🌟", default: "💊" };

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const { data: productsData, isLoading } = useAdminProducts();
  const productApprove = useUpdateProductStatus();
  const filtered = (productsData ?? PRODUCTS).filter(p =>
    (filter === "all" || p.approvalStatus === filter) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.manufacturer ?? '').toLowerCase().includes(search.toLowerCase()))
  );
  if (isLoading) { return <AdminLayout><div className="min-h-screen p-6">Loading products...</div></AdminLayout>; }

  const approve = async (id: string, name: string) => {
    try {
      await productApprove.mutateAsync({ productId: id, action: "enable" });
      toast.success(`"${name}" approved`);
    } catch {
      toast.error(`Failed to approve "${name}"`);
    }
  };
  const reject = async (id: string, name: string) => {
    try {
      await productApprove.mutateAsync({ productId: id, action: "disable" });
      toast.error(`"${name}" rejected`);
    } catch {
      toast.error(`Failed to reject "${name}"`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">Product Verification</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{PRODUCTS.filter(p => p.approvalStatus === "pending").length} products pending review · {PRODUCTS.filter(p => p.approvalStatus === "rejected").length} rejected</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
          </div>
          <div className="flex gap-1.5" role="group" aria-label="Filter by approval status">
            {(["all", "pending", "approved", "rejected"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("px-3 py-2 rounded-xl text-xs font-medium border transition-all capitalize", filter === f ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:bg-accent/60")}>{f}</button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Products for review">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  {["Product", "Seller", "Category", "Price", "GST", "Expiry", "Status", "Actions"].map(h => (
                    <th key={h} scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">No products found</td></tr>
                ) : filtered.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0" aria-hidden>{EMOJI[p.category ?? "default"] ?? EMOJI.default}</div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{p.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{p.genericName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{p.sellerName}</td>
                    <td className="px-5 py-4"><Badge className="capitalize">{p.category}</Badge></td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-foreground">{formatCurrency(p.price)}</div>
                      <div className="text-xs text-green-600">{p.discount}% off</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{p.gst}%</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{p.expiryDate}</td>
                    <td className="px-5 py-4"><ApprovalBadge status={p.approvalStatus ?? "PENDING"} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button aria-label={`View ${p.name}`} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"><Eye className="h-3.5 w-3.5" /></button>
                        {p.approvalStatus === "pending" && (
                          <>
                            <button onClick={() => void approve(p.id, p.name)} aria-label={`Approve ${p.name}`} className="h-7 w-7 rounded-lg flex items-center justify-center text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"><CheckCircle className="h-3.5 w-3.5" /></button>
                            <button onClick={() => void reject(p.id, p.name)} aria-label={`Reject ${p.name}`} className="h-7 w-7 rounded-lg flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><XCircle className="h-3.5 w-3.5" /></button>
                          </>
                        )}
                        <button aria-label={`Flag ${p.name}`} className="h-7 w-7 rounded-lg flex items-center justify-center text-orange-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"><Flag className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
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
