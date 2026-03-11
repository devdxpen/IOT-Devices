import {
  mockDeviceSummaries,
  addDevice as mockAddDevice,
  updateDevicePriority as mockUpdateDevicePriority,
} from "@/data/mockDeviceSummaries";
import { DeviceSummary } from "@/types";

export async function getDeviceSummaries(): Promise<DeviceSummary[]> {
  return [...mockDeviceSummaries]; // Return copy to let React detect changes
}

export async function addDevice(
  device: Partial<DeviceSummary>,
): Promise<DeviceSummary> {
  return mockAddDevice(device);
}

export async function updateDevicePriority(
  deviceId: string,
  targetPosition: number,
  newFlag: "red" | "yellow" | "green" | "none",
): Promise<void> {
  return mockUpdateDevicePriority(deviceId, targetPosition, newFlag);
}
