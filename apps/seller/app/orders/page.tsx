// apps/seller/app/orders/page.tsx
"use client";
import { SellerSidebar } from "@/components/layout/sidebar";
import { OrdersContent } from "@/components/seller-pages";
export default function OrdersPage() {
  return <div className="min-h-screen bg-background"><SellerSidebar/><main className="lg:pl-64 p-6"><div className="max-w-7xl mx-auto"><OrdersContent/></div></main></div>;
}
