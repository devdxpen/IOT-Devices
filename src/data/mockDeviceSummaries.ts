import { deviceLocations } from "@/constants/deviceLocations";
import { DeviceSummary } from "@/types";

const locationOptions = deviceLocations.filter((location) => location.value !== "all");

export const mockDeviceSummaries: DeviceSummary[] = Array.from({ length: 9 }, (_, i) => ({
  id: `device-${i}`,
  name: "SENSOR-001",
  type: "Temperature Sensor",
  serialNumber: "SN-98234761234",
  location: locationOptions[i % locationOptions.length]?.value ?? "unknown",
  category: "Industrial IoT",
  subCategory: "Ahmedabad iot",
  users: ["/user1.jpg", "/user2.jpg", "/user3.jpg"],
  userCount: 5,
  manufacturer: "SensoriX Technologies",
  model: "TX-500",
  firmwareVersion: "Update v2.4.1",
  macAddress: "00:1B:44:11:3A:B7",
  icon: "/sensor-icon.png",
}));
