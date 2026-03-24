"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSellerAuth } from "@/store";
import { useSellerMe } from "@/hooks/useSeller";
import { Loader2, ShieldAlert, Store } from "lucide-react";
import { SellerSidebar } from "./sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider, useSidebar } from "@/context/sidebar-context";

function getVerificationStatus(user: any): string {
  if (!user) return "UNVERIFIED";
  return user.sellerProfile?.verificationStatus || "UNVERIFIED";
}

export function SellerGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuth, setUser } = useSellerAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Fetch the LATEST profile from the server whenever the user is authenticated.
  // This is essential because the cached Zustand user in localStorage may have a
  // stale verificationStatus (e.g. still "UNVERIFIED" after admin approved).
  const { data: serverUser, isLoading: isLoadingProfile } = useSellerMe(mounted && isAuth);

  // Sync server data into local store when it arrives and differs
  useEffect(() => {
    if (serverUser) {
      setUser(serverUser || null);
    }
  }, [serverUser, setUser]);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuth && pathname !== "/auth") {
      router.replace("/auth");
    }
  }, [isAuth, pathname, mounted, router]);

  // SSR / hydration guard
  if (!mounted) return null;

  // Auth page — render directly without layout
  if (pathname === "/auth") {
    return <>{children}</>;
  }

  // Not authenticated — show loading while redirect effect fires
  if (!user || !isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // CRITICAL: Wait for the server profile to load before making any
  // verification-based routing decisions. Without this, the component
  // uses the stale cached status and redirects prematurely.
  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const verificationStatus = getVerificationStatus(user);

  // Onboarding page — render directly without dashboard layout
  if (pathname === "/onboarding") {
    if (verificationStatus !== "UNVERIFIED") {
      router.replace("/dashboard");
      return null;
    }
    return <>{children}</>;
  }

  // UNVERIFIED sellers must complete onboarding first — redirect to /onboarding
  if (verificationStatus === "UNVERIFIED") {
    router.replace("/onboarding");
    return null;
  }

  // PENDING — show review message
  if (verificationStatus === "PENDING") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass-card rounded-2xl p-8 text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-full flex items-center justify-center mb-6">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Application Under Review</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your seller profile is currently being reviewed. We will notify you once your account is verified.
          </p>
          <div className="pt-4">
            <button onClick={() => useSellerAuth.getState().logout()} className="text-sm font-medium text-primary hover:underline">
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // REJECTED — show rejected message
  if (verificationStatus === "REJECTED") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass-card rounded-2xl p-8 text-center space-y-4 border-red-200 dark:border-red-900/30">
          <div className="mx-auto h-16 w-16 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Application Rejected</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We could not verify your business details. Please contact support to resolve this.
          </p>
          <div className="pt-4">
            <button onClick={() => useSellerAuth.getState().logout()} className="text-sm font-medium text-red-600 hover:underline">
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // APPROVED — full dashboard layout with sidebar
  return (
    <SidebarProvider>
      <DashboardLayout pathname={pathname}>{children}</DashboardLayout>
    </SidebarProvider>
  );
}

function DashboardLayout({ children, pathname }: { children: React.ReactNode; pathname: string }) {
  const { open } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SellerSidebar />
      <main className={`flex-1 overflow-y-auto no-sb relative transition-all duration-300 ${open ? 'ml-64' : 'ml-20'}`}>
        <div className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
