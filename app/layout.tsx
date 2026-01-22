import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinkedIOT - Device Management Dashboard",
  description: "IoT device management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} bg-gray-100 grid grid-cols-[auto_1fr] h-screen overflow-hidden relative`}>
        <Sidebar />
        <div className="h-screen overflow-y-auto w-full">
          <Header />
          <main className="px-6 pt-6 -mt-2 pb-6 min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
