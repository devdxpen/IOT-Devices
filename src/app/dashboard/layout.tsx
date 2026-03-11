import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full -mx-6 -my-6">
      {/* 
        The negative margins are to break out of the main <main className="px-6 pt-6 pb-6"> 
        in the root layout, so the sidebar touches the top/bottom/left edges smoothly. 
      */}
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
}
