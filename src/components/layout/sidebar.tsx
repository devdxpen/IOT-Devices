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
  IoHeadsetOutline,
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
import { useUIStore } from "@/store/ui-store";

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
    key: "support",
    icon: IoHeadsetOutline,
    label: "Support",
    href: "/admin/support/tickets",
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

  return (
    <CustomerSidebar
      pathname={pathname}
      role={
        session?.role === "company" || session?.role === "iot_user"
          ? session.role
          : undefined
      }
    />
  );
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

function CustomerSidebar({
  pathname,
  role,
}: {
  pathname: string;
  role?: "company" | "iot_user";
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { isMobileSidebarOpen, closeMobileSidebar } = useUIStore();

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
    );
  };

  const visibleItems = navItems.filter((item) => {
    if (item.label === "Support" && role === "iot_user") {
      return true;
    }
    return true;
  });

  const sections = {
    main: visibleItems.filter((item) => item.section === "main"),
    secondary: visibleItems.filter((item) => item.section === "secondary"),
    support: visibleItems.filter((item) => item.section === "support"),
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar Content */}
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-secondary-200 bg-secondary-50 shadow-sm transition-all duration-300 ease-in-out md:relative md:translate-x-0",
        isExpanded ? "w-72" : "w-[80px]",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-3 h-16 border-b border-secondary-200 bg-secondary-50 relative">
        <div className={cn("flex items-center gap-3 transition-opacity duration-300", !isExpanded && "opacity-0 invisible hidden md:flex", isMobileSidebarOpen && !isExpanded && "opacity-100 visible flex")}>
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20 active:scale-95 transition-all">
            <IoGridOutline className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-secondary-900 leading-tight">LinkedIOT</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform v2.0</span>
          </div>
        </div>
        
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-lg p-2 transition-all hover:bg-secondary-100 active:scale-95 hidden md:block",
            isExpanded ? "right-4" : "left-1/2 -translate-x-1/2"
          )}
          aria-label="Toggle Sidebar"
        >
          {isExpanded ? (
            <IoChevronBackOutline className="h-5 w-5 text-secondary-500 hover:text-secondary-900" />
          ) : (
            <IoChevronForwardOutline className="h-5 w-5 text-secondary-500 hover:text-secondary-900" />
          )}
        </button>

         {/* Mobile close button */}
         <button
          type="button"
          onClick={closeMobileSidebar}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-all hover:bg-secondary-100 active:scale-95 md:hidden"
        >
          <IoChevronBackOutline className="h-5 w-5 text-secondary-500 hover:text-secondary-900" />
        </button>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="flex flex-col gap-8">
          {Object.entries(sections).map(([name, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={name} className="space-y-1">
                {(isExpanded || isMobileSidebarOpen) && (
                  <h3 className="mb-3 px-3 text-[11px] font-bold tracking-widest text-secondary-400 uppercase">
                    {name === "main" ? "Navigation" : name}
                  </h3>
                )}
                {!(isExpanded || isMobileSidebarOpen) && name !== "main" && (
                  <div className="my-4 border-t border-secondary-200" />
                )}
                <div className="space-y-1">
                  {items.map((item) => (
                    <CustomerNavLink
                      key={item.href}
                      item={item}
                      role={role}
                      isActive={
                        pathname === item.href ||
                        (item.href !== "/home" && pathname.startsWith(item.href))
                      }
                      isExpanded={isExpanded || isMobileSidebarOpen}
                      isItemExpanded={expandedItems.includes(item.label)}
                      onToggleExpand={() => toggleExpand(item.label)}
                      onClickLink={() => {
                        // Close sidebar on mobile when a link without sub-items is clicked
                        if (!item.subItems?.length) {
                          closeMobileSidebar();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
    </>
  );
}

function CustomerNavLink({
  item,
  isActive,
  isExpanded,
  isItemExpanded,
  onToggleExpand,
  onClickLink,
  role,
}: {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  isItemExpanded: boolean;
  onToggleExpand: (label: string) => void;
  onClickLink?: () => void;
  role?: string;
}) {
  const pathname = usePathname();
  const Icon = item.icon;
  const { closeMobileSidebar } = useUIStore();

  const subItems =
    item.label === "Support" && role === "iot_user"
      ? item.subItems?.filter((si) => 
          ["Help", "Knowledge Base", "FAQ", "Support Tickets"].includes(si.label)
        )
      : item.subItems;

  const hasSubItems = subItems && subItems.length > 0;

  const content = (
    <div className="space-y-1">
      <Link
        href={hasSubItems ? "#" : item.href}
        onClick={(e) => {
          if (hasSubItems) {
            e.preventDefault();
            onToggleExpand(item.label);
          } else {
             onClickLink?.();
          }
        }}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300",
          isActive && !hasSubItems
            ? "bg-white text-sky-500 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-secondary-200"
            : "text-secondary-500 hover:bg-secondary-100 hover:text-secondary-900",
          !isExpanded && "justify-center",
        )}
      >
        <div className="relative">
          <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-sky-500")} />
          {item.badge && item.badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-secondary-50">
              {item.badge}
            </span>
          )}
        </div>
        {isExpanded && (
          <span className={cn("flex-1 whitespace-nowrap text-sm font-semibold", isActive && "text-secondary-900")}>
            {item.label}
          </span>
        )}
        {isExpanded && hasSubItems && (
          <IoChevronForwardOutline
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-300",
              isItemExpanded ? "rotate-90" : "opacity-40",
            )}
          />
        )}
      </Link>

      {isExpanded && hasSubItems && isItemExpanded && (
        <div className="ml-9 mt-1 space-y-1 border-l-2 border-secondary-200 pl-4">
          {subItems.map((subItem) => {
            const isSubActive = pathname === subItem.href;
            return (
              <Link
                key={subItem.href}
                href={subItem.href}
                onClick={closeMobileSidebar}
                className={cn(
                  "block py-2 text-sm transition-colors",
                  isSubActive
                    ? "font-bold text-sky-500"
                    : "font-medium text-secondary-500 hover:text-secondary-900",
                )}
              >
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{item.label}</p>
            {hasSubItems && (
              <p className="text-[10px] opacity-70">{subItems.length} items</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
