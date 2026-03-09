import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkedUsersTable } from "./LinkedUsersTable";
import { RequestsTable } from "./RequestsTable";
import { SendAccessRequestForm } from "./SendAccessRequestForm";

export function DeviceAccessManagement() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[500px] shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Linked Account & Role Management</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage users who have access to your devices, review pending requests, and request access to new devices.
        </p>
      </div>

      <Tabs defaultValue="linked" className="w-full">
        <div className="border-b border-slate-200 mb-6">
          <TabsList className="bg-transparent h-auto p-0 gap-6 justify-start w-full whitespace-nowrap overflow-x-auto hide-scrollbar">
            <TabsTrigger 
              value="linked" 
              className="rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary px-1 py-3"
            >
              Linked Users
            </TabsTrigger>
            <TabsTrigger 
              value="requests"
              className="rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary px-1 py-3"
            >
              Requests (Sent / Received)
            </TabsTrigger>
            <TabsTrigger 
              value="new"
              className="rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary px-1 py-3"
            >
              Send Access Request
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="linked" className="mt-0 outline-none animate-in fade-in-50 duration-300">
          <LinkedUsersTable />
        </TabsContent>

        <TabsContent value="requests" className="mt-0 outline-none animate-in fade-in-50 duration-300">
          <RequestsTable />
        </TabsContent>

        <TabsContent value="new" className="mt-0 outline-none animate-in fade-in-50 duration-300">
          <div className="flex justify-center">
            <SendAccessRequestForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
