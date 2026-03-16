"use client";

import { Moon, Sun, ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  IoAddOutline,
  IoExpandOutline,
  IoGridOutline,
  IoLogOutOutline,
  IoMoonOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDemoSession } from "@/hooks/use-demo-session";
import { clearDemoSession } from "@/lib/auth/demo-auth";
import { useTheme } from "@/lib/theme";
import { useUIStore } from "@/store/ui-store";

export function Header() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const session = useDemoSession();
  const router = useRouter();
  const { toggleMobileSidebar } = useUIStore();

  const isAdmin = session?.role === "admin";
  const isCompany = session?.role === "company";
  const roleLabel = isCompany ? "Company Admin" : "IoT User";

  const handleLogout = () => {
    clearDemoSession();
    router.push("/login");
  };

  if (isAdmin) {
    return (
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white px-8">
        <div className="flex items-center gap-6">
          <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
            <IoGridOutline className="h-5 w-5 text-slate-400" />
          </button>
          <Image src="/logo.svg" alt="Logo" width={140} height={20} className="w-auto h-5" />
        </div>
        
        <div className="flex items-center gap-2">
           <div className="flex items-center mr-4">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-50 rounded-xl"
            >
              Actions
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { icon: IoGridOutline, label: "View" },
              { icon: IoExpandOutline, label: "Fullscreen" },
              { icon: IoMoonOutline, label: "Theme", onClick: toggleTheme },
            ].map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={item.onClick}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              >
                <item.icon className="h-5 w-5" />
              </button>
            ))}
            
            <div className="relative mx-1">
              <button
                type="button"
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              >
                <IoNotificationsOutline className="h-5 w-5" />
              </button>
              <Badge className="absolute top-1 right-1 flex h-4.5 min-w-4.5 items-center justify-center border-2 border-white bg-red-500 px-1 text-[9px] font-black text-white hover:bg-red-500 rounded-full shadow-sm">
                20
              </Badge>
            </div>
          </div>

          <div className="mx-4 h-8 w-px bg-slate-100" />
          
          <div className="flex items-center gap-3 pl-2">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-md transition-transform group-hover:scale-105">
                  <AvatarImage src="/avatar.jpg" alt="Anna Adame" />
                  <AvatarFallback className="bg-sky-500 text-white font-bold">AA</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-black text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">
                  Anna Adame
                </span>
                <span className="text-[11px] font-bold text-slate-400">Founder</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="rounded-lg p-2 transition-colors hover:bg-accent md:hidden text-foreground"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Image src="/logo.svg" alt="Logo" width={169} height={24} className="hidden md:block" />
        <Image src="/logo.svg" alt="Logo" width={120} height={18} className="md:hidden" />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {isCompany && (
          <Button className="h-9 font-medium shadow-sm">
            <IoAddOutline className="h-4 w-4" />
            <span>Add Device</span>
          </Button>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="rounded-lg p-2 transition-colors hover:bg-accent"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen();
                }
              }}
            >
              <IoExpandOutline className="h-5 w-5 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Fullscreen</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="relative rounded-lg p-2 transition-colors hover:bg-accent"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 text-muted-foreground transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 text-muted-foreground transition-all dark:rotate-0 dark:scale-100" />
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>
            {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <button
                type="button"
                className="rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <IoNotificationsOutline className="h-5 w-5 text-muted-foreground" />
              </button>
              <Badge className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center border-2 border-card bg-red-500 px-1.5 text-[10px] text-white hover:bg-red-500">
                30
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Notifications</TooltipContent>
        </Tooltip>

        <div className="mx-1 h-8 w-px bg-border" />

        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-9 w-9 ring-2 ring-muted">
              <AvatarImage
                src="/avatar.jpg"
                alt={session?.displayName ?? "User"}
              />
              <AvatarFallback className="bg-linear-to-br from-primary-400 to-primary-600 text-sm font-medium text-white">
                CU
              </AvatarFallback>
            </Avatar>
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm leading-tight font-semibold text-foreground">
              {session?.displayName ?? "IoT User"}
            </span>
            <span className="text-xs text-muted-foreground">{roleLabel}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg p-2 transition hover:bg-slate-100"
          title="Logout"
        >
          <IoLogOutOutline className="h-5 w-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
}
