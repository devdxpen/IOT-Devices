"use client";

import { Moon, Sun } from "lucide-react";
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

export function Header() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const session = useDemoSession();
  const router = useRouter();

  const isAdmin = session?.role === "admin";
  const isCompany = session?.role === "company";
  const roleLabel = isCompany ? "Company Admin" : "IoT User";

  const handleLogout = () => {
    clearDemoSession();
    router.push("/login");
  };

  if (isAdmin) {
    return (
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-card px-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <IoGridOutline className="h-4 w-4" />
          </Button>
          <Image src="/logo.svg" alt="Logo" width={169} height={24} />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Actions
          </button>
          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <IoGridOutline className="h-5 w-5 text-slate-600" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <IoExpandOutline className="h-5 w-5 text-slate-600" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-slate-100"
            onClick={toggleTheme}
          >
            <IoMoonOutline className="h-5 w-5 text-slate-600" />
          </button>
          <div className="relative">
            <button
              type="button"
              className="rounded-lg p-2 transition hover:bg-slate-100"
            >
              <IoNotificationsOutline className="h-5 w-5 text-slate-600" />
            </button>
            <Badge className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center border-2 border-card bg-red-500 px-1.5 text-[10px] text-white hover:bg-red-500">
              20
            </Badge>
          </div>
          <div className="mx-1 h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 ring-2 ring-muted">
              <AvatarImage
                src="/avatar.jpg"
                alt={session?.displayName ?? "Admin"}
              />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                {session?.displayName ?? "Admin"}
              </span>
              <span className="text-xs text-slate-500">Administrator</span>
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

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <Image src="/logo.svg" alt="Logo" width={169} height={24} />

      <div className="flex items-center gap-3">
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
              <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-medium text-white">
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
