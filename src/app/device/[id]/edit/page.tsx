"use client";

import { DeviceEditTabs } from "@/features/dashboard/components/device-edit-tabs";
import { useParams } from "next/navigation";

export default function DeviceEditPage() {
  const params = useParams();
  const deviceId = params.id as string;

  return (
    <div className="h-full overflow-auto">
      <DeviceEditTabs deviceId={deviceId} />
    </div>
  );
}
