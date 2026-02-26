"use client";

/**
 * ============================================
 * THEME TOGGLE COMPONENT
 * ============================================
 *
 * A button component for switching between light/dark/system themes.
 * Uses the ThemeProvider context for state management.
 *
 * Usage:
 * ```tsx
 * <ThemeToggle />
 * <ThemeToggle variant="outline" />
 * ```
 */

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  /** Button variant */
  variant?: "default" | "outline" | "ghost";
  /** Show dropdown menu or just toggle */
  showMenu?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Theme Toggle Button
 * Displays current theme icon and allows switching
 */
export function ThemeToggle({
  variant = "outline",
  showMenu = true,
  className,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme();

  // Simple toggle mode (no dropdown)
  if (!showMenu) {
    return (
      <Button
        variant={variant}
        size="icon"
        onClick={toggleTheme}
        className={cn("relative", className)}
        aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  // Dropdown menu mode
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          className={cn("relative", className)}
          aria-label="Select theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(theme === "light" && "bg-accent")}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(theme === "dark" && "bg-accent")}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(theme === "system" && "bg-accent")}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Theme Indicator
 * Displays the current theme as text (useful for debugging)
 */
export function ThemeIndicator({ className }: { className?: string }) {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className={cn("text-xs text-muted-foreground", className)}>
      Theme: {theme} (resolved: {resolvedTheme})
    </div>
  );
}

export { ThemeToggle as default };

