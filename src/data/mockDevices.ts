import { Device } from "@/types";

export const mockDevices: Device[] = [
  {
    id: "1",
    name: "SENSOR-001",
    serialNumber: "SN-98234761234",
    location: "Building A",
    status: "active",
    deviceType: "Temperature Sensor",
    category: "Industrial IoT",
    subCategory: "Ahmedabad iot",
    manufacturer: "SensoriX Technologies",
    model: "TX-500 Series",
    firmwareVersion: "Update v2.4.1",
    macAddress: "00:1B:44:11:3A:B7",
    lastDataTimestamp: "27-07-2025 10:45 AM",
    alarms: 0,
    data: { t1: 50, t2: 90, t3: 12 },
    users: 5,
    assignedUser: {
      name: "Anna Adame",
      avatarUrl: "/avatar.jpg"
    },
    isOnline: true,
    tags: ["Critical", "Floor 1"],
    colorFlag: "green"
  },
  {
    id: "2",
    name: "SENSOR-001",
    serialNumber: "SN-98234761234",
    location: "Building B",
    status: "active",
    deviceType: "Temperature Sensor",
    category: "Industrial IoT",
    subCategory: "Ahmedabad iot",
    manufacturer: "SensoriX Technologies",
    model: "TX-500 Series",
    firmwareVersion: "Update v2.4.1",
    macAddress: "00:1B:44:11:3A:B7",
    lastDataTimestamp: "28-07-2025 10:45 AM",
    alarms: 2,
    data: { t1: 50, t2: 90, t3: 12 },
    users: 5,
    assignedUser: {
      name: "Anna Adame",
      avatarUrl: "/avatar.jpg"
    },
    isOnline: true,
    tags: ["Critical", "Floor 2"],
    colorFlag: "yellow"
  },
  {
    id: "3",
    name: "SENSOR-001",
    serialNumber: "SN-98234761234",
    location: "Building C",
    status: "inactive",
    deviceType: "Temperature Sensor",
    category: "Industrial IoT",
    subCategory: "Ahmedabad iot",
    manufacturer: "SensoriX Technologies",
    model: "TX-500 Series",
    firmwareVersion: "Update v2.4.1",
    macAddress: "00:1B:44:11:3A:B7",
    lastDataTimestamp: "25-07-2025 02:30 PM",
    alarms: 5,
    data: { t1: 25, t2: 45, t3: 8 },
    users: 5,
    assignedUser: {
      name: "Anna Adame",
      avatarUrl: "/avatar.jpg"
    },
    isOnline: false,
    colorFlag: "red"
  },
  {
    id: "4",
    name: "SENSOR-001",
    serialNumber: "SN-98234761234",
    location: "Building D",
    status: "active",
    deviceType: "Temperature Sensor",
    category: "Industrial IoT",
    subCategory: "Ahmedabad iot",
    manufacturer: "SensoriX Technologies",
    model: "TX-500 Series",
    firmwareVersion: "Update v2.4.1",
    macAddress: "00:1B:44:11:3A:B7",
    lastDataTimestamp: "28-07-2025 11:20 AM",
    alarms: 0,
    data: { t1: 65, t2: 72, t3: 58 },
    users: 5,
    assignedUser: {
      name: "Anna Adame",
      avatarUrl: "/avatar.jpg"
    },
    isOnline: true,
    colorFlag: "green"
  }
];

export const locations = ["Building A", "Building B", "Building C", "Building D"];
export const deviceTypes = ["Temperature Sensor", "Humidity Sensor", "Motion Sensor"];
export const categories = ["Industrial IoT", "Gateways", "Environmental"];
export const subCategories = ["Ahmedabad iot", "Mumbai iot", "Delhi iot"];
export const manufacturers = ["SensoriX Technologies", "BridgeCore Systems", "AirSense Corp"];
