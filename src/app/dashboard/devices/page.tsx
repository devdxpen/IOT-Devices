import { Suspense } from "react";
import { DevicesManagement } from "@/features/dashboard/devices-management";

export default function DashboardDevicesPage() {
  return (
    <Suspense fallback={<div>Loading devices...</div>}>
      <DevicesManagement />
    </Suspense>
  );
}
