import { Template } from "@/types/template";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let localTemplates: Template[] = [
  {
    id: "tpl-l1",
    templateName: "Security Camera",
    templateCode: "SEC-CAM-001",
    templateTags: ["security", "camera", "surveillance"],
    version: "1.2.0",
    lastUpdateDetails: "Added night vision support",
    typeOfTemplate: "Device Monitoring",
    status: "active",
    brandName: "HikVision",
    modelNo: "DS-2CD2143",
    iconLogo: "",
    gatewayDetails: "WiFi Gateway v2",
    gatewayModelNo: "GW-200",
    projectCode: "PRJ-SEC-01",
    description: "Surveillance camera template for indoor/outdoor monitoring",
    coverPage:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=200&auto=format&fit=crop",
    graphicalCanvas: "canvas-data-v1.json",
    activationDate: "10-July-2025",
    globalStatus: "local_only",
    source: "local",
  },
  {
    id: "tpl-l2",
    templateName: "Temperature Sensor",
    templateCode: "TEMP-SEN-002",
    templateTags: ["temperature", "sensor", "environment"],
    version: "2.0.1",
    lastUpdateDetails: "Calibration update",
    typeOfTemplate: "Data Collection",
    status: "active",
    brandName: "SensorTech",
    modelNo: "ST-TMP-400",
    iconLogo: "",
    gatewayDetails: "Zigbee Hub",
    gatewayModelNo: "ZB-100",
    projectCode: "PRJ-ENV-03",
    description: "Industrial temperature monitoring sensor",
    activationDate: "15-June-2025",
    globalStatus: "global_live",
    source: "local",
  },
  {
    id: "tpl-l3",
    templateName: "Smart Doorbell",
    templateCode: "DOOR-BEL-003",
    templateTags: ["doorbell", "smart-home", "video"],
    version: "1.0.0",
    lastUpdateDetails: "Initial release",
    typeOfTemplate: "Automation",
    status: "draft",
    brandName: "RingPro",
    modelNo: "RP-DB-500",
    iconLogo: "",
    gatewayDetails: "WiFi Direct",
    gatewayModelNo: "N/A",
    projectCode: "PRJ-HOME-05",
    description: "Video doorbell with motion detection",
    activationDate: "20-Aug-2025",
    globalStatus: "local_only",
    source: "local",
  },
  {
    id: "tpl-l4",
    templateName: "Air Quality Monitor",
    templateCode: "AIR-MON-004",
    templateTags: ["air-quality", "environment", "PM2.5"],
    version: "1.1.0",
    lastUpdateDetails: "Added CO2 tracking",
    typeOfTemplate: "Data Collection",
    status: "active",
    brandName: "AirSense",
    modelNo: "AS-AQM-300",
    iconLogo: "",
    gatewayDetails: "LoRa Gateway",
    gatewayModelNo: "LR-GW-50",
    projectCode: "PRJ-ENV-07",
    description: "Monitors PM2.5, CO2, humidity, and temperature",
    activationDate: "05-May-2025",
    globalStatus: "request_for_global",
    source: "local",
  },
  {
    id: "tpl-l5",
    templateName: "Water Level Sensor",
    templateCode: "WTR-LVL-005",
    templateTags: ["water", "level", "tank", "agriculture"],
    version: "1.3.2",
    lastUpdateDetails: "Improved accuracy",
    typeOfTemplate: "Data Collection",
    status: "active",
    brandName: "AquaTech",
    modelNo: "AT-WL-220",
    iconLogo: "",
    gatewayDetails: "WiFi Gateway v3",
    gatewayModelNo: "GW-300",
    projectCode: "PRJ-AGR-02",
    description: "Water tank level monitoring for agriculture",
    activationDate: "12-Apr-2025",
    globalStatus: "global_live",
    source: "local",
  },
  {
    id: "tpl-l6",
    templateName: "Smoke Detector",
    templateCode: "SMK-DET-006",
    templateTags: ["smoke", "fire", "safety"],
    version: "2.1.0",
    lastUpdateDetails: "Battery optimization",
    typeOfTemplate: "Automation",
    status: "active",
    brandName: "FireGuard",
    modelNo: "FG-SD-800",
    iconLogo: "",
    gatewayDetails: "Z-Wave Hub",
    gatewayModelNo: "ZW-HUB-10",
    projectCode: "PRJ-SAFE-01",
    description: "Smart smoke and fire detection system",
    activationDate: "18-Mar-2025",
    globalStatus: "request_for_global",
    source: "local",
  },
];

let globalTemplates: Template[] = [
  {
    id: "tpl-g1",
    templateName: "Industrial Motor Sensor",
    templateCode: "IND-MOT-G01",
    templateTags: ["motor", "vibration", "industrial"],
    version: "3.0.0",
    lastUpdateDetails: "Predictive maintenance AI",
    typeOfTemplate: "Device Monitoring",
    status: "active",
    brandName: "MotorSense",
    modelNo: "MS-IND-900",
    iconLogo: "",
    gatewayDetails: "Industrial Edge Gateway",
    gatewayModelNo: "IEG-500",
    projectCode: "PRJ-IND-G01",
    description: "Motor vibration and health monitoring template",
    activationDate: "01-Jan-2025",
    globalStatus: "global_live",
    source: "global",
  },
  {
    id: "tpl-g2",
    templateName: "Fleet GPS Tracker",
    templateCode: "FLT-GPS-G02",
    templateTags: ["GPS", "fleet", "tracking", "vehicle"],
    version: "2.5.1",
    lastUpdateDetails: "Geofencing support",
    typeOfTemplate: "Data Collection",
    status: "active",
    brandName: "TrackPro",
    modelNo: "TP-GPS-700",
    iconLogo: "",
    gatewayDetails: "Cellular Modem",
    gatewayModelNo: "CM-4G-20",
    projectCode: "PRJ-FLT-G03",
    description: "Vehicle GPS positioning and route tracking",
    activationDate: "15-Feb-2025",
    globalStatus: "global_live",
    source: "global",
  },
  {
    id: "tpl-g3",
    templateName: "Solar Panel Monitor",
    templateCode: "SOL-PNL-G03",
    templateTags: ["solar", "energy", "renewable"],
    version: "1.8.0",
    lastUpdateDetails: "Efficiency analytics dashboard",
    typeOfTemplate: "Reporting",
    status: "active",
    brandName: "SolarEdge",
    modelNo: "SE-MON-350",
    iconLogo: "",
    gatewayDetails: "WiFi Gateway v3",
    gatewayModelNo: "GW-300",
    projectCode: "PRJ-SOL-G02",
    description: "Solar panel performance and energy output monitoring",
    activationDate: "20-Mar-2025",
    globalStatus: "global_live",
    source: "global",
  },
  {
    id: "tpl-g4",
    templateName: "Cold Storage Monitor",
    templateCode: "CLD-STR-G04",
    templateTags: ["cold-storage", "temperature", "pharma"],
    version: "2.0.0",
    lastUpdateDetails: "FDA compliance report",
    typeOfTemplate: "Data Collection",
    status: "active",
    brandName: "ColdChain",
    modelNo: "CC-MON-450",
    iconLogo: "",
    gatewayDetails: "LoRa Gateway",
    gatewayModelNo: "LR-GW-50",
    projectCode: "PRJ-PHA-G01",
    description: "Pharmaceutical cold storage temperature compliance",
    activationDate: "08-Apr-2025",
    globalStatus: "global_live",
    source: "global",
  },
];

export async function fetchTemplates(
  source?: "local" | "global",
): Promise<Template[]> {
  await delay(600);
  if (source === "local") return [...localTemplates];
  if (source === "global") return [...globalTemplates];
  return [...localTemplates, ...globalTemplates];
}

export async function getTemplateStats(source?: "local" | "global") {
  await delay(300);

  if (source === "local") {
    return {
      total: localTemplates.length,
      active: localTemplates.filter((t) => t.globalStatus === "global_live")
        .length,
      inactive: localTemplates.filter(
        (t) => t.globalStatus === "request_for_global",
      ).length,
    };
  }

  if (source === "global") {
    return {
      total: globalTemplates.length,
      active: globalTemplates.filter((t) => t.status === "active").length,
      inactive: globalTemplates.filter((t) => t.status !== "active").length,
    };
  }

  const all = [...localTemplates, ...globalTemplates];
  return {
    total: all.length,
    active: all.filter((t) => t.status === "active").length,
    inactive: all.filter((t) => t.status !== "active").length,
  };
}

export async function getTemplateById(
  id: string,
): Promise<Template | undefined> {
  await delay(300);
  const all = [...localTemplates, ...globalTemplates];
  return all.find((t) => t.id === id);
}

export async function createTemplate(
  data: Partial<Template>,
  source: "local" | "global" = "local",
): Promise<Template> {
  await delay(500);
  const newTemplate: Template = {
    ...data,
    id: `tpl-${source.charAt(0)}${Date.now()}`,
    source,
    globalStatus: source === "local" ? "local_only" : "global_live",
  } as Template;

  if (source === "local") {
    localTemplates = [newTemplate, ...localTemplates];
  } else {
    globalTemplates = [newTemplate, ...globalTemplates];
  }

  return newTemplate;
}

export async function updateTemplate(
  id: string,
  data: Partial<Template>,
): Promise<Template | undefined> {
  await delay(500);

  let targetIndex = localTemplates.findIndex((t) => t.id === id);
  if (targetIndex !== -1) {
    localTemplates[targetIndex] = { ...localTemplates[targetIndex], ...data };
    return localTemplates[targetIndex];
  }

  targetIndex = globalTemplates.findIndex((t) => t.id === id);
  if (targetIndex !== -1) {
    globalTemplates[targetIndex] = { ...globalTemplates[targetIndex], ...data };
    return globalTemplates[targetIndex];
  }

  return undefined;
}

export async function deleteTemplate(id: string): Promise<boolean> {
  await delay(400);
  const initialLocalLength = localTemplates.length;
  localTemplates = localTemplates.filter((t) => t.id !== id);

  if (localTemplates.length < initialLocalLength) return true;

  const initialGlobalLength = globalTemplates.length;
  globalTemplates = globalTemplates.filter((t) => t.id !== id);

  return globalTemplates.length < initialGlobalLength;
}
