import { Device, DeviceSummary } from "./device";

export interface GroupSummary {
  id: string;
  name: string;
  deviceCount: number;
  tags: string;
  lastDataTimestamp: string;
  validatePeriodStart: string;
  validatePeriodEnd: string;
  alarms: number;
  users: { name: string; avatarUrl: string }[];
  devices: DeviceSummary[];
}

export interface DeviceGroup {
  id: string;
  name: string;
  description?: string;
  icon: "security" | "power" | "environmental" | "network" | "general";
  status: "active" | "inactive";
  deviceCount: number;
  activeUsers: number;
  inactiveUsers: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  devices: Device[];
  tags: string;
  validityStart: string;
  validityEnd: string;
  alarms: number;
  image?: string;
}

export interface GroupFilterState {
  search: string;
  status: string;
  deviceType: string;
}

export interface GroupUser {
  id: string;
  name: string;
  department: string;
  assignedDevices: number;
  assignedBy: string;
  assignedByRole: string;
  validityStart: string;
  validityEnd: string;
  status: "approved" | "pending" | "invited";
  role: "Viewer" | "Editor" | "Admin";
}

export interface GroupAlarm {
  id: string;
  name: string;
  tag: string;
  condition: string;
  recipientCount: number;
  alarmType: "Critical" | "Major" | "Minor";
  status: boolean;
}
