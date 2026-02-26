export type DeviceStatus = "active" | "inactive";

export interface DeviceReading {
  t1: number;
  t2: number;
  t3: number;
}

export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  location: string;
  status: DeviceStatus;
  deviceType: string;
  category: string;
  subCategory: string;
  manufacturer: string;
  model: string;
  firmwareVersion: string;
  macAddress: string;
  password: string;
  lastDataTimestamp: string;
  alarms: number;
  data: DeviceReading;
  users: number;
}

export interface DeviceSummary {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  location: string;
  category: string;
  subCategory: string;
  users: string[];
  userCount: number;
  manufacturer: string;
  model: string;
  firmwareVersion: string;
  macAddress: string;
  icon: string;
}

