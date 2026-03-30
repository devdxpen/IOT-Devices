import { mockDevices } from "@/data/mockDevices";
import { Device } from "@/types";

export async function getDeviceSummaries(): Promise<Device[]> {
  return [...mockDevices]; // Return copy to let React detect changes
}

export async function addDevice(
  device: Partial<Device>,
): Promise<Device> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const newDevice: Device = {
    id: `device-new-${Date.now()}`,
    image: "/api/placeholder/40/40",
    name: device.name || "Unknown Device",
    brandName: device.brandName || "Unknown Brand",
    model: device.model || "Unknown Model",
    serialNumber: device.serialNumber || "N/A",
    macAddress: device.macAddress || "00:00:00:00:00:00",
    status: device.status || "active",
    industry: device.industry || "General",
    category: device.category || "General",
    cluster: device.cluster || "Cluster A",
    group: device.group || "Default Group",
    description: device.description || "",
    
    // Legacy fields mapped conditionally or defaults
    location: device.location || "unknown",
    subCategory: device.subCategory || "General",
    manufacturer: device.manufacturer || device.brandName || "Unknown Brand",
    firmwareVersion: "1.0.0",
    icon: "/sensor-icon.png",
    company: device.company || "Blue Star",
    assignedUser: device.assignedUser || {
      name: "Anna Adame",
      avatarUrl: "/avatars/avatar-1.png",
    },
    lastDataTimestamp: device.lastDataTimestamp || "Just Now",
    alarms: device.alarms || 0,
    data: device.data || { t1: 0, t2: 0, t3: 0 },
    position: mockDevices.length + 1,
    isOnline: device.isOnline ?? true,
    ownership: device.ownership || "own",
    tags: device.tags || ["New"],
    colorFlag: device.colorFlag || "none",
    users: device.users || 0,
    
    // Merge any other passed values
    ...device,
  };

  // Prepend to array
  mockDevices.unshift(newDevice);
  // Re-index positions
  mockDevices.forEach((d, idx) => {
    d.position = idx + 1;
  });
  return newDevice;
}

export async function updateDevicePriority(
  deviceId: string,
  targetPosition: number,
  newFlag: "red" | "yellow" | "green" | "none",
): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const currentIndex = mockDevices.findIndex((d) => d.id === deviceId);
  if (currentIndex === -1) return;

  const device = mockDevices[currentIndex];
  device.colorFlag = newFlag;

  mockDevices.splice(currentIndex, 1);

  const safeTargetIndex = Math.max(
    0,
    Math.min(targetPosition - 1, mockDevices.length),
  );

  mockDevices.splice(safeTargetIndex, 0, device);

  mockDevices.forEach((d, idx) => {
    d.position = idx + 1;
  });
}
