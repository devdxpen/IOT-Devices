"use client";

/**
 * ============================================
 * THEME PROVIDER
 * ============================================
 *
 * React context provider for theme management.
 * Handles theme state, system preference detection, and persistence.
 *
 * Usage:
 * ```tsx
 * // In layout.tsx
 * <ThemeProvider defaultTheme="system">
 *   {children}
 * </ThemeProvider>
 *
 * // In any component
 * const { theme, setTheme, resolvedTheme } = useTheme();
 * ```
 */

import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  /** Current theme setting ('light', 'dark', or 'system') */
  theme: Theme;
  /** Set the theme */
  setTheme: (theme: Theme) => void;
  /** Actual resolved theme (always 'light' or 'dark') */
  resolvedTheme: "light" | "dark";
  /** Toggle between light and dark */
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "iot-dashboard-theme";

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Default theme on first visit */
  defaultTheme?: Theme;
  /** Force a specific theme (overrides user preference) */
  forcedTheme?: "light" | "dark";
  /** Disable system theme detection */
  disableSystemTheme?: boolean;
  /** Storage key for persistence */
  storageKey?: string;
}

/**
 * ThemeProvider Component
 *
 * Wraps the application to provide theme context.
 * Automatically:
 * - Detects system color scheme preference
 * - Persists user preference to localStorage
 * - Applies 'dark' class to document root for CSS targeting
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  forcedTheme,
  disableSystemTheme = false,
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light",
  );
  const [mounted, setMounted] = React.useState(false);

  // Get system preference
  const getSystemTheme = React.useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  // Resolve the actual theme to apply
  const resolveTheme = React.useCallback(
    (themeValue: Theme): "light" | "dark" => {
      if (forcedTheme) return forcedTheme;
      if (themeValue === "system" && !disableSystemTheme) {
        return getSystemTheme();
      }
      return themeValue === "dark" ? "dark" : "light";
    },
    [forcedTheme, disableSystemTheme, getSystemTheme],
  );

  // Apply theme to document
  const applyTheme = React.useCallback((resolved: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
    setResolvedTheme(resolved);
  }, []);

  // Set theme and persist
  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      const resolved = resolveTheme(newTheme);
      applyTheme(resolved);

      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (e) {
        // localStorage not available
      }
    },
    [resolveTheme, applyTheme, storageKey],
  );

  // Toggle between light and dark
  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  }, [resolvedTheme, setTheme]);

  // Initialize on mount
  React.useEffect(() => {
    setMounted(true);

    // Load saved preference
    let savedTheme: Theme = defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && ["light", "dark", "system"].includes(stored)) {
        savedTheme = stored as Theme;
      }
    } catch (e) {
      // localStorage not available
    }

    setThemeState(savedTheme);
    const resolved = resolveTheme(savedTheme);
    applyTheme(resolved);
  }, [defaultTheme, storageKey, resolveTheme, applyTheme]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (disableSystemTheme || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const resolved = resolveTheme("system");
      applyTheme(resolved);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, disableSystemTheme, resolveTheme, applyTheme]);

  // Prevent flash of wrong theme
  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      toggleTheme,
    }),
    [theme, setTheme, resolvedTheme, toggleTheme],
  );

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: defaultTheme,
          setTheme: () => {},
          resolvedTheme: "light",
          toggleTheme: () => {},
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 *
 * Access theme context from any component.
 * Must be used within a ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeContext };
export type { Theme, ThemeContextValue, ThemeProviderProps };
