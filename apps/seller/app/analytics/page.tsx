"use client";
import { SellerSidebar } from "@/components/layout/sidebar";
import { AnalyticsContent } from "@/components/seller-pages";
export default function AnalyticsPage() {
  return <div className="min-h-screen bg-background"><SellerSidebar/><main className="lg:pl-64 p-6"><div className="max-w-7xl mx-auto"><AnalyticsContent/></div></main></div>;
}
