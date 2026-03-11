"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tablet, Users, Map, User } from "lucide-react";

const dashboardNavItems = [
  {
    icon: Tablet,
    label: "Devices",
    href: "/dashboard/devices",
  },
  {
    icon: Users,
    label: "Groups",
    href: "/dashboard/groups",
  },
  {
    icon: Map,
    label: "Map view",
    href: "/dashboard/map",
  },
  {
    icon: User,
    label: "IOT Users",
    href: "/dashboard/users",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (pathname === "/dashboard" && href === "/dashboard/devices") return true;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-[calc(100vh-64px)] shrink-0 overflow-y-auto shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] z-10">
      <nav className="flex flex-col gap-1 p-4 mt-2">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 relative group
                ${active ? "bg-blue-50/50" : "hover:bg-neutral-50"}
              `}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-md" />
              )}

              <Icon
                className={`w-[22px] h-[22px] transition-colors
                  ${active ? "text-blue-500" : "text-neutral-500 group-hover:text-neutral-700"}
                `}
              />
              <span
                className={`text-base font-medium transition-colors
                  ${active ? "text-blue-500" : "text-neutral-600 group-hover:text-neutral-900"}
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
