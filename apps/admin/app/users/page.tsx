"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserCheck, UserX, Eye } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button, Input, Badge } from "@/components/ui";
import { USERS } from "@pharmabag/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAdminUsers, useAffirmUserStatus } from "@/hooks/useAdmin";

type RoleFilter = "all" | "buyer" | "seller" | "admin";
type StatusFilter = "all" | "verified" | "unverified";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const { data: usersData, isLoading } = useAdminUsers();
  const updateStatus = useAffirmUserStatus();
  const users = usersData ?? USERS;

  const filtered = users.filter(u =>
    (role === "all" || u.role.toLowerCase() === role) &&
    (status === "all" || (status === "verified" ? u.isVerified : !u.isVerified)) &&
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || (u.email ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  const handleVerify = async (id: string, name: string) => {
    try {
      await updateStatus.mutateAsync({ userId: id, action: "approve" });
      toast.success(`${name} verified successfully`);
    } catch {
      toast.error(`Unable to verify ${name}`);
    }
  };
  const handleReject = async (id: string, name: string) => {
    try {
      await updateStatus.mutateAsync({ userId: id, action: "reject" });
      toast.error(`${name} verification rejected`);
    } catch {
      toast.error(`Unable to reject ${name}`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-2xl text-foreground">User Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{USERS.length} total users · {USERS.filter(u => !u.isVerified).length} pending verification</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input placeholder="Search users by name or email…" value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
          </div>
          <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filter by role">
            {(["all", "buyer", "seller", "admin"] as RoleFilter[]).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={cn("px-3 py-2 rounded-xl text-xs font-medium border transition-all capitalize", role === r ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:bg-accent/60")}>{r}</button>
            ))}
          </div>
          <div className="flex gap-1.5" role="group" aria-label="Filter by status">
            {(["all", "verified", "unverified"] as StatusFilter[]).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={cn("px-3 py-2 rounded-xl text-xs font-medium border transition-all capitalize", status === s ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:bg-accent/60")}>{s}</button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Users">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  {["User", "Role", "Business/Store", "Phone", "Verification", "Status", "Actions"].map(h => (
                    <th key={h} scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No users found</td></tr>
                ) : filtered.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm flex-shrink-0" aria-hidden>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={u.role === "buyer" ? "success" : u.role === "seller" ? "info" : "orange"} className="capitalize">{u.role}</Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{u.businessName ?? u.storeName ?? "—"}</td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{u.phone}</td>
                    <td className="px-5 py-4">
                      <Badge variant={u.isVerified ? "success" : "warning"}>{u.isVerified ? "Verified" : "Pending"}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={u.isActive ? "success" : "error"}>{u.isActive ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button aria-label={`View ${u.name}`} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {!u.isVerified && (
                          <>
                            <button onClick={() => void handleVerify(u.id, u.name)} aria-label={`Verify ${u.name}`}
                              className="h-7 w-7 rounded-lg flex items-center justify-center text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                              <UserCheck className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => void handleReject(u.id, u.name)} aria-label={`Reject ${u.name}`}
                              className="h-7 w-7 rounded-lg flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              <UserX className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
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
