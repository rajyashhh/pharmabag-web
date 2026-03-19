"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Package, ShoppingBag, TrendingUp, AlertTriangle, CheckCircle, Clock, Flag, Bell, Search } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { StatCard, Badge, StatusBadge, Button } from "@/components/ui";
import { ADMIN_STATS, USERS, ORDERS, PRODUCTS, CHART_DATA, formatCurrency, formatDate, formatCompact } from "@pharmabag/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useAdminDashboard } from "@/hooks/useAdmin";

const COLORS = ["hsl(142,71%,45%)", "hsl(239,84%,67%)", "hsl(38,92%,50%)", "hsl(0,84%,60%)"];

export default function AdminDashboardPage() {
  const { data: dashboardData, isLoading } = useAdminDashboard();
  const stats = dashboardData?.stats ?? ADMIN_STATS;
  const pendingUsers = dashboardData?.users?.filter((u) => !u.isVerified) ?? USERS.filter((u) => !u.isVerified);
  const pendingProducts = dashboardData?.products?.filter((p) => p.approvalStatus === "pending") ?? PRODUCTS.filter((p) => p.approvalStatus === "pending");
  const flaggedProducts = dashboardData?.products?.filter((p) => p.approvalStatus === "rejected") ?? PRODUCTS.filter((p) => p.approvalStatus === "rejected");

  if (isLoading) {
    return <div className="min-h-screen p-6">Loading dashboard...</div>;
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitor the entire PharmaBag ecosystem</p>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Search" className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent/60 transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <button aria-label="Notifications" className="relative h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent/60 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center" aria-hidden>
              {ADMIN_STATS.pendingApprovals}
            </span>
          </button>
        </div>
      </div>

      {/* Critical alerts */}
      {(ADMIN_STATS.pendingApprovals > 0 || ADMIN_STATS.flaggedProducts > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {ADMIN_STATS.pendingApprovals > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">{ADMIN_STATS.pendingApprovals} Pending Approvals</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-500">Sellers awaiting verification</p>
                </div>
              </div>
              <Link href="/users"><Button size="xs" variant="warning">Review</Button></Link>
            </motion.div>
          )}
          {ADMIN_STATS.flaggedProducts > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <Flag className="h-5 w-5 text-red-500 flex-shrink-0" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">{ADMIN_STATS.flaggedProducts} Flagged Products</p>
                  <p className="text-xs text-red-500">Potential duplicates detected</p>
                </div>
              </div>
              <Link href="/products"><Button size="xs" variant="danger">Investigate</Button></Link>
            </motion.div>
          )}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value={formatCompact(ADMIN_STATS.totalUsers)} change={`${formatCompact(ADMIN_STATS.activeBuyers)} buyers`} up icon={Users} iconClass="bg-blue-50 text-blue-600 dark:bg-blue-900/20" delay={0} />
        <StatCard title="Active Sellers" value={String(ADMIN_STATS.activeSellers)} change={`${ADMIN_STATS.pendingApprovals} pending`} icon={CheckCircle} iconClass="bg-green-50 text-green-600 dark:bg-green-900/20" delay={0.07} />
        <StatCard title="Total Orders" value={formatCompact(ADMIN_STATS.totalOrders)} change="+18% this month" up icon={ShoppingBag} iconClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20" delay={0.14} />
        <StatCard title="Platform Revenue" value={`₹${formatCompact(ADMIN_STATS.platformRevenue)}`} change="+22% vs last month" up icon={TrendingUp} iconClass="bg-orange-50 text-orange-600 dark:bg-orange-900/20" delay={0.21} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Products" value={formatCompact(ADMIN_STATS.totalProducts)} change={`${ADMIN_STATS.pendingProducts} pending review`} icon={Package} iconClass="bg-teal-50 text-teal-600 dark:bg-teal-900/20" delay={0.28} />
        <StatCard title="Pending Products" value={String(ADMIN_STATS.pendingProducts)} change="Need review" icon={Clock} iconClass="bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20" alert delay={0.35} />
        <StatCard title="Flagged Products" value={String(ADMIN_STATS.flaggedProducts)} change="Potential fraud" icon={AlertTriangle} iconClass="bg-red-50 text-red-500 dark:bg-red-900/20" alert delay={0.42} />
        <StatCard title="Complaints" value={String(ADMIN_STATS.unresolvedComplaints)} change="Unresolved" icon={Flag} iconClass="bg-pink-50 text-pink-600 dark:bg-pink-900/20" alert delay={0.49} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Platform revenue chart */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-1">Platform Revenue</h2>
            <p className="text-xs text-muted-foreground mb-5">Monthly gross merchandise value</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(38,92%,50%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(38,92%,50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `₹${(v / 1e7).toFixed(0)}Cr`} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} formatter={(v: number) => [formatCurrency(v), "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(38,92%,50%)" strokeWidth={2} fill="url(#ag)" dot={{ r: 3, fill: "hsl(38,92%,50%)" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* User distribution pie */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-1">User Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">By role type</p>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: "Buyers", value: ADMIN_STATS.activeBuyers },
                  { name: "Sellers", value: ADMIN_STATS.activeSellers },
                  { name: "Pending", value: ADMIN_STATS.pendingApprovals },
                ]} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {[0, 1, 2].map(i => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {[{ label: "Buyers", val: ADMIN_STATS.activeBuyers, color: COLORS[0] }, { label: "Sellers", val: ADMIN_STATS.activeSellers, color: COLORS[1] }, { label: "Pending", val: ADMIN_STATS.pendingApprovals, color: COLORS[2] }].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary" /><span className="text-muted-foreground">{label}</span></div>
                <span className="font-semibold text-foreground">{formatCompact(val)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* User growth + order growth charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-1">New Buyer Registrations</h2>
          <p className="text-xs text-muted-foreground mb-4">Monthly signups</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
                <Bar dataKey="buyers" fill="hsl(239,84%,67%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-1">Platform Orders</h2>
          <p className="text-xs text-muted-foreground mb-4">Monthly order volume</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="orders" stroke="hsl(142,71%,45%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(142,71%,45%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent orders table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div><h2 className="font-semibold text-foreground">Recent Platform Orders</h2><p className="text-xs text-muted-foreground mt-0.5">All orders across buyers and sellers</p></div>
          <Link href="/orders"><Button variant="ghost" size="sm">View all</Button></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Platform orders">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                {["Order #", "Buyer", "Seller", "Amount", "Payment", "Status"].map(h => (
                  <th key={h} scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {ORDERS.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-4"><span className="font-mono text-xs font-medium text-foreground">{o.orderNumber}</span></td>
                  <td className="px-5 py-4"><div className="text-sm font-medium text-foreground">{o.buyerName}</div><div className="text-xs text-muted-foreground">{o.buyerBusiness}</div></td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{o.sellerName}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-foreground">{formatCurrency(o.finalAmount ?? o.total ?? 0)}</td>
                  <td className="px-5 py-4"><Badge variant={o.paymentStatus === "paid" ? "success" : o.paymentStatus === "pending" ? "warning" : "error"}>{o.paymentStatus}</Badge></td>
                  <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
