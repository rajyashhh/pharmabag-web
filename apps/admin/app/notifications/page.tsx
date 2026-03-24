"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Send, AlertCircle, Clock, Users } from "lucide-react";
import { useBroadcastNotification, useNotificationHistory } from "@/hooks/useAdmin";
import { toast } from "react-hot-toast";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Tabs, Badge, Pagination } from "@/components/ui";

export default function NotificationsPage() {
  const [target, setTarget] = useState<"ALL" | "BUYER" | "SELLER">("ALL");
  const [message, setMessage] = useState("");
  
  const { mutate: broadcast, isPending } = useBroadcastNotification();

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    broadcast(
      { target, message: message.trim() },
      {
        onSuccess: (data) => {
          toast.success(`Notification sent to ${data?.deliveredCount || 'all target'} users!`);
          setMessage(""); // reset form
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to send notification");
        }
      }
    );
  };

  const [tab, setTab] = useState("broadcast");
  const [historyPage, setHistoryPage] = useState(1);
  const { data: historyData } = useNotificationHistory({ page: historyPage, limit: 20 });
  const notifications: any[] = Array.isArray(historyData) ? historyData : (historyData?.data ?? []);
  const historyTotal = historyData?.total ?? notifications.length;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3"
          >
            <Bell className="w-8 h-8 text-primary" />
            Notifications
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Send and manage notifications for your platform users.
          </motion.p>
        </div>

        <Tabs tabs={[
          { value: "broadcast", label: "Broadcast" },
          { value: "history", label: "History", count: historyTotal || undefined },
        ]} active={tab} onChange={setTab} />

        {tab === "history" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden">
            <div className="divide-y divide-border/30">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No notification history</div>
              ) : notifications.map((n: any, i: number) => (
                <div key={n.id || i} className="p-5 hover:bg-accent/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{n.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant={n.target === "ALL" ? "info" : n.target === "BUYER" ? "success" : "purple"}>
                          <Users className="h-3 w-3 mr-1" />
                          {n.target ?? "All"}
                        </Badge>
                        {n.deliveredCount != null && (
                          <span className="text-xs text-muted-foreground">{n.deliveredCount} delivered</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {historyTotal > 20 && (
              <div className="p-4 border-t border-border/50">
                <Pagination page={historyPage} totalPages={Math.ceil(historyTotal / 20)} onPageChange={setHistoryPage} />
              </div>
            )}
          </motion.div>
        )}

        {tab === "broadcast" && <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl border border-white/20 p-6 md:p-8 shadow-sm space-y-8"
        >
          {/* Target Audience Options */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-foreground">Target Audience</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "ALL", label: "Everyone", desc: "All Buyers & Sellers" },
                { id: "BUYER", label: "Buyers Only", desc: "Retailers & Pharmacies" },
                { id: "SELLER", label: "Sellers Only", desc: "Distributors & Wholesalers" }
              ].map((option) => (
                <label 
                  key={option.id}
                  className={`
                    relative flex flex-col p-4 cursor-pointer rounded-2xl border-2 transition-all duration-200
                    ${target === option.id 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-white/10 glass-hover hover:border-primary/50"
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${target === option.id ? "text-primary" : "text-foreground"}`}>
                      {option.label}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                      ${target === option.id ? "border-primary bg-primary" : "border-muted-foreground"}
                    `}>
                      {target === option.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{option.desc}</span>
                  <input 
                    type="radio" 
                    name="target" 
                    value={option.id} 
                    checked={target === option.id} 
                    onChange={() => setTarget(option.id as any)} 
                    className="hidden" 
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Notification Message</label>
              <span className={`text-xs ${message.length > 200 ? "text-amber-500" : "text-muted-foreground"}`}>
                {message.length} / 250
              </span>
            </div>
            <div className="relative group">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 250))}
                placeholder="e.g. System maintenance scheduled for tonight at 2 AM IST. Expect 15 minutes of downtime."
                className="w-full h-32 px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none shadow-inner"
              />
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                This message will be instantly delivered to the selected users' in-app notification center. 
                Email delivery will also be triggered for users with verified email addresses.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={handleSend}
              disabled={isPending || !message.trim()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all
                ${isPending || !message.trim() 
                  ? "bg-primary/50 cursor-not-allowed" 
                  : "bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                }
              `}
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {isPending ? "Broadcasting..." : "Broadcast Message"}
            </button>
          </div>
        </motion.div>}
      </div>
    </AdminLayout>
  );
}
