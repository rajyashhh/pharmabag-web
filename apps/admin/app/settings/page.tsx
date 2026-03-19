"use client";
import { motion } from "framer-motion";
import { Shield, Bell, Globe, Database, Key } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button, Input } from "@/components/ui";
import toast from "react-hot-toast";

const SECTIONS = [
  { id: "platform", icon: Globe, title: "Platform Settings", fields: [{ label: "Platform Name", val: "PharmaBag" }, { label: "Support Email", val: "support@pharmabag.in" }, { label: "Support Phone", val: "+91 1800-XXX-XXXX" }] },
  { id: "security", icon: Shield, title: "Security", fields: [{ label: "Session Timeout (mins)", val: "60" }, { label: "Max Login Attempts", val: "5" }, { label: "OTP Expiry (secs)", val: "120" }] },
  { id: "notifications", icon: Bell, title: "Notifications", fields: [{ label: "Fraud Alert Email", val: "fraud@pharmabag.in" }, { label: "Admin Alert Email", val: "admin@pharmabag.in" }] },
];

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">Platform Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure global platform parameters</p>
        </div>

        {SECTIONS.map(({ id, icon: Icon, title, fields }, si) => (
          <motion.div key={id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }} className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="h-4.5 w-4.5 text-primary" aria-hidden /></div>
              <h2 className="font-semibold text-foreground">{title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(({ label, val }) => (
                <Input key={label} label={label} defaultValue={val} />
              ))}
            </div>
          </motion.div>
        ))}

        {/* Feature flags */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center"><Key className="h-4.5 w-4.5 text-purple-600" /></div>
            <h2 className="font-semibold text-foreground">Feature Flags</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "New Seller Registrations", desc: "Allow new sellers to register", enabled: true },
              { label: "Express Login", desc: "OTP-based login without signup", enabled: true },
              { label: "Credit Line Orders", desc: "30-day credit for verified buyers", enabled: true },
              { label: "Maintenance Mode", desc: "Take platform offline for maintenance", enabled: false },
            ].map(({ label, desc, enabled }) => (
              <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-accent/40">
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <div className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${enabled ? "bg-primary" : "bg-muted"}`} role="switch" aria-checked={enabled} aria-label={label} tabIndex={0}>
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => toast.success("Settings saved!")}>Save Changes</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
