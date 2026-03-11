export type TabType = "access" | "received" | "sent";

export interface DeviceAccessRequest {
  id: string;
  type: TabType;
  user: {
    name: string;
    handle: string;
    avatar: string;
    isOnline: boolean;
  };
  device: {
    id: string;
    name: string;
  };
  notification: boolean;
  joiningDate: string;
  expiryDate: string;
  status: "Active" | "Expired" | "Pending";
  role: string;
}

const DUMMY_REQUESTS: DeviceAccessRequest[] = [
  // --- Devices Access (type: 'access') ---
  {
    id: "req-101",
    type: "access",
    user: {
      name: "Priya Mehta",
      handle: "Priyamehta123",
      avatar: "https://i.pravatar.cc/150?u=priya1",
      isOnline: true,
    },
    device: { id: "DVC-1001", name: "Temperature meter" },
    notification: true,
    joiningDate: "01 Jan 2025",
    expiryDate: "No Expiry",
    status: "Active",
    role: "Viewer",
  },
  {
    id: "req-102",
    type: "access",
    user: {
      name: "Amit Shah",
      handle: "AmitShah45",
      avatar: "https://i.pravatar.cc/150?u=amit",
      isOnline: false,
    },
    device: { id: "DVC-1002", name: "Humidity Sensor" },
    notification: false,
    joiningDate: "15 Jan 2025",
    expiryDate: "15 Jan 2026",
    status: "Expired",
    role: "Ownership Transfer",
  },
  {
    id: "req-103",
    type: "access",
    user: {
      name: "Rohan Kumar",
      handle: "RohanK_99",
      avatar: "https://i.pravatar.cc/150?u=rohan",
      isOnline: true,
    },
    device: { id: "DVC-1003", name: "Pressure Gauge" },
    notification: true,
    joiningDate: "10 Feb 2025",
    expiryDate: "No Expiry",
    status: "Active",
    role: "Admin",
  },
  {
    id: "req-104",
    type: "access",
    user: {
      name: "Sneha Desai",
      handle: "SnehaD20",
      avatar: "https://i.pravatar.cc/150?u=sneha",
      isOnline: false,
    },
    device: { id: "DVC-1004", name: "Flow Meter" },
    notification: true,
    joiningDate: "20 Mar 2025",
    expiryDate: "20 Sep 2025",
    status: "Active",
    role: "Viewer",
  },
  {
    id: "req-105",
    type: "access",
    user: {
      name: "Vikram Singh",
      handle: "Viksingh77",
      avatar: "https://i.pravatar.cc/150?u=vikram",
      isOnline: true,
    },
    device: { id: "DVC-1005", name: "Voltage Monitor" },
    notification: false,
    joiningDate: "05 Apr 2025",
    expiryDate: "05 Apr 2026",
    status: "Active",
    role: "Ownership Transfer",
  },

  // --- Received Requests (type: 'received') ---
  {
    id: "req-201",
    type: "received",
    user: {
      name: "Neha Sharma",
      handle: "NehaS_test",
      avatar: "https://i.pravatar.cc/150?u=neha",
      isOnline: false,
    },
    device: { id: "DVC-2001", name: "Water Level Sensor" },
    notification: false,
    joiningDate: "-",
    expiryDate: "-",
    status: "Active", // As per screenshot, received requests show Active status but no join/expiry dates yet
    role: "Viewer",
  },
  {
    id: "req-202",
    type: "received",
    user: {
      name: "Kunal Verma",
      handle: "KunalV88",
      avatar: "https://i.pravatar.cc/150?u=kunal",
      isOnline: true,
    },
    device: { id: "DVC-2002", name: "Gas Detector" },
    notification: false,
    joiningDate: "-",
    expiryDate: "-",
    status: "Active",
    role: "Admin",
  },
  {
    id: "req-203",
    type: "received",
    user: {
      name: "Pooja Joshi",
      handle: "PoojaJ_tech",
      avatar: "https://i.pravatar.cc/150?u=pooja",
      isOnline: true,
    },
    device: { id: "DVC-2003", name: "Vibration Sensor" },
    notification: false,
    joiningDate: "-",
    expiryDate: "-",
    status: "Active",
    role: "Viewer",
  },
  {
    id: "req-204",
    type: "received",
    user: {
      name: "Rahul Gupta",
      handle: "RahulGup",
      avatar: "https://i.pravatar.cc/150?u=rahul",
      isOnline: false,
    },
    device: { id: "DVC-2004", name: "Light Sensor" },
    notification: false,
    joiningDate: "-",
    expiryDate: "-",
    status: "Active",
    role: "Admin",
  },
  {
    id: "req-205",
    type: "received",
    user: {
      name: "Divya Patel",
      handle: "DivyaP_01",
      avatar: "https://i.pravatar.cc/150?u=divya",
      isOnline: true,
    },
    device: { id: "DVC-2005", name: "Sound Meter" },
    notification: false,
    joiningDate: "-",
    expiryDate: "-",
    status: "Active",
    role: "Viewer",
  },

  // --- Sent Requests (type: 'sent') ---
  {
    id: "req-301",
    type: "sent",
    user: {
      name: "Arjun Reddy",
      handle: "ArjunR_sys",
      avatar: "https://i.pravatar.cc/150?u=arjun",
      isOnline: true,
    },
    device: { id: "DVC-3001", name: "Current Transformer" },
    notification: false,
    joiningDate: "01 Jan 2025",
    expiryDate: "01 Jan 2025",
    status: "Pending", // As per screenshot, sent requests are Pending
    role: "Viewer",
  },
  {
    id: "req-302",
    type: "sent",
    user: {
      name: "Anjali Tiwari",
      handle: "AnjaliTiwari",
      avatar: "https://i.pravatar.cc/150?u=anjali",
      isOnline: false,
    },
    device: { id: "DVC-3002", name: "Motion Sensor" },
    notification: false,
    joiningDate: "01 Jan 2025",
    expiryDate: "01 Jan 2025",
    status: "Pending",
    role: "Admin",
  },
  {
    id: "req-303",
    type: "sent",
    user: {
      name: "Aman Gupta",
      handle: "AmanG_dev",
      avatar: "https://i.pravatar.cc/150?u=aman",
      isOnline: true,
    },
    device: { id: "DVC-3003", name: "Smoke Detector" },
    notification: false,
    joiningDate: "01 Jan 2025",
    expiryDate: "01 Jan 2025",
    status: "Pending",
    role: "Viewer",
  },
  {
    id: "req-304",
    type: "sent",
    user: {
      name: "Kavita Rao",
      handle: "Kavita_R",
      avatar: "https://i.pravatar.cc/150?u=kavita",
      isOnline: false,
    },
    device: { id: "DVC-3004", name: "Door Contact" },
    notification: false,
    joiningDate: "01 Jan 2025",
    expiryDate: "15 Jan 2025",
    status: "Pending",
    role: "Admin",
  },
  {
    id: "req-305",
    type: "sent",
    user: {
      name: "Sunil Verma",
      handle: "SunilV_88",
      avatar: "https://i.pravatar.cc/150?u=sunil",
      isOnline: true,
    },
    device: { id: "DVC-3005", name: "Energy Meter" },
    notification: false,
    joiningDate: "01 Jan 2025",
    expiryDate: "01 Jan 2026",
    status: "Pending",
    role: "Viewer",
  },
];

export async function fetchDeviceRequests(
  tabType: TabType,
): Promise<DeviceAccessRequest[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return filtered mock data
  return DUMMY_REQUESTS.filter((req) => req.type === tabType);
}
