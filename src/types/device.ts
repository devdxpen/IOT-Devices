export type DeviceStatus = "active" | "inactive";

export interface DeviceReading {
  t1: number;
  t2: number;
  t3: number;
}

export interface Device {
  id: string; // Matches serialNumber / device id
  image?: string;
  status: DeviceStatus;
  brandName?: string;
  model?: string;
  serialNumber?: string; // Used as deviceid/serialno
  name: string; // Device Name
  macAddress?: string;
  industry?: string;
  category?: string;
  description?: string;
  cluster?: string;
  group?: string;
  
  // Extra fields to support existing dashboard features
  location?: string;
  deviceType?: string;
  type?: string;
  address?: string;
  subCategory?: string;
  manufacturer?: string;
  firmwareVersion?: string;
  password?: string;
  lastDataTimestamp?: string;
  alarms?: number;
  data?: DeviceReading;
  users?: number; // User count 
  userList?: string[];
  assignedUser?: {
    name: string;
    avatarUrl?: string;
  };
  tags?: string[];
  colorFlag?: "red" | "yellow" | "green" | "none"; // Explicit priority colors
  isOnline?: boolean;
  position?: number;
  ownership?: "own" | "shared";
  company?: string;
  icon?: string;
}
