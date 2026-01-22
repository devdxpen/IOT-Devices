export interface Device {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
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

export interface Stats {
  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;
  faultyDevices: number;
}
