"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useDemoSession } from "@/hooks/use-demo-session";

const AUTH_ROUTES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/verify-otp",
]);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useDemoSession();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (AUTH_ROUTES.has(pathname)) {
      if (session) {
        router.replace(session.redirectPath);
      }
      return;
    }

    if (!session) {
      router.replace("/login");
      return;
    }

    if (session.role === "admin" && !pathname.startsWith("/admin")) {
      router.replace("/admin/home");
      return;
    }

    if (session.role !== "admin" && pathname.startsWith("/admin")) {
      router.replace("/dashboard");
      return;
    }

    if (session.role !== "admin" && pathname === "/") {
      router.replace("/dashboard");
    }
  }, [isHydrated, pathname, router, session]);

  if (!isHydrated) {
    return null;
  }

  if (AUTH_ROUTES.has(pathname)) {
    if (session) {
      return null;
    }
    return <>{children}</>;
  }

  if (!session) {
    return null;
  }

  if (session.role === "admin" && !pathname.startsWith("/admin")) {
    return null;
  }

  if (session.role !== "admin" && pathname.startsWith("/admin")) {
    return null;
  }

  if (session.role !== "admin" && pathname === "/") {
    return null;
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-50/50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
