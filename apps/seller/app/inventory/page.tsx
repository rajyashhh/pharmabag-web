"use client";
import { SellerSidebar } from "@/components/layout/sidebar";
import { InventoryContent } from "@/components/seller-pages";
export default function InventoryPage() {
  return <div className="min-h-screen bg-background"><SellerSidebar/><main className="lg:pl-64 p-6"><div className="max-w-7xl mx-auto"><InventoryContent/></div></main></div>;
}
