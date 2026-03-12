"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { analyticsAppConfig } from "@/config/appConfig";
import { cn } from "@/lib/utils";

export function AnalyticsSectionTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full flex-wrap gap-2 rounded-xl border border-border/70 bg-card p-2 shadow-xs">
      {analyticsAppConfig.sectionLinks.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
