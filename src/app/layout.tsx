import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/lib/theme";
import { Providers } from "./providers";
import { appConfig } from "@/config/app";
import { Toaster } from "sonner";

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
      <body
        className={`${nunito.variable} bg-background text-foreground grid grid-cols-[auto_1fr] h-screen overflow-hidden relative`}
      >
        {/* ThemeProvider enables theme switching: light, dark, or system preference */}
        <ThemeProvider defaultTheme="system">
          <Providers>
            <Sidebar />
            <div className="h-screen w-full flex flex-col">
              <Header />
              <main className="px-6 pt-6 pb-6 h-[calc(100vh-64px)] flex flex-col">
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

