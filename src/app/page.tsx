import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeviceAccessManagement } from "@/features/device-access/components/DeviceAccessManagement";

export default function HomePage() {
  return (
    <div className="flex-1 w-full h-full">
      <Tabs defaultValue="home" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="access">Device Access Request</TabsTrigger>
            <TabsTrigger value="activity">User Activity Log</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="home" className="mt-0 outline-none">
          <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Home Dashboard</h2>
            <p className="text-slate-500">Welcome to the central dashboard. Select a tab to view specific information.</p>
          </div>
        </TabsContent>

        <TabsContent value="access" className="mt-0 outline-none">
          <DeviceAccessManagement />
        </TabsContent>

        <TabsContent value="activity" className="mt-0 outline-none">
          <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">User Activity Logs</h2>
            <p className="text-slate-500">Track actions performed by users across the system.</p>
            {/* Add user activity logs here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
