"use client";

import {
  BellRing,
  BookOpen,
  Building2,
  LayoutTemplate,
  MonitorSmartphone,
  ShieldAlert,
  Ticket,
  TicketPercent,
  TrendingUp,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IoBookOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCodeSlashOutline,
  IoGridOutline,
  IoHelpCircleOutline,
  IoHomeOutline,
  IoLayersOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoStatsChartOutline,
  IoTabletPortraitOutline,
} from "react-icons/io5";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type NavItem, navItems } from "@/config/navigation";
import { useDemoSession } from "@/hooks/use-demo-session";
import { cn } from "@/lib/utils";

const adminPrimaryNavItems = [
  { key: "home", icon: IoHomeOutline, label: "Home", href: "/admin/home" },
  {
    key: "dashboard",
    icon: IoGridOutline,
    label: "Dashboard",
    href: "/admin/dashboard/device-analytics",
  },
  {
    key: "monitoring",
    icon: IoNotificationsOutline,
    label: "Monitoring",
    href: "/admin/monitoring",
  },
  {
    key: "system",
    icon: IoTabletPortraitOutline,
    label: "System",
    href: "/admin/system",
  },
  {
    key: "template",
    icon: IoLayersOutline,
    label: "Template",
    href: "/admin/template",
  },
  {
    key: "help",
    icon: IoHelpCircleOutline,
    label: "Help",
    href: "/admin/help",
  },
  {
    key: "configuration",
    icon: IoCodeSlashOutline,
    label: "Configuration",
    href: "/admin/configuration",
  },
  {
    key: "subscription",
    icon: IoBookOutline,
    label: "Subscription",
    href: "/admin/subscription",
  },
  {
    key: "financial",
    icon: IoStatsChartOutline,
    label: "Financial",
    href: "/admin/financial",
  },
  {
    key: "settings",
    icon: IoSettingsOutline,
    label: "Settings",
    href: "/admin/settings",
  },
  {
    key: "reports",
    icon: IoPeopleOutline,
    label: "Reports",
    href: "/admin/reports",
  },
] as const;

const adminDashboardNavItems = [
  {
    icon: MonitorSmartphone,
    label: "Device Analytics",
    href: "/admin/dashboard/device-analytics",
  },
  {
    icon: Users2,
    label: "User Analytics",
    href: "/admin/dashboard/user-analytics",
  },
  {
    icon: Building2,
    label: "Company Analytics",
    href: "/admin/dashboard/company-analytics",
  },
  {
    icon: LayoutTemplate,
    label: "Template Analytics",
    href: "/admin/dashboard/template-analytics",
  },
  {
    icon: Ticket,
    label: "Support Ticket Analytics",
    href: "/admin/dashboard/support-ticket-analytics",
  },
  {
    icon: BookOpen,
    label: "Knowledge Base Analytics",
    href: "/admin/dashboard/knowledge-base-analytics",
  },
  {
    icon: BellRing,
    label: "Notification Usage Analytics",
    href: "/admin/dashboard/notification-usage-analytics",
  },
  {
    icon: TrendingUp,
    label: "Financial Analytics",
    href: "/admin/dashboard/financial-analytics",
  },
  {
    icon: ShieldAlert,
    label: "Alarms & Alerts",
    href: "/admin/dashboard/alarms-alerts",
  },
  { icon: TicketPercent, label: "Coupons", href: "/admin/dashboard/coupons" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const session = useDemoSession();
  const isAdmin = session?.role === "admin";

  if (isAdmin) {
    return <AdminSidebar pathname={pathname} />;
  }

  return <CustomerSidebar pathname={pathname} />;
}

function AdminSidebar({ pathname }: { pathname: string }) {
  const normalizedPath = pathname === "/admin" ? "/admin/home" : pathname;
  const primarySegment = normalizedPath.split("/")[2] ?? "dashboard";
  const activePrimaryKey =
    adminPrimaryNavItems.find((item) => item.key === primarySegment)?.key ??
    "home";
  const showDashboardPanel = activePrimaryKey === "dashboard";

  return (
    <div className="sticky top-0 z-40 flex h-screen shrink-0">
      <aside className="h-screen w-[92px] border-r border-[#0f497d] bg-[#032f58] text-white shadow-xl">
        <div className="flex h-16 items-center justify-center border-b border-[#0f497d]">
          <button
            type="button"
            className="rounded-md bg-white/95 p-2 text-slate-700"
            aria-label="Admin menu"
          >
            <IoGridOutline className="h-4 w-4" />
          </button>
        </div>

        <ScrollArea className="h-[calc(100vh-64px)]">
          <nav className="flex flex-col">
            {adminPrimaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePrimaryKey === item.key;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex h-[72px] flex-col items-center justify-center gap-1 border-b border-[#0f497d] px-2 transition-all",
                    isActive
                      ? "bg-[#083f72] text-cyan-200"
                      : "text-blue-100 hover:bg-[#0a3a68]",
                  )}
                >
                  {isActive && (
                    <span className="absolute top-1/2 left-0 h-10 w-1 -translate-y-1/2 rounded-r bg-cyan-300" />
                  )}
                  <Icon className="h-6 w-6" />
                  <span className="text-xs leading-4 font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {showDashboardPanel && (
        <aside className="h-screen w-[300px] border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <p className="text-xs text-violet-600">Dashboard/sidebar</p>
          </div>
          <ScrollArea className="h-[calc(100vh-56px)] px-3 py-4">
            <nav className="space-y-1">
              {adminDashboardNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  normalizedPath === item.href ||
                  normalizedPath.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "text-sky-500"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>
      )}
    </div>
  );
}

function CustomerSidebar({ pathname }: { pathname: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sections = {
    main: navItems.filter((item) => item.section === "main"),
    secondary: navItems.filter((item) => item.section === "secondary"),
    support: navItems.filter((item) => item.section === "support"),
  };

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 flex h-screen flex-col border-r border-slate-200/60 bg-linear-to-b from-slate-50 to-white shadow-sm transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-[72px]",
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-200/60 p-4">
        <div
          className={cn(
            "flex items-center gap-3 transition-opacity duration-200",
            isExpanded ? "opacity-100" : "w-0 opacity-0",
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">
            LI
          </div>
          <span className="whitespace-nowrap font-semibold text-slate-800">
            LinkedIOT
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="group ml-auto rounded-lg p-2 transition-colors hover:bg-slate-100"
          aria-label="Toggle Sidebar"
        >
          {isExpanded ? (
            <IoChevronBackOutline className="h-5 w-5 text-slate-600 group-hover:text-slate-900" />
          ) : (
            <IoChevronForwardOutline className="h-5 w-5 text-slate-600 group-hover:text-slate-900" />
          )}
        </button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-6">
          <div className="space-y-1">
            {isExpanded && (
              <h3 className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Main
              </h3>
            )}
            {sections.main.map((item) => (
              <CustomerNavLink
                key={item.href}
                item={item}
                isActive={
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href))
                }
                isExpanded={isExpanded}
              />
            ))}
          </div>

          <div className="space-y-1">
            {isExpanded && (
              <h3 className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Analytics
              </h3>
            )}
            {!isExpanded && <div className="my-2 border-t border-slate-200" />}
            {sections.secondary.map((item) => (
              <CustomerNavLink
                key={item.href}
                item={item}
                isActive={
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href))
                }
                isExpanded={isExpanded}
              />
            ))}
          </div>

          <div className="space-y-1">
            {isExpanded && (
              <h3 className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Support
              </h3>
            )}
            {!isExpanded && <div className="my-2 border-t border-slate-200" />}
            {sections.support.map((item) => (
              <CustomerNavLink
                key={item.href}
                item={item}
                isActive={
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href))
                }
                isExpanded={isExpanded}
              />
            ))}
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
}

function CustomerNavLink({
  item,
  isActive,
  isExpanded,
}: {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
}) {
  const Icon = item.icon;
  const content = (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
        isActive
          ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        !isExpanded && "justify-center",
      )}
    >
      <div className="relative">
        <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
        {item.badge && item.badge > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {item.badge}
          </span>
        )}
      </div>
      {isExpanded && (
        <span className="flex-1 whitespace-nowrap text-sm font-medium">
          {item.label}
        </span>
      )}
    </Link>
  );

  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
