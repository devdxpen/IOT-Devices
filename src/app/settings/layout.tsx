"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  LayoutTemplate,
  Users,
  LayoutGrid,
  MapPin,
  Bell,
  FileBarChart,
  ShieldCheck,
  Building2,
  UserCog,
} from "lucide-react";

interface SettingsNavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const settingsNavItems: SettingsNavItem[] = [
  { icon: LayoutTemplate, label: "Templates", href: "/settings/templates" },
  { icon: Users, label: "Devices Groups", href: "/settings/devices-groups" },
  {
    icon: LayoutGrid,
    label: "Device Categories",
    href: "/settings/device-categories",
  },
  {
    icon: MapPin,
    label: "Cluster Management",
    href: "/settings/cluster-management",
  },
  { icon: Bell, label: "Notification", href: "/settings/notification" },
  {
    icon: FileBarChart,
    label: "Reports layout",
    href: "/settings/reports-layout",
  },
  { icon: ShieldCheck, label: "Roles", href: "/settings/roles" },
  { icon: Building2, label: "Company Users", href: "/settings/company-users" },
  { icon: UserCog, label: "Account", href: "/settings/account" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full gap-0 -mx-6 -mt-6 -mb-6">
      {/* Settings Sidebar */}
      <aside className="w-[260px] shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <ScrollArea className="flex-1">
          <nav className="py-4 px-3 space-y-1">
            {settingsNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-[#2596be] border-l-[3px] border-[#2596be]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-[3px] border-transparent",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 shrink-0",
                      isActive ? "text-[#2596be]" : "text-slate-400",
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
