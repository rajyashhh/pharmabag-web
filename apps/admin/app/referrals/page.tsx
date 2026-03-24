"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Tag, Copy, Gift } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button, Badge, Input, Modal, Pagination } from "@/components/ui";
import toast from "react-hot-toast";
import { useReferralCodes, useCreateReferralCode, useDeleteReferralCode } from "@/hooks/useAdmin";

export default function ReferralsPage() {
  const [page, setPage] = useState(1);
  const limit = 25;
  const { data: referralData, isLoading } = useReferralCodes({ page, limit });
  const createCode = useCreateReferralCode();
  const deleteCode = useDeleteReferralCode();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: "", discountPercent: "", maxUses: "", expiresAt: "" });

  const referrals: any[] = Array.isArray(referralData) ? referralData : (referralData?.data ?? []);
  const total = referralData?.total ?? referrals.length;

  const handleCreate = async () => {
    if (!form.code || !form.discountPercent) { toast.error("Code and discount % are required"); return; }
    try {
      await createCode.mutateAsync({
        code: form.code.toUpperCase(),
        discountPercent: Number(form.discountPercent),
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
      });
      toast.success("Referral code created");
      setShowModal(false);
    } catch {
      toast.error("Failed to create referral code");
    }
  };

  const handleDelete = async (item: any) => {
    if (!window.confirm(`Delete referral code "${item.code}"?`)) return;
    try {
      await deleteCode.mutateAsync(item.id);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading referral codes…</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-2xl text-foreground">Referral Codes</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{total} referral codes</p>
          </div>
          <Button onClick={() => { setForm({ code: "", discountPercent: "", maxUses: "", expiresAt: "" }); setShowModal(true); }} leftIcon={<Plus className="h-4 w-4" />}>Create Code</Button>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  {["Code", "Discount", "Uses / Max", "Expires", "Status", "Created", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {referrals.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No referral codes yet</td></tr>
                ) : referrals.map((r: any, i: number) => {
                  const expired = r.expiresAt && new Date(r.expiresAt) < new Date();
                  const maxReached = r.maxUses && r.usedCount >= r.maxUses;
                  return (
                    <motion.tr key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-accent/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="font-mono text-sm font-bold text-foreground">{r.code}</span>
                          <button onClick={() => copyCode(r.code)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
                        </div>
                      </td>
                      <td className="px-5 py-4"><Badge variant="success">{r.discountPercent}%</Badge></td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{r.usedCount ?? 0}{r.maxUses ? ` / ${r.maxUses}` : " / ∞"}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString("en-IN") : "Never"}</td>
                      <td className="px-5 py-4">
                        <Badge variant={expired ? "error" : maxReached ? "warning" : "success"}>
                          {expired ? "Expired" : maxReached ? "Max Reached" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                      <td className="px-5 py-4">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(r)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {total > limit && (
            <div className="p-4 border-t border-border/50">
              <Pagination page={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create Referral Code">
        <div className="space-y-4">
          <Input label="Code" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. WELCOME10" />
          <Input label="Discount (%)" type="number" value={form.discountPercent} onChange={e => setForm(f => ({ ...f, discountPercent: e.target.value }))} placeholder="10" />
          <Input label="Max Uses (optional)" type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="Leave empty for unlimited" />
          <Input label="Expires At (optional)" type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate} loading={createCode.isPending}>Create</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
