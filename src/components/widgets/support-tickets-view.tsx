"use client";

import { useDemoSession } from "@/hooks/use-demo-session";
import { SupportQueueView } from "@/components/widgets/support-queue-view";
import { SupportCompanyRequestsView } from "@/components/widgets/support-company-requests-view";
import { SupportUserTicketsView } from "@/components/widgets/support-user-tickets-view";
import { SupportEmptyState } from "@/components/layout/support-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SupportTicketsView() {
  const session = useDemoSession();

  if (!session) {
    return null;
  }

  if (session.role === "iot_user") {
    return <SupportUserTicketsView />;
  }

  if (session.role === "company") {
    return (
      <Tabs defaultValue="iot-tickets" className="space-y-4">
        <TabsList className="w-full justify-start gap-2">
          <TabsTrigger value="iot-tickets">IoT User Tickets</TabsTrigger>
          <TabsTrigger value="company-requests">Company Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="iot-tickets" className="mt-4">
          <SupportQueueView scope="company" />
        </TabsContent>
        <TabsContent value="company-requests" className="mt-4">
          <SupportCompanyRequestsView />
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <SupportEmptyState
      title="Admin access required"
      description="Admin support tickets are available in the admin portal."
    />
  );
}
