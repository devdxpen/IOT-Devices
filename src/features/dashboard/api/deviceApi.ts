import { mockDeviceSummaries } from "@/data/mockDeviceSummaries";
import { DeviceSummary } from "@/types";

export async function getDeviceSummaries(): Promise<DeviceSummary[]> {
  return mockDeviceSummaries;
}
