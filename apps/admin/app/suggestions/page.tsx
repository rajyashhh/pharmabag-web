"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Pencil, Trash2, Upload, FileSpreadsheet } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button, Badge, Input, Modal, Textarea, Pagination } from "@/components/ui";
import toast from "react-hot-toast";
import { useSuggestions, useCreateSuggestion, useUpdateSuggestion, useDeleteSuggestion, useImportSuggestionsCsv } from "@/hooks/useAdmin";

export default function SuggestionsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 25;
  const { data: suggestionsData, isLoading } = useSuggestions({ page, limit, search: search || undefined });
  const createSuggestion = useCreateSuggestion();
  const updateSuggestion = useUpdateSuggestion();
  const deleteSuggestion = useDeleteSuggestion();
  const importCsv = useImportSuggestionsCsv();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", manufacturer: "", composition: "", mrp: "", category: "" });

  const suggestions: any[] = Array.isArray(suggestionsData) ? suggestionsData : (suggestionsData?.data ?? []);
  const total = suggestionsData?.total ?? suggestions.length;

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", manufacturer: "", composition: "", mrp: "", category: "" });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ name: item.name ?? "", manufacturer: item.manufacturer ?? "", composition: item.composition ?? item.chemicalComposition ?? "", mrp: String(item.mrp ?? ""), category: item.category ?? "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, mrp: form.mrp ? Number(form.mrp) : undefined };
      if (editing) {
        await updateSuggestion.mutateAsync({ id: editing.id, payload });
        toast.success("Suggestion updated");
      } else {
        await createSuggestion.mutateAsync(payload);
        toast.success("Suggestion created");
      }
      setShowModal(false);
    } catch {
      toast.error(editing ? "Failed to update" : "Failed to create");
    }
  };

  const handleDelete = async (item: any) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    try {
      await deleteSuggestion.mutateAsync(item.id);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importCsv.mutateAsync(file);
      toast.success("CSV imported successfully");
    } catch {
      toast.error("Failed to import CSV");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading suggestions…</p>
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
            <h1 className="font-semibold text-2xl text-foreground">Product Suggestions</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Master product catalog for seller listings</p>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
            <Button variant="outline" onClick={() => fileRef.current?.click()} loading={importCsv.isPending} leftIcon={<Upload className="h-4 w-4" />}>Import CSV</Button>
            <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>Add Suggestion</Button>
          </div>
        </div>

        <div className="max-w-sm">
          <Input placeholder="Search suggestions…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} leftIcon={<Search className="h-4 w-4" />} />
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  {["Name", "Manufacturer", "Composition", "MRP", "Category", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {suggestions.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">No suggestions found</td></tr>
                ) : suggestions.map((s: any, i: number) => (
                  <motion.tr key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-semibold text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{s.manufacturer ?? "—"}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground max-w-[200px] truncate">{s.composition ?? s.chemicalComposition ?? "—"}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-foreground">{s.mrp ? `₹${s.mrp}` : "—"}</td>
                    <td className="px-5 py-4"><Badge>{s.category ?? "—"}</Badge></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Suggestion" : "Add Suggestion"}>
        <div className="space-y-4">
          <Input label="Product Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Manufacturer" value={form.manufacturer} onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value }))} />
          <Input label="Composition" value={form.composition} onChange={e => setForm(f => ({ ...f, composition: e.target.value }))} />
          <Input label="MRP (₹)" type="number" value={form.mrp} onChange={e => setForm(f => ({ ...f, mrp: e.target.value }))} />
          <Input label="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={createSuggestion.isPending || updateSuggestion.isPending}>
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
