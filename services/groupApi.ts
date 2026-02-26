import { DeviceGroup, GroupUser, GroupAlarm, GroupFilterState } from '@/types/group';
import { Device } from '@/types/device';

// ─── Simulated Delay ───
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ─── Seed Data ───
const securityDevices: Device[] = [
  {
    id: 'sec-1', name: 'SENSOR-001', serialNumber: 'SENSOR-PRD-001',
    location: 'Building A, Floor 1', status: 'active', deviceType: 'Access control',
    category: 'Security', subCategory: 'Access Control', manufacturer: 'SecureTech',
    model: 'ST-500', firmwareVersion: '2.1.0', macAddress: 'AA:BB:CC:DD:EE:01',
    password: '****', lastDataTimestamp: '27-07-2025 10:45 AM', alarms: 0,
    data: { t1: 22.5, t2: 23.1, t3: 21.8 }, users: 3,
  },
  {
    id: 'sec-2', name: 'SENSOR-002', serialNumber: 'SENSOR-PRD-002',
    location: 'Building C - Floor 10', status: 'active', deviceType: 'Access control',
    category: 'Security', subCategory: 'Access Control', manufacturer: 'SecureTech',
    model: 'ST-500', firmwareVersion: '2.1.0', macAddress: 'AA:BB:CC:DD:EE:02',
    password: '****', lastDataTimestamp: '28-07-2025 10:45 AM', alarms: 2,
    data: { t1: 24.5, t2: 25.1, t3: 23.8 }, users: 5,
  },
  {
    id: 'sec-3', name: 'SENSOR-003', serialNumber: 'SENSOR-PRD-003',
    location: 'Building B, Floor 2', status: 'inactive', deviceType: 'Access control',
    category: 'Security', subCategory: 'Access Control', manufacturer: 'SecureTech',
    model: 'ST-600', firmwareVersion: '2.0.5', macAddress: 'AA:BB:CC:DD:EE:03',
    password: '****', lastDataTimestamp: '25-07-2025 08:30 AM', alarms: 1,
    data: { t1: 21.0, t2: 22.0, t3: 20.5 }, users: 2,
  },
];

const powerDevices: Device[] = [
  {
    id: 'pow-1', name: 'UPS-001', serialNumber: 'SENSOR-DEV-001',
    location: 'Building A, Floor 1', status: 'active', deviceType: 'Power Control',
    category: 'Power', subCategory: 'UPS', manufacturer: 'PowerMax',
    model: 'PM-1000', firmwareVersion: '3.0.1', macAddress: 'AA:BB:CC:DD:FF:01',
    password: '****', lastDataTimestamp: '27-07-2025 10:45 AM', alarms: 0,
    data: { t1: 45.5, t2: 46.1, t3: 44.8 }, users: 3,
  },
  {
    id: 'pow-2', name: 'GEN-001', serialNumber: 'SENSOR-DEV-002',
    location: 'Building C - Floor 10', status: 'inactive', deviceType: 'Power Control',
    category: 'Power', subCategory: 'Generator', manufacturer: 'PowerMax',
    model: 'PM-2000', firmwareVersion: '3.0.1', macAddress: 'AA:BB:CC:DD:FF:02',
    password: '****', lastDataTimestamp: '28-07-2025 10:45 AM', alarms: 2,
    data: { t1: 50.5, t2: 51.1, t3: 49.8 }, users: 5,
  },
  {
    id: 'pow-3', name: 'METER-001', serialNumber: 'SENSOR-DEV-003',
    location: 'Building A, Floor 1', status: 'active', deviceType: 'Power Control',
    category: 'Power', subCategory: 'Smart Meter', manufacturer: 'PowerMax',
    model: 'PM-1500', firmwareVersion: '3.1.0', macAddress: 'AA:BB:CC:DD:FF:03',
    password: '****', lastDataTimestamp: '27-07-2025 10:45 AM', alarms: 0,
    data: { t1: 42.0, t2: 43.0, t3: 41.5 }, users: 3,
  },
];

const environmentalDevices: Device[] = [
  {
    id: 'env-1', name: 'TEMP-001', serialNumber: 'ENV-TEMP-001',
    location: 'Server Room A', status: 'active', deviceType: 'Temperature Sensor',
    category: 'Environmental', subCategory: 'Temperature', manufacturer: 'EnviroSense',
    model: 'ES-T100', firmwareVersion: '1.5.0', macAddress: 'AA:BB:CC:EE:FF:01',
    password: '****', lastDataTimestamp: '27-07-2025 10:30 AM', alarms: 0,
    data: { t1: 22.0, t2: 22.5, t3: 21.5 }, users: 2,
  },
  {
    id: 'env-2', name: 'HUM-001', serialNumber: 'ENV-HUM-001',
    location: 'Server Room B', status: 'active', deviceType: 'Humidity Sensor',
    category: 'Environmental', subCategory: 'Humidity', manufacturer: 'EnviroSense',
    model: 'ES-H100', firmwareVersion: '1.5.0', macAddress: 'AA:BB:CC:EE:FF:02',
    password: '****', lastDataTimestamp: '27-07-2025 10:32 AM', alarms: 1,
    data: { t1: 55.0, t2: 56.0, t3: 54.0 }, users: 2,
  },
];

const networkDevices: Device[] = [
  {
    id: 'net-1', name: 'ROUTER-001', serialNumber: 'NET-RTR-001',
    location: 'Data Center', status: 'active', deviceType: 'Router',
    category: 'Network', subCategory: 'Core Router', manufacturer: 'NetGear',
    model: 'NG-5000', firmwareVersion: '4.2.1', macAddress: 'AA:BB:DD:EE:FF:01',
    password: '****', lastDataTimestamp: '27-07-2025 10:40 AM', alarms: 0,
    data: { t1: 35.0, t2: 36.0, t3: 34.0 }, users: 4,
  },
  {
    id: 'net-2', name: 'SWITCH-001', serialNumber: 'NET-SWT-001',
    location: 'Floor 1 Rack', status: 'active', deviceType: 'Switch',
    category: 'Network', subCategory: 'Layer 2 Switch', manufacturer: 'NetGear',
    model: 'NG-2400', firmwareVersion: '4.1.0', macAddress: 'AA:BB:DD:EE:FF:02',
    password: '****', lastDataTimestamp: '27-07-2025 10:42 AM', alarms: 0,
    data: { t1: 32.0, t2: 33.0, t3: 31.0 }, users: 3,
  },
];

const industrialDevices: Device[] = [
  {
    id: 'ind-1', name: 'PLC-001', serialNumber: 'IND-PLC-001',
    location: 'Factory Floor A', status: 'active', deviceType: 'PLC Controller',
    category: 'Industrial', subCategory: 'PLC', manufacturer: 'SiemensIoT',
    model: 'S7-1500', firmwareVersion: '5.2.0', macAddress: 'AA:CC:DD:EE:FF:01',
    password: '****', lastDataTimestamp: '27-07-2025 11:00 AM', alarms: 0,
    data: { t1: 38.0, t2: 39.0, t3: 37.5 }, users: 2,
  },
  {
    id: 'ind-2', name: 'VFD-001', serialNumber: 'IND-VFD-001',
    location: 'Factory Floor B', status: 'active', deviceType: 'Variable Frequency Drive',
    category: 'Industrial', subCategory: 'Motor Drive', manufacturer: 'ABB',
    model: 'ACS580', firmwareVersion: '3.1.0', macAddress: 'AA:CC:DD:EE:FF:02',
    password: '****', lastDataTimestamp: '27-07-2025 11:05 AM', alarms: 1,
    data: { t1: 60.0, t2: 61.0, t3: 59.5 }, users: 3,
  },
];

// ─── In-Memory Data Store ───
let groupsStore: DeviceGroup[] = [
  {
    id: 'grp-1', name: 'Ahmedabad Top 10', description: 'Top priority security devices in Ahmedabad campus for perimeter & access control monitoring.',
    icon: 'security', status: 'active', deviceCount: 3, activeUsers: 5, inactiveUsers: 2,
    lastUpdated: 'Today, 11:30 AM', createdAt: '2025-01-15', updatedAt: '2025-07-27',
    devices: securityDevices, tags: 'T1', validityStart: 'May 19 2025',
    validityEnd: 'May 19 2026', alarms: 3,
  },
  {
    id: 'grp-2', name: 'Power Management', description: 'UPS, generators and smart meters across all buildings for power reliability tracking.',
    icon: 'power', status: 'active', deviceCount: 3, activeUsers: 5, inactiveUsers: 2,
    lastUpdated: 'Today, 09:15 AM', createdAt: '2025-02-10', updatedAt: '2025-07-27',
    devices: powerDevices, tags: 'T1', validityStart: 'May 19 2025',
    validityEnd: 'May 19 2026', alarms: 3,
  },
  {
    id: 'grp-3', name: 'Environmental Monitor', description: 'Temperature and humidity sensors in server rooms to prevent equipment overheating.',
    icon: 'environmental', status: 'active', deviceCount: 2, activeUsers: 3, inactiveUsers: 1,
    lastUpdated: 'Today, 10:00 AM', createdAt: '2025-01-20', updatedAt: '2025-07-27',
    devices: environmentalDevices, tags: 'T2', validityStart: 'Jan 19 2025',
    validityEnd: 'Dec 31 2025', alarms: 1,
  },
  {
    id: 'grp-4', name: 'Network Infrastructure', description: 'Core routers and switches for campus-wide network backbone monitoring.',
    icon: 'network', status: 'inactive', deviceCount: 2, activeUsers: 4, inactiveUsers: 3,
    lastUpdated: 'Yesterday, 05:30 PM', createdAt: '2025-03-01', updatedAt: '2025-07-26',
    devices: networkDevices, tags: 'T3', validityStart: 'Jun 01 2025',
    validityEnd: 'Jun 01 2026', alarms: 0,
  },
  {
    id: 'grp-5', name: 'Mumbai Data Center', description: 'Critical infrastructure devices at Mumbai DC including cooling, power and network.',
    icon: 'general', status: 'active', deviceCount: 4, activeUsers: 8, inactiveUsers: 1,
    lastUpdated: 'Today, 08:45 AM', createdAt: '2025-04-12', updatedAt: '2025-07-27',
    devices: [...environmentalDevices, ...networkDevices], tags: 'T1,T2', validityStart: 'Apr 12 2025',
    validityEnd: 'Apr 12 2026', alarms: 2,
  },
  {
    id: 'grp-6', name: 'Factory Automation', description: 'PLCs, VFDs and industrial controllers on the manufacturing floor.',
    icon: 'general', status: 'active', deviceCount: 2, activeUsers: 3, inactiveUsers: 0,
    lastUpdated: 'Today, 07:20 AM', createdAt: '2025-05-01', updatedAt: '2025-07-27',
    devices: industrialDevices, tags: 'T4', validityStart: 'May 01 2025',
    validityEnd: 'May 01 2026', alarms: 1,
  },
  {
    id: 'grp-7', name: 'Bangalore Office', description: 'Smart building sensors and access control systems at Bangalore tech park.',
    icon: 'security', status: 'active', deviceCount: 3, activeUsers: 6, inactiveUsers: 2,
    lastUpdated: 'Yesterday, 03:15 PM', createdAt: '2025-03-20', updatedAt: '2025-07-26',
    devices: securityDevices, tags: 'T1,T3', validityStart: 'Mar 20 2025',
    validityEnd: 'Mar 20 2026', alarms: 2,
  },
  {
    id: 'grp-8', name: 'Emergency Power Backup', description: 'Backup generators and battery banks for disaster recovery sites.',
    icon: 'power', status: 'inactive', deviceCount: 2, activeUsers: 2, inactiveUsers: 4,
    lastUpdated: '2 days ago', createdAt: '2025-06-15', updatedAt: '2025-07-25',
    devices: powerDevices.slice(0, 2), tags: 'T5', validityStart: 'Jun 15 2025',
    validityEnd: 'Dec 15 2025', alarms: 0,
  },
];

let usersStore: GroupUser[] = [
  {
    id: 'gu-1', name: 'Priya Mehta', department: 'HR', assignedDevices: 4,
    assignedBy: 'Arun Sharma', assignedByRole: 'Admin',
    validityStart: 'May 19 2025', validityEnd: 'Jun 19, 2026',
    status: 'approved', role: 'Viewer',
  },
  {
    id: 'gu-2', name: 'Ravi Kumar', department: 'Engineering', assignedDevices: 5,
    assignedBy: 'Arun Sharma', assignedByRole: 'Admin',
    validityStart: 'May 19 2025', validityEnd: 'Unlimited',
    status: 'approved', role: 'Editor',
  },
  {
    id: 'gu-3', name: 'Sneha Patel', department: 'QA', assignedDevices: 6,
    assignedBy: '-- Requested --', assignedByRole: '',
    validityStart: '--', validityEnd: 'Requested Today',
    status: 'pending', role: 'Viewer',
  },
  {
    id: 'gu-4', name: 'Ankit Joshi', department: 'Design', assignedDevices: 6,
    assignedBy: 'Priya Mehta', assignedByRole: 'Admin',
    validityStart: 'May 19 2025', validityEnd: 'Jun 19, 2025',
    status: 'invited', role: 'Viewer',
  },
  {
    id: 'gu-5', name: 'Meera Reddy', department: 'Operations', assignedDevices: 3,
    assignedBy: 'Arun Sharma', assignedByRole: 'Admin',
    validityStart: 'Jun 01 2025', validityEnd: 'Dec 01 2025',
    status: 'approved', role: 'Admin',
  },
];

let alarmsStore: GroupAlarm[] = [
  { id: 'ga-1', name: 'Morning Temperature', tag: 'T4', condition: 'T1 < 10', recipientCount: 5, alarmType: 'Critical', status: false },
  { id: 'ga-2', name: 'High Temperature Alert', tag: 'T4', condition: 'T1 > 45', recipientCount: 5, alarmType: 'Major', status: true },
  { id: 'ga-3', name: 'Humidity Warning', tag: 'T4', condition: 'T2 > 80', recipientCount: 3, alarmType: 'Minor', status: false },
  { id: 'ga-4', name: 'Power Failure', tag: 'T1', condition: 'V1 < 200', recipientCount: 8, alarmType: 'Critical', status: true },
  { id: 'ga-5', name: 'Network Latency', tag: 'T3', condition: 'Ping > 100ms', recipientCount: 4, alarmType: 'Major', status: false },
];

// ─── All available devices (for add device modal) ───
const allAvailableDevices: Device[] = [
  ...securityDevices, ...powerDevices, ...environmentalDevices,
  ...networkDevices, ...industrialDevices,
];

// ─── API Responses ───
export interface GroupListResponse {
  groups: DeviceGroup[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GroupDetailResponse {
  group: DeviceGroup;
  users: GroupUser[];
  alarms: GroupAlarm[];
}

// ─── API Functions ───

export async function fetchGroups(
  filters: GroupFilterState = { search: '', status: 'all', deviceType: 'all' },
  page = 1,
  pageSize = 10,
): Promise<GroupListResponse> {
  await delay(350);

  let result = [...groupsStore];

  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter((g) => g.name.toLowerCase().includes(s) || g.description?.toLowerCase().includes(s));
  }
  if (filters.status !== 'all') {
    result = result.filter((g) => g.status === filters.status);
  }

  const total = result.length;
  const start = (page - 1) * pageSize;
  const groups = result.slice(start, start + pageSize);

  return { groups, total, page, pageSize };
}

export async function fetchGroupById(id: string): Promise<GroupDetailResponse> {
  await delay(300);
  const group = groupsStore.find((g) => g.id === id);
  if (!group) throw new Error(`Group "${id}" not found`);
  return { group, users: usersStore, alarms: alarmsStore };
}

export async function createGroup(
  data: Omit<DeviceGroup, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdated' | 'deviceCount' | 'activeUsers' | 'inactiveUsers'>,
): Promise<DeviceGroup> {
  await delay(500);
  const newGroup: DeviceGroup = {
    ...data,
    id: `grp-${Date.now()}`,
    deviceCount: data.devices.length,
    activeUsers: 0,
    inactiveUsers: 0,
    lastUpdated: 'Just now',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };
  groupsStore = [newGroup, ...groupsStore];
  return newGroup;
}

export async function updateGroup(
  id: string,
  data: Partial<DeviceGroup>,
): Promise<DeviceGroup> {
  await delay(400);
  const idx = groupsStore.findIndex((g) => g.id === id);
  if (idx === -1) throw new Error(`Group "${id}" not found`);
  groupsStore[idx] = {
    ...groupsStore[idx],
    ...data,
    updatedAt: new Date().toISOString().split('T')[0],
    lastUpdated: 'Just now',
  };
  return groupsStore[idx];
}

export async function deleteGroup(id: string): Promise<void> {
  await delay(400);
  const idx = groupsStore.findIndex((g) => g.id === id);
  if (idx === -1) throw new Error(`Group "${id}" not found`);
  groupsStore = groupsStore.filter((g) => g.id !== id);
}

export async function toggleGroupStatus(id: string): Promise<DeviceGroup> {
  await delay(300);
  const idx = groupsStore.findIndex((g) => g.id === id);
  if (idx === -1) throw new Error(`Group "${id}" not found`);
  groupsStore[idx] = {
    ...groupsStore[idx],
    status: groupsStore[idx].status === 'active' ? 'inactive' : 'active',
    updatedAt: new Date().toISOString().split('T')[0],
    lastUpdated: 'Just now',
  };
  return groupsStore[idx];
}

export async function fetchAvailableDevices(search = ''): Promise<Device[]> {
  await delay(250);
  if (!search) return allAvailableDevices;
  const s = search.toLowerCase();
  return allAvailableDevices.filter((d) => d.name.toLowerCase().includes(s) || d.deviceType.toLowerCase().includes(s));
}

export async function fetchGroupUsers(): Promise<GroupUser[]> {
  await delay(250);
  return [...usersStore];
}

export async function fetchGroupAlarms(): Promise<GroupAlarm[]> {
  await delay(250);
  return [...alarmsStore];
}
