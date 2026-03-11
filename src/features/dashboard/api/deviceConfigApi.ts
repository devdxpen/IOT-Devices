import { DeviceConfigState } from "../contexts/DeviceConfigContext";

const mockTemplates = [
  {
    id: "t1",
    name: "Alpha Temp Sensor V1",
    brand: "Acme Corp",
    model: "T-100",
    scope: "global",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  },
  {
    id: "t2",
    name: "Beta Humidity Monitor",
    brand: "GlobalTech",
    model: "H-200",
    scope: "global",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  },
  {
    id: "t3",
    name: "Delta Pressure Sensor",
    brand: "SensoriX",
    model: "TX-500",
    scope: "global",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  },
  {
    id: "t4",
    name: "Gamma Light Controller",
    brand: "NetSys",
    model: "LC-300",
    scope: "global",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  },
  {
    id: "t5",
    name: "Local Gateway Pro",
    brand: "NetSys",
    model: "GW-P1",
    scope: "local",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  },
];

const mockInitialState: DeviceConfigState = {
  id: "device-123",
  general: {
    brand: "SenseTech",
    model: "ST-Air-4T",
    serial: "ST1029384",
    deviceName: "Main Office Sensor",
    mac: "00:1B:44:11:3A:B7",
    industry: "Building Management",
    category: "Air Quality",
    cluster: "HQ Building",
    group: "Floor 2",
    description: "Monitoring ambient temp and humidity in main workspace.",
    isActive: true,
    templateId: "t1",
  },
  connection: {
    protocol: "MQTT",
    format: "JSON",
    brokerUrl: "mqtt.broker.com",
    port: "1883",
    authType: "Bearer",
  },
  tags: [
    {
      id: 1,
      tagNo: "TAG-001",
      deviceId: "SLV-1",
      functionCode: "FC3 - Read Holding",
      tagAddress: "40001",
      dataType: "UInt16",
      decimalPoint: "0",
      noOfDigits: "4",
      endian: "Big Endian",
    },
    {
      id: 2,
      tagNo: "TAG-002",
      deviceId: "SLV-1",
      functionCode: "FC4 - Read Input",
      tagAddress: "30001",
      dataType: "Float32",
      decimalPoint: "2",
      noOfDigits: "6",
      endian: "Little Endian",
    },
  ],
  alarms: [
    {
      id: 1,
      name: "High Temperature Alert",
      tag: "TAG-001",
      valueLow: "20",
      conditionLow: "< (Less Than)",
      valueHigh: "85",
      conditionHigh: "> (Greater Than)",
      type: "Critical",
      isActive: true,
      maskTime: "60",
      notification: ["Email", "Mobile App Notification"],
    },
    {
      id: 2,
      name: "Low Voltage Warning",
      tag: "TAG-002",
      valueLow: "11.5",
      conditionLow: "< (Less Than)",
      valueHigh: "14",
      conditionHigh: "> (Greater Than)",
      type: "Warning",
      isActive: false,
      maskTime: "120",
      notification: ["SMS"],
    },
  ],
  parameters: [
    {
      id: "1",
      tagNo: "T1",
      tagName: "Tag 1",
      reportName: "Temperature",
      offset: "0",
      minData: "0",
      maxData: "100",
      unit: "Celcisus",
      storage: true,
      showingData: false,
      reportingDetails: "Incremental Data",
    },
    {
      id: "2",
      tagNo: "Temp Alert",
      tagName: "Tag 2",
      reportName: "T2<60",
      offset: "0",
      minData: "0",
      maxData: "100",
      unit: "Calcisus",
      storage: false,
      showingData: false,
      reportingDetails: "Incremental Data",
    },
  ],
  api: {
    triggerType: "interval",
    intervalSeconds: "60",
    primaryProtocol: "mqtt",
    formats: ["JSON"],
    endpoints: [
      {
        id: "ep-1",
        endpointName: "Weather Data Export",
        targetUrl: "https://api.external-system.com/weather",
        httpMethod: "Post",
        syncInterval: "300ms",
        tags: ["T1", "T2", "T3"],
        lastSyncTime: "50 Greater then",
        status: "active",
      },
    ],
  },
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDeviceConfig(
  deviceId: string,
): Promise<DeviceConfigState> {
  await delay(800);
  return { ...mockInitialState, id: deviceId };
}

export async function saveDeviceConfig(
  deviceId: string,
  config: DeviceConfigState,
): Promise<void> {
  await delay(800);
  console.log("Saved device config:", deviceId, config);
}

export async function getDeviceTemplates(): Promise<typeof mockTemplates> {
  await delay(400);
  return [...mockTemplates];
}
