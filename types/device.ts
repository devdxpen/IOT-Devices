export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  location: string;
  status: 'active' | 'inactive';
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
  data: {
    t1: number;
    t2: number;
    t3: number;
  };
  users: number;
}

export type ViewMode = 'list' | 'card';

export interface FilterState {
  search: string;
  location: string;
  status: string;
  deviceType: string;
  category: string;
  subCategory: string;
  manufacturer: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
}
