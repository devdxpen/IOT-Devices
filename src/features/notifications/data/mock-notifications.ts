import { Notification } from "../types";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    name: "Sensor 1 Notification",
    device: {
      id: "D001",
      name: "SENSOR-001",
      type: "Temperature Sensor",
      image: "/gateway.png",
    },
    userSettings: [
      { userId: "U001", methods: ["SMS", "Email"] },
      { userId: "U002", methods: ["SMS"] },
      { userId: "U003", methods: ["Email"] },
    ],
    alarms: ["Temperature", "Battery"],
    status: true,
    priority: "High",
    createdAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "2",
    name: "Sensor 2 Notification",
    device: {
      id: "D002",
      name: "SENSOR-002",
      type: "Humidity Sensor",
      image: "/gateway.png",
    },
    userSettings: [
      { userId: "U001", methods: ["Push Notification"] },
    ],

    alarms: ["Humidity"],
    status: false,
    priority: "Medium",
    createdAt: "2024-03-21T11:30:00Z",
  },
];


export const mockDevices = [
  { id: "D001", name: "SENSOR-001", type: "Temperature Sensor" },
  { id: "D002", name: "SENSOR-002", type: "Humidity Sensor" },
  { id: "D003", name: "GATEWAY-001", type: "Gateway" },
];

export const mockUsers = [
  { id: "U001", name: "Anna Adame" },
  { id: "U002", name: "Parth Soni" },
  { id: "U003", name: "Chintan Patel" },
];

export const alarmOptions = [
  "Battery Alarm",
  "Temperature Alarm",
  "Disconnect Alarm",
  "Hardware Failure",
];
