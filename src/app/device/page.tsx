import { Suspense } from "react";
import { DevicesManagement } from "@/features/dashboard/devices-management";
import { StatsCard } from "@/features/dashboard/stats-card";
import { dashboardStats } from "@/constants/dashboardStats";

export default function DevicePage() {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
        {dashboardStats.map((stat) => (
          <StatsCard
            key={stat.key}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            iconBgColor="bg-neutral-100"
            iconColor="text-neutral-600"
          />
        ))}
      </div>
      <Suspense fallback={<div>Loading devices...</div>}>
        <DevicesManagement />
      </Suspense>
    </>
  );
}
