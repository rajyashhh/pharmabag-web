import { SellerSidebar } from "@/components/layout/sidebar";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SellerSidebar />
      <main className="lg:pl-64 transition-all duration-300 min-h-screen p-6" id="main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
