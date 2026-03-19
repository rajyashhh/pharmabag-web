"use client";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/layout/admin-layout";
import { StatCard } from "@/components/ui";
import { ADMIN_STATS, CHART_DATA, formatCurrency, formatCompact } from "@pharmabag/utils";
import { TrendingUp, Users, ShoppingBag, Package } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, ComposedChart } from "recharts";

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">Platform Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Comprehensive performance metrics</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="GMV (All Time)" value={`₹${formatCompact(ADMIN_STATS.platformRevenue)}`} change="+22% YoY" up icon={TrendingUp} iconClass="bg-green-50 text-green-600 dark:bg-green-900/20" delay={0} />
          <StatCard title="Total Users" value={formatCompact(ADMIN_STATS.totalUsers)} change="+1,240 this month" up icon={Users} iconClass="bg-blue-50 text-blue-600 dark:bg-blue-900/20" delay={0.07} />
          <StatCard title="Total Orders" value={formatCompact(ADMIN_STATS.totalOrders)} change="+18% this month" up icon={ShoppingBag} iconClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20" delay={0.14} />
          <StatCard title="Catalogue Size" value={formatCompact(ADMIN_STATS.totalProducts)} change="+280 this week" up icon={Package} iconClass="bg-orange-50 text-orange-600 dark:bg-orange-900/20" delay={0.21} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-1">Revenue + Orders</h2>
            <p className="text-xs text-muted-foreground mb-4">Combined monthly performance</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `${(v / 1e7).toFixed(0)}Cr`} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
                  <Bar yAxisId="right" dataKey="orders" fill="hsl(239,84%,67%)" radius={[4, 4, 0, 0]} opacity={0.7} />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(38,92%,50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(38,92%,50%)" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-1">User Growth</h2>
            <p className="text-xs text-muted-foreground mb-4">New buyers vs new sellers per month</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
                  <Bar dataKey="buyers" fill="hsl(142,71%,45%)" radius={[4, 4, 0, 0]} name="Buyers" />
                  <Bar dataKey="sellers" fill="hsl(239,84%,67%)" radius={[4, 4, 0, 0]} name="Sellers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* KPI summary table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h2 className="font-semibold text-foreground">Monthly KPI Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Monthly KPI">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  {["Month", "New Buyers", "New Sellers", "Orders", "Revenue", "Avg Order Value"].map(h => (
                    <th key={h} scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {CHART_DATA.map((row, i) => (
                  <motion.tr key={row.month} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-4 font-semibold text-sm text-foreground">{row.month}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{row.buyers.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{row.sellers}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{row.orders.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-foreground">{formatCurrency(row.revenue)}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{formatCurrency(Math.round(row.revenue / row.orders))}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
