"use client";

import {
  IoNotificationsOutline,
  IoExpandOutline,
  IoAddOutline,
} from "react-icons/io5";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/lib/theme";
import Image from "next/image";

export function Header() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Logo */}
      <Image src="/logo.svg" alt="Logo" width={169} height={24} />

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Add Device Button */}
        <Button className="h-9 font-medium shadow-sm">
          <IoAddOutline className="w-4 h-4" />
          <span>Add Device</span>
        </Button>

        {/* Fullscreen Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen();
                }
              }}
            >
              <IoExpandOutline className="w-5 h-5 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Fullscreen</TooltipContent>
        </Tooltip>

        {/* Dark Mode Toggle - Functional */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-2 hover:bg-accent rounded-lg transition-colors relative"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
            >
              {/* Sun icon - visible in dark mode */}
              <Sun className="w-5 h-5 text-muted-foreground rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              {/* Moon icon - visible in light mode */}
              <Moon className="w-5 h-5 text-muted-foreground absolute top-2 left-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>
            {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
          </TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <IoNotificationsOutline className="w-5 h-5 text-muted-foreground" />
              </button>
              <Badge className="absolute -top-1 -right-1 bg-error hover:bg-error text-error-foreground text-[10px] h-5 min-w-5 flex items-center justify-center px-1.5 border-2 border-card">
                30
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>Notifications</TooltipContent>
        </Tooltip>

        {/* User Profile Separator */}
        <div className="w-px h-8 bg-border mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-9 h-9 ring-2 ring-muted">
              <AvatarImage src="/avatar.jpg" alt="Anna Adams" />
              <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white text-sm font-medium">
                AA
              </AvatarFallback>
            </Avatar>
            {/* Online Indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-card rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-tight">
              Anna Adams
            </span>
            <span className="text-xs text-muted-foreground">Founder</span>
          </div>
        </div>
      </div>
    </header>
  );
}

