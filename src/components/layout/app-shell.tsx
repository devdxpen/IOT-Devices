"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

const AUTH_ROUTES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/verify-otp",
]);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (AUTH_ROUTES.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="relative grid h-screen grid-cols-[auto_1fr] overflow-hidden">
      <Sidebar />
      <div className="flex h-screen w-full flex-col">
        <Header />
        <main className="flex h-[calc(100vh-64px)] flex-col overflow-auto px-6 pt-6 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
