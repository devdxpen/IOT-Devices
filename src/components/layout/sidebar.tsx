"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app";
import { navItems, NavItem } from "@/config/navigation";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const sections = {
    main: navItems.filter((item) => item.section === "main"),
    secondary: navItems.filter((item) => item.section === "secondary"),
    support: navItems.filter((item) => item.section === "support"),
  };

  return (
    <aside
      className={cn(
        "bg-linear-to-b from-slate-50 to-white border-r border-slate-200/60 flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out shadow-sm",
        isExpanded ? "w-64" : "w-[72px]",
      )}
    >
      {/* Header with Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-slate-200/60">
        <div
          className={cn(
            "flex items-center gap-3 transition-opacity duration-200",
            isExpanded ? "opacity-100" : "opacity-0 w-0",
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {appConfig.sidebarInitials}
          </div>
          <span className="font-semibold text-slate-800 whitespace-nowrap">
            {appConfig.sidebarTitle}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors ml-auto group"
          aria-label="Toggle Sidebar"
        >
          {isExpanded ? (
            <IoChevronBackOutline className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
          ) : (
            <IoChevronForwardOutline className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
          )}
        </button>
      </div>

      {/* Navigation with ScrollArea */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            {isExpanded && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Main
              </h3>
            )}
            {sections.main.map((item) => (
              <NavLink
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

          {/* Secondary Navigation */}
          <div className="space-y-1">
            {isExpanded && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Analytics
              </h3>
            )}
            {!isExpanded && <div className="border-t border-slate-200 my-2" />}
            {sections.secondary.map((item) => (
              <NavLink
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

          {/* Support Navigation */}
          <div className="space-y-1">
            {isExpanded && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Support
              </h3>
            )}
            {!isExpanded && <div className="border-t border-slate-200 my-2" />}
            {sections.support.map((item) => (
              <NavLink
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

      {/* Footer */}
      <div className="p-3 border-t border-slate-200/60 bg-slate-50/50">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors",
            !isExpanded && "justify-center",
          )}
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            JD
          </div>
          {isExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                John Doe
              </p>
              <p className="text-xs text-slate-500 truncate">
                john@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// NavLink Component
function NavLink({
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
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
        isActive
          ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        !isExpanded && "justify-center",
      )}
    >
      <div className="relative">
        <Icon
          className={cn("w-5 h-5 transition-transform group-hover:scale-110")}
        />
        {item.badge && item.badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </div>
      {isExpanded && (
        <span className="text-sm font-medium whitespace-nowrap flex-1">
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
