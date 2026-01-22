import { DevicesManagement } from "@/components/dashboard/devices-management";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Device } from "@/types";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoPauseCircleOutline,
  IoServerOutline
} from "react-icons/io5";

const mockDevices: Device[] = Array(9)
  .fill(null)
  .map((_, i) => ({
    id: `device-${i}`,
    name: "SENSOR-001",
    type: "Temperature Sensor",
    serialNumber: "SN-98234761234",
    category: "Industrial IoT",
    subCategory: "Ahmedabad iot",
    users: ["/user1.jpg", "/user2.jpg", "/user3.jpg"],
    userCount: 5,
    manufacturer: "SensoriX Technologies",
    model: "TX-500",
    firmwareVersion: "Update v2.4.1",
    macAddress: "00:1B:44:11:3A:B7",
    icon: "/sensor-icon.png",
  }));

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col gap-6 w-full h-full mb-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={IoServerOutline}
            label="Total Devices"
            value="10,987"
            iconBgColor="bg-neutral-100"
            iconColor="text-neutral-600"
          />
          <StatsCard
            icon={IoCheckmarkCircleOutline}
            label="Active Devices"
            value="10,987"
            iconBgColor="bg-neutral-100"
            iconColor="text-neutral-600"
          />
          <StatsCard
            icon={IoPauseCircleOutline}
            label="In-active Devices"
            value="10,987"
            iconBgColor="bg-neutral-100"
            iconColor="text-neutral-600"
          />
          <StatsCard
            icon={IoAlertCircleOutline}
            label="Faulty Devices"
            value="10,987"
            iconBgColor="bg-neutral-100"
            iconColor="text-neutral-600"
          />
        </div>
      </div>
      <DevicesManagement devices={mockDevices} />
    </>
  );
}
