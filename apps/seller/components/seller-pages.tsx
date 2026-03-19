// ─── Orders Page ─────────────────────────────────────────────────────────────
"use client";
import { motion } from "framer-motion";
import { ORDERS, INVENTORY, PAYOUTS, CHART_DATA, formatCurrency, formatDate } from "@pharmabag/utils";
import { OrderStatusBadge, Button, Badge, StatCard } from "@/components/ui";
import { SellerSidebar } from "@/components/layout/sidebar";
import { Package, Warehouse, CreditCard, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { useSellerOrders, useUpdateSellerOrderStatus } from "@/hooks/useSeller";

export function OrdersContent() {
  const { data: ordersData, isLoading } = useSellerOrders();
  const updateOrderStatus = useUpdateSellerOrderStatus();
  const orders = ordersData ?? ORDERS.filter((o) => o.sellerId === "s1");

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div><h1 className="font-semibold text-2xl text-foreground">Orders</h1><p className="text-sm text-muted-foreground mt-0.5">Manage orders from your store</p></div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Seller orders">
            <thead><tr className="border-b border-border/50 bg-muted/20">{["Order #","Buyer","Items","Amount","Payment","Status","Action"].map(h=><th key={h} scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border/30">
              {orders.map((o,i)=>(
                <motion.tr key={o.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}} className="hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-4"><span className="font-mono text-xs font-medium">{o.orderNumber}</span></td>
                  <td className="px-5 py-4"><div className="text-sm font-medium text-foreground">{o.buyerName}</div><div className="text-xs text-muted-foreground">{o.buyerBusiness}</div></td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{o.items?.length ?? 0} items</td>
                  <td className="px-5 py-4 text-sm font-semibold text-foreground">{formatCurrency(o.finalAmount ?? o.total ?? 0)}</td>
                  <td className="px-5 py-4"><Badge variant={o.paymentStatus==="paid"?"success":o.paymentStatus==="pending"?"warning":"error"}>{o.paymentStatus}</Badge></td>
                  <td className="px-5 py-4"><OrderStatusBadge status={o.status}/></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="text-xs h-7">View</Button>
                      {o.status === "pending" && (
                        <Button size="sm" className="text-xs h-7" onClick={() => updateOrderStatus.mutate({ orderId: o.id, status: "confirmed" })}>Confirm</Button>
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
  );
}

export function InventoryContent() {
  return (
    <div className="space-y-6">
      <div><h1 className="font-semibold text-2xl text-foreground">Inventory</h1><p className="text-sm text-muted-foreground mt-0.5">Track and manage your stock levels</p></div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Inventory">
            <thead><tr className="border-b border-border/50 bg-muted/20">{["Product","SKU","Current Stock","Min Stock","Unit Cost","Last Restocked","Status"].map(h=><th key={h} scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border/30">
              {INVENTORY.map((item,i)=>(
                <motion.tr key={item.productId} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}} className="hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-foreground">{item.productName}</td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{item.sku}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${item.currentStock===0?"text-red-500":item.currentStock<item.minStock?"text-yellow-600":"text-green-600"}`}>{item.currentStock}</span>
                      {item.currentStock===0&&<AlertTriangle className="h-3.5 w-3.5 text-red-500" aria-label="Out of stock"/>}
                      {item.currentStock<item.minStock&&item.currentStock>0&&<AlertTriangle className="h-3.5 w-3.5 text-yellow-500" aria-label="Low stock"/>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{item.minStock}</td>
                  <td className="px-5 py-4 text-sm font-medium text-foreground">{formatCurrency(item.unitCost)}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{formatDate(item.lastRestocked)}</td>
                  <td className="px-5 py-4">
                    <Badge variant={item.status==="in_stock"?"success":item.status==="low_stock"?"warning":"error"}>
                      {item.status.replace(/_/g," ")}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsContent() {
  return (
    <div className="space-y-6">
      <div><h1 className="font-semibold text-2xl text-foreground">Analytics</h1><p className="text-sm text-muted-foreground mt-0.5">Track your store performance</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4">Monthly Revenue</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{top:0,right:0,left:-20,bottom:0}}>
                <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false}/>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fontSize:11,fill:"hsl(var(--muted-foreground))"}}/>
                <YAxis tickLine={false} axisLine={false} tick={{fontSize:11,fill:"hsl(var(--muted-foreground))"}} tickFormatter={v=>`${(v/100000).toFixed(0)}L`}/>
                <Tooltip contentStyle={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",borderRadius:"12px",fontSize:"12px"}} formatter={(v:number)=>[formatCurrency(v),"Revenue"]}/>
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#sg)" dot={{r:3,fill:"hsl(var(--primary))"}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4">Orders per Month</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{top:0,right:0,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false}/>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fontSize:11,fill:"hsl(var(--muted-foreground))"}}/>
                <YAxis tickLine={false} axisLine={false} tick={{fontSize:11,fill:"hsl(var(--muted-foreground))"}}/>
                <Tooltip contentStyle={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",borderRadius:"12px",fontSize:"12px"}}/>
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PayoutsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-semibold text-2xl text-foreground">Payouts</h1><p className="text-sm text-muted-foreground mt-0.5">Track your earnings and payouts</p></div>
        <Button leftIcon={<CreditCard className="h-4 w-4"/>}>Request Payout</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Available Balance" value={formatCurrency(302500)} change="Ready to withdraw" up icon={CreditCard} iconClass="bg-green-50 text-green-600 dark:bg-green-900/20" delay={0}/>
        <StatCard title="Total Paid Out" value={formatCurrency(142000)} change="Last: 2 Jul 2024" up icon={CheckCircle} iconClass="bg-blue-50 text-blue-600 dark:bg-blue-900/20" delay={0.07}/>
        <StatCard title="Pending" value={formatCurrency(87500)} change="Processing" icon={Clock} iconClass="bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20" delay={0.14}/>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border/50"><h2 className="font-semibold text-foreground">Payout History</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Payout history">
            <thead><tr className="border-b border-border/50">{["Date","Amount","Bank Account","UTR","Status"].map(h=><th key={h} scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border/30">
              {PAYOUTS.map((p,i)=>(
                <motion.tr key={p.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}} className="hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-4 text-sm text-muted-foreground">{formatDate(p.initiatedAt ?? p.createdAt)}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-foreground">{formatCurrency(p.amount)}</td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{p.bankAccount}</td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{p.utr??"-"}</td>
                  <td className="px-5 py-4"><Badge variant={p.status==="completed"?"success":p.status==="processing"?"info":p.status==="pending"?"warning":"error"}>{p.status}</Badge></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
