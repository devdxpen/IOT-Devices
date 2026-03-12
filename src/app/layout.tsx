import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { appConfig } from "@/config/app";
import { UserPlanProvider } from "@/contexts/UserPlanContext";
import { ThemeProvider } from "@/lib/theme";
import { Providers } from "./providers";

/**
 * Font Configuration
 * Uses design token variable for consistent typography
 */
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${appConfig.name} - Device Management Dashboard`,
  description: appConfig.description,
};

/**
 * Root Layout
 *
 * Wraps the application with:
 * - ThemeProvider for light/dark/system theme support
 * - Design token-based styling (bg-background instead of hardcoded colors)
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} bg-background text-foreground`}>
        {/* ThemeProvider enables theme switching: light, dark, or system preference */}
        <ThemeProvider defaultTheme="system">
          <UserPlanProvider>
            <Providers>
              <AppShell>{children}</AppShell>
            </Providers>
          </UserPlanProvider>
        </ThemeProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
