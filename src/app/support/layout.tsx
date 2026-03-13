"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useDemoSession } from "@/hooks/use-demo-session";
import {
  Headset,
  Ticket,
  PhoneCall,
  BarChart3,
  UserCircle,
  BookOpen,
  HelpCircle,
  MessageSquare,
  CalendarDays,
} from "lucide-react";

interface NavGroup {
  label: string;
  icon: React.ElementType;
  items: {
    label: string;
    icon: React.ElementType;
    href: string;
  }[];
}

const supportGroupsByRole: Record<"company" | "iot_user", NavGroup[]> = {
  company: [
    {
      label: "Customer Support",
      icon: Headset,
      items: [
        { label: "Support Analytics", icon: BarChart3, href: "/support/analytics" },
        { label: "Support Tickets", icon: Ticket, href: "/support/tickets" },
        { label: "Call Requests", icon: PhoneCall, href: "/support/call-requests" },
        { label: "Book a demo", icon: CalendarDays, href: "/support/demo-request" },
      ],
    },
    {
      label: "Resources",
      icon: BookOpen,
      items: [
        { label: "Help", icon: HelpCircle, href: "/support/help" },
        { label: "Knowledge Base", icon: BookOpen, href: "/support/knowledge-base" },
        { label: "FAQ", icon: HelpCircle, href: "/support/faq" },
      ],
    },
  ],
  iot_user: [
    {
      label: "User Support",
      icon: UserCircle,
      items: [
        { label: "Support Tickets", icon: Ticket, href: "/support/tickets" },
      ],
    },
    {
      label: "Resources",
      icon: BookOpen,
      items: [
        { label: "Help", icon: HelpCircle, href: "/support/help" },
        { label: "Knowledge Base", icon: BookOpen, href: "/support/knowledge-base" },
        { label: "FAQ", icon: HelpCircle, href: "/support/faq" },
      ],
    },
  ],
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const session = useDemoSession();
  const role = session?.role === "company" || session?.role === "iot_user"
    ? session.role
    : null;
  const supportGroups = role ? supportGroupsByRole[role] : [];

  return (
    <div className="flex h-full gap-0 -mx-6 -mt-6 -mb-6">
      <aside className="w-[280px] shrink-0 border-r border-slate-200 bg-white flex flex-col pt-4">
        <ScrollArea className="flex-1">
          <div className="px-4 space-y-8">
            {supportGroups.map((group) => (
              <div key={group.label} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50/50">
                        <group.icon className="h-4 w-4 text-slate-500" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 tracking-tight">
                        {group.label}
                    </span>
                </div>
                
                <div className="relative pl-6 space-y-1">
                   {/* Vertical Line Connector */}
                   <div className="absolute left-[20px] top-0 bottom-4 w-px bg-slate-200" />
                   
                   {group.items.map((item) => {
                       const isActive = pathname === item.href;
                       const Icon = item.icon;
                       return (
                           <Link
                               key={item.href}
                               href={item.href}
                               className={cn(
                                   "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 relative group",
                                   isActive
                                       ? "bg-blue-50/50 text-[#2596be] font-medium"
                                       : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                               )}
                           >
                               {/* Horizontal Connector Dot/Line could be added here if needed, but keeping it clean for now */}
                               <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#2596be]" : "text-slate-400 group-hover:text-slate-600")} />
                               <span>{item.label}</span>
                           </Link>
                       );
                   })}
                </div>
              </div>
            ))}

            <div className="pb-8" />
          </div>
        </ScrollArea>
      </aside>

      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="h-full">
            {children}
        </div>
      </div>
    </div>
  );
}
