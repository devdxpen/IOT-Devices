import { mockDeviceSummaries } from "@/data/mockDeviceSummaries";
import type { DeviceSummary } from "@/types";

export type AnalyticsFunctionality =
  | "Monitoring"
  | "Security"
  | "Control"
  | "Energy";
type FunctionalityType = AnalyticsFunctionality;

export interface AnalyticsFilters {
  year: "2024" | "2025" | "2026";
  company: string;
  location: string;
  deviceType: string;
  status: "all" | "online" | "offline";
  ownership: "all" | "own" | "shared";
  functionality: "all" | AnalyticsFunctionality;
}

export interface AnalyticsFilterOptions {
  companies: string[];
  locations: string[];
  deviceTypes: string[];
  functionalities: AnalyticsFunctionality[];
}

interface MetricSummary {
  totalUsers: number;
  avgUptime: number;
  avgRetentionMinutes: number;
  avgUsagePercent: number;
}

interface UserStat {
  name: string;
  avatarUrl: string;
  devices: number;
  onlineDevices: number;
  avgUptime: number;
  retentionMinutes: number;
  usagePercent: number;
  dominantFunctionality: FunctionalityType;
  functionalityBreakdown: Record<FunctionalityType, number>;
}

interface CompanyStat {
  company: string;
  devicesUnderCompany: number;
  usersUnderCompany: number;
  onlineDevices: number;
  avgUptime: number;
  retentionMinutes: number;
  usagePercent: number;
  dominantFunctionality: FunctionalityType;
  functionalityBreakdown: Record<FunctionalityType, number>;
}

interface RankEntry {
  rank: number;
  name: string;
  role: string;
  uptime: string;
  retention: string;
  functionality: string;
}

interface TopCompanyEntry {
  rank: number;
  name: string;
  users: number;
  devices: number;
  usagePercent: number;
}

interface UserTableRow {
  id: string;
  username: string;
  role: string;
  avgUptime: string;
  retentionTime: string;
  functionalityUsage: string;
  usageScore: string;
}

interface CompanyTableRow {
  id: string;
  company: string;
  usersUnderCompany: string;
  devicesUnderCompany: string;
  retentionTime: string;
  usage: string;
  lastActive: string;
}

export interface UserDashboardDerivedData {
  metrics: MetricSummary;
  uptimeDistribution: Array<{ name: string; value: number; color: string }>;
  retentionByUser: Array<{ label: string; retentionHours: number }>;
  functionalityUsageByUser: Array<
    {
      label: string;
    } & Record<Lowercase<FunctionalityType>, number>
  >;
  topUsersByUsage: RankEntry[];
  topUsersByUptime: RankEntry[];
  topUsersByRetention: RankEntry[];
  usersByFunctionality: Array<{ name: string; value: number }>;
  userTableRows: UserTableRow[];
}

export interface CompanyDashboardDerivedData {
  totalCompanies: number;
  totalUsersUnderCompany: number;
  totalDevicesUnderCompany: number;
  avgRetentionMinutes: number;
  avgUsagePercent: number;
  usersUnderCompanySplit: Array<{ name: string; value: number; color: string }>;
  retentionByCompany: Array<{ label: string; retentionHours: number }>;
  usageByCompany: Array<{ label: string; usage: number }>;
  topCompanies: TopCompanyEntry[];
  devicesByFunctionality: Array<{ name: string; value: number; color: string }>;
  companyTableRows: CompanyTableRow[];
}

interface DeviceMetricSummary {
  totalDevices: number;
  activeDevices: number;
  newlyAddedDevices: number;
  inactiveDevices: number;
  faultyDevices: number;
  totalDataUsageGb: number;
}

interface DeviceTableRow {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  category: string;
  location: string;
  userCount: number;
  assignedUser: string;
  manufacturerModel: string;
  firmwareVersion: string;
  macAddress: string;
  alarms: number;
  usageScore: number;
}

export interface DeviceDashboardDerivedData {
  metrics: DeviceMetricSummary;
  bandwidthAndUsageTrend: Array<{
    month: string;
    bandwidthMbps: number;
    deviceUsageMbps: number;
  }>;
  yearOverYearGrowth: Array<{
    month: string;
    activeDevices: number;
    disabled: number;
  }>;
  topDeviceScores: Array<{ name: string; score: number }>;
  topDeviceTableRows: DeviceTableRow[];
}

const functionalityOrder: FunctionalityType[] = [
  "Monitoring",
  "Security",
  "Control",
  "Energy",
];

const piePalette = ["#1d9bf0", "#69b5ea", "#a8d2f3", "#d7e9f8"];

export const defaultAnalyticsFilters: AnalyticsFilters = {
  year: "2025",
  company: "all",
  location: "all",
  deviceType: "all",
  status: "all",
  ownership: "all",
  functionality: "all",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number, precision = 1) {
  const scale = 10 ** precision;
  return Math.round(value * scale) / scale;
}

function shortLabel(value: string) {
  return value.length <= 12 ? value : `${value.slice(0, 12)}...`;
}

function formatPercent(value: number) {
  return `${round(value, 1)}%`;
}

function formatDuration(minutes: number) {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;

  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

function roleByFunctionality(functionality: FunctionalityType) {
  if (functionality === "Security") return "Security Manager";
  if (functionality === "Control") return "Operations Manager";
  if (functionality === "Energy") return "Energy Manager";
  return "Monitoring Manager";
}

function identifyFunctionality(device: DeviceSummary): FunctionalityType {
  const type = device.type.toLowerCase();
  const category = device.category.toLowerCase();
  const subCategory = device.subCategory.toLowerCase();

  if (type.includes("motion") || category.includes("security")) {
    return "Security";
  }

  if (
    type.includes("valve") ||
    subCategory.includes("water") ||
    subCategory.includes("hvac")
  ) {
    return "Control";
  }

  if (
    type.includes("energy") ||
    type.includes("power") ||
    category.includes("energy")
  ) {
    return "Energy";
  }

  return "Monitoring";
}

function applyAnalyticsFilters(
  devices: DeviceSummary[],
  filters?: AnalyticsFilters,
) {
  if (!filters) return devices;

  return devices.filter((device) => {
    if (filters.company !== "all" && device.company !== filters.company) {
      return false;
    }

    if (filters.location !== "all" && device.location !== filters.location) {
      return false;
    }

    if (filters.deviceType !== "all" && device.type !== filters.deviceType) {
      return false;
    }

    if (
      filters.status !== "all" &&
      ((filters.status === "online" && !device.isOnline) ||
        (filters.status === "offline" && device.isOnline))
    ) {
      return false;
    }

    if (filters.ownership !== "all" && device.ownership !== filters.ownership) {
      return false;
    }

    if (
      filters.functionality !== "all" &&
      identifyFunctionality(device) !== filters.functionality
    ) {
      return false;
    }

    return true;
  });
}

function safeDevicesWithFallback(filteredDevices: DeviceSummary[]) {
  return filteredDevices.length > 0 ? filteredDevices : mockDeviceSummaries;
}

function calculateDeviceUptime(device: DeviceSummary) {
  const baseScore = 96.4;
  const onlineAdjustment = device.isOnline ? 2.3 : -4.2;
  const alarmPenalty = device.alarms * 0.7;
  const ownershipPenalty = device.ownership === "shared" ? 0.3 : 0;
  return round(
    clamp(
      baseScore + onlineAdjustment - alarmPenalty - ownershipPenalty,
      88,
      99.9,
    ),
  );
}

function estimateRetentionMinutes(avgUptime: number, alarmsPerDevice: number) {
  const base = 170;
  const uptimeBoost = (avgUptime - 90) * 28;
  const alarmPenalty = alarmsPerDevice * 42;
  return Math.round(clamp(base + uptimeBoost - alarmPenalty, 90, 720));
}

function estimateUsagePercent(
  uniqueFunctionalityCount: number,
  avgUptime: number,
  onlineRatio: number,
) {
  const functionalityCoverage = clamp(
    (uniqueFunctionalityCount / 4) * 100,
    0,
    100,
  );
  const uptimeScore = clamp(((avgUptime - 88) / 12) * 100, 0, 100);
  const onlineScore = clamp(onlineRatio * 100, 0, 100);
  const weightedScore =
    functionalityCoverage * 0.42 + uptimeScore * 0.33 + onlineScore * 0.25;

  return round(clamp(weightedScore, 35, 98));
}

function dominantFunctionality(
  counts: Record<FunctionalityType, number>,
): FunctionalityType {
  let selected: FunctionalityType = "Monitoring";
  let maxCount = -1;

  for (const functionality of functionalityOrder) {
    const count = counts[functionality];
    if (count > maxCount) {
      selected = functionality;
      maxCount = count;
    }
  }

  return selected;
}

function createEmptyFunctionalityMap(): Record<FunctionalityType, number> {
  return {
    Monitoring: 0,
    Security: 0,
    Control: 0,
    Energy: 0,
  };
}

function buildUserStats(devices: DeviceSummary[]): UserStat[] {
  const map = new Map<
    string,
    {
      avatarUrl: string;
      devices: number;
      onlineDevices: number;
      totalUptime: number;
      totalAlarms: number;
      functionalityBreakdown: Record<FunctionalityType, number>;
    }
  >();

  for (const device of devices) {
    const key = device.assignedUser.name;
    const existing = map.get(key);
    const functionality = identifyFunctionality(device);
    const uptime = calculateDeviceUptime(device);

    if (!existing) {
      map.set(key, {
        avatarUrl: device.assignedUser.avatarUrl,
        devices: 1,
        onlineDevices: device.isOnline ? 1 : 0,
        totalUptime: uptime,
        totalAlarms: device.alarms,
        functionalityBreakdown: {
          Monitoring: functionality === "Monitoring" ? 1 : 0,
          Security: functionality === "Security" ? 1 : 0,
          Control: functionality === "Control" ? 1 : 0,
          Energy: functionality === "Energy" ? 1 : 0,
        },
      });
      continue;
    }

    existing.devices += 1;
    existing.onlineDevices += device.isOnline ? 1 : 0;
    existing.totalUptime += uptime;
    existing.totalAlarms += device.alarms;
    existing.functionalityBreakdown[functionality] += 1;
  }

  return Array.from(map.entries()).map(([name, aggregate]) => {
    const avgUptime = round(aggregate.totalUptime / aggregate.devices);
    const alarmsPerDevice = aggregate.totalAlarms / aggregate.devices;
    const retentionMinutes = estimateRetentionMinutes(
      avgUptime,
      alarmsPerDevice,
    );
    const usagePercent = estimateUsagePercent(
      functionalityOrder.filter(
        (functionality) => aggregate.functionalityBreakdown[functionality] > 0,
      ).length,
      avgUptime,
      aggregate.onlineDevices / aggregate.devices,
    );

    return {
      name,
      avatarUrl: aggregate.avatarUrl,
      devices: aggregate.devices,
      onlineDevices: aggregate.onlineDevices,
      avgUptime,
      retentionMinutes,
      usagePercent,
      dominantFunctionality: dominantFunctionality(
        aggregate.functionalityBreakdown,
      ),
      functionalityBreakdown: aggregate.functionalityBreakdown,
    };
  });
}

function buildCompanyStats(devices: DeviceSummary[]): CompanyStat[] {
  const map = new Map<
    string,
    {
      devicesUnderCompany: number;
      usersUnderCompany: number;
      onlineDevices: number;
      totalUptime: number;
      totalAlarms: number;
      functionalityBreakdown: Record<FunctionalityType, number>;
      newestTimestamp: string;
    }
  >();

  for (const device of devices) {
    const key = device.company;
    const existing = map.get(key);
    const functionality = identifyFunctionality(device);
    const uptime = calculateDeviceUptime(device);

    if (!existing) {
      map.set(key, {
        devicesUnderCompany: 1,
        usersUnderCompany: device.userCount,
        onlineDevices: device.isOnline ? 1 : 0,
        totalUptime: uptime,
        totalAlarms: device.alarms,
        functionalityBreakdown: {
          Monitoring: functionality === "Monitoring" ? 1 : 0,
          Security: functionality === "Security" ? 1 : 0,
          Control: functionality === "Control" ? 1 : 0,
          Energy: functionality === "Energy" ? 1 : 0,
        },
        newestTimestamp: device.lastDataTimestamp,
      });
      continue;
    }

    existing.devicesUnderCompany += 1;
    existing.usersUnderCompany += device.userCount;
    existing.onlineDevices += device.isOnline ? 1 : 0;
    existing.totalUptime += uptime;
    existing.totalAlarms += device.alarms;
    existing.functionalityBreakdown[functionality] += 1;
    if (device.lastDataTimestamp > existing.newestTimestamp) {
      existing.newestTimestamp = device.lastDataTimestamp;
    }
  }

  return Array.from(map.entries()).map(([company, aggregate]) => {
    const avgUptime = round(
      aggregate.totalUptime / aggregate.devicesUnderCompany,
    );
    const alarmsPerDevice =
      aggregate.totalAlarms / aggregate.devicesUnderCompany;
    const retentionMinutes = estimateRetentionMinutes(
      avgUptime,
      alarmsPerDevice,
    );
    const usagePercent = estimateUsagePercent(
      functionalityOrder.filter(
        (functionality) => aggregate.functionalityBreakdown[functionality] > 0,
      ).length,
      avgUptime,
      aggregate.onlineDevices / aggregate.devicesUnderCompany,
    );

    return {
      company,
      devicesUnderCompany: aggregate.devicesUnderCompany,
      usersUnderCompany: aggregate.usersUnderCompany,
      onlineDevices: aggregate.onlineDevices,
      avgUptime,
      retentionMinutes,
      usagePercent,
      dominantFunctionality: dominantFunctionality(
        aggregate.functionalityBreakdown,
      ),
      functionalityBreakdown: aggregate.functionalityBreakdown,
    };
  });
}

function addRanking<T>(rows: T[]): Array<T & { rank: number }> {
  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

export function getAnalyticsFilterOptions(): AnalyticsFilterOptions {
  const companies = Array.from(
    new Set(mockDeviceSummaries.map((device) => device.company)),
  ).sort();
  const locations = Array.from(
    new Set(mockDeviceSummaries.map((device) => device.location)),
  ).sort();
  const deviceTypes = Array.from(
    new Set(mockDeviceSummaries.map((device) => device.type)),
  ).sort();

  return {
    companies,
    locations,
    deviceTypes,
    functionalities: [...functionalityOrder],
  };
}

function calculateDataUsageGb(device: DeviceSummary) {
  const t1 = Math.abs(device.data.t1);
  const t2 = Math.abs(device.data.t2);
  const t3 = Math.abs(device.data.t3);
  return round((t1 * 0.03 + t2 * 0.02 + t3 * 0.015) * 1.4, 2);
}

function calculateDeviceUsageScore(device: DeviceSummary) {
  const telemetryDensity = Math.abs(device.data.t1) + Math.abs(device.data.t2);
  const telemetryFactor = clamp(telemetryDensity / 12, 0, 18);
  const onlineFactor = device.isOnline ? 26 : -18;
  const alarmPenalty = device.alarms * 4.5;
  const ownershipPenalty = device.ownership === "shared" ? 2.5 : 0;

  return round(
    clamp(
      58 + telemetryFactor + onlineFactor - alarmPenalty - ownershipPenalty,
      20,
      98,
    ),
    0,
  );
}

export function getUserDashboardData(
  filters?: AnalyticsFilters,
): UserDashboardDerivedData {
  const filteredDevices = safeDevicesWithFallback(
    applyAnalyticsFilters(mockDeviceSummaries, filters),
  );
  const users = buildUserStats(filteredDevices);

  const metrics: MetricSummary = {
    totalUsers: users.length,
    avgUptime: round(
      users.reduce((sum, user) => sum + user.avgUptime, 0) /
        Math.max(users.length, 1),
    ),
    avgRetentionMinutes: Math.round(
      users.reduce((sum, user) => sum + user.retentionMinutes, 0) /
        Math.max(users.length, 1),
    ),
    avgUsagePercent: round(
      users.reduce((sum, user) => sum + user.usagePercent, 0) /
        Math.max(users.length, 1),
    ),
  };

  const uptimeDistribution = [
    {
      name: "High (>=98%)",
      value: users.filter((user) => user.avgUptime >= 98).length,
      color: "#10b981",
    },
    {
      name: "Stable (95-98%)",
      value: users.filter((user) => user.avgUptime >= 95 && user.avgUptime < 98)
        .length,
      color: "#38bdf8",
    },
    {
      name: "Needs Attention (<95%)",
      value: users.filter((user) => user.avgUptime < 95).length,
      color: "#f97316",
    },
  ];

  const retentionByUser = users.map((user) => ({
    label: shortLabel(user.name),
    retentionHours: round(user.retentionMinutes / 60, 2),
  }));

  const functionalityUsageByUser = users.map((user) => ({
    label: shortLabel(user.name),
    monitoring: round(
      (user.functionalityBreakdown.Monitoring / user.devices) * 100,
      0,
    ),
    security: round(
      (user.functionalityBreakdown.Security / user.devices) * 100,
      0,
    ),
    control: round(
      (user.functionalityBreakdown.Control / user.devices) * 100,
      0,
    ),
    energy: round((user.functionalityBreakdown.Energy / user.devices) * 100, 0),
  }));

  const usersByFunctionalityAccumulator = createEmptyFunctionalityMap();
  for (const user of users) {
    for (const functionality of functionalityOrder) {
      usersByFunctionalityAccumulator[functionality] +=
        user.functionalityBreakdown[functionality];
    }
  }

  const totalFunctionalityEvents = functionalityOrder.reduce(
    (sum, functionality) =>
      sum + usersByFunctionalityAccumulator[functionality],
    0,
  );

  const usersByFunctionality = functionalityOrder.map((functionality) => ({
    name: functionality,
    value: round(
      (usersByFunctionalityAccumulator[functionality] /
        Math.max(totalFunctionalityEvents, 1)) *
        100,
      0,
    ),
  }));

  const topUsersByUsage = addRanking(
    [...users]
      .sort((a, b) => b.usagePercent - a.usagePercent)
      .slice(0, 5)
      .map((user) => ({
        name: user.name,
        role: roleByFunctionality(user.dominantFunctionality),
        uptime: formatPercent(user.avgUptime),
        retention: formatDuration(user.retentionMinutes),
        functionality: user.dominantFunctionality,
      })),
  );

  const topUsersByUptime = addRanking(
    [...users]
      .sort((a, b) => b.avgUptime - a.avgUptime)
      .slice(0, 5)
      .map((user) => ({
        name: user.name,
        role: roleByFunctionality(user.dominantFunctionality),
        uptime: formatPercent(user.avgUptime),
        retention: formatDuration(user.retentionMinutes),
        functionality: user.dominantFunctionality,
      })),
  );

  const topUsersByRetention = addRanking(
    [...users]
      .sort((a, b) => b.retentionMinutes - a.retentionMinutes)
      .slice(0, 5)
      .map((user) => ({
        name: user.name,
        role: roleByFunctionality(user.dominantFunctionality),
        uptime: formatPercent(user.avgUptime),
        retention: formatDuration(user.retentionMinutes),
        functionality: user.dominantFunctionality,
      })),
  );

  const userTableRows = users
    .sort((a, b) => b.usagePercent - a.usagePercent)
    .map((user, index) => ({
      id: `user-${index + 1}`,
      username: user.name,
      role: roleByFunctionality(user.dominantFunctionality),
      avgUptime: formatPercent(user.avgUptime),
      retentionTime: formatDuration(user.retentionMinutes),
      functionalityUsage: user.dominantFunctionality,
      usageScore: formatPercent(user.usagePercent),
    }));

  return {
    metrics,
    uptimeDistribution,
    retentionByUser,
    functionalityUsageByUser,
    topUsersByUsage,
    topUsersByUptime,
    topUsersByRetention,
    usersByFunctionality,
    userTableRows,
  };
}

export function getCompanyDashboardData(
  filters?: AnalyticsFilters,
): CompanyDashboardDerivedData {
  const filteredDevices = safeDevicesWithFallback(
    applyAnalyticsFilters(mockDeviceSummaries, filters),
  );
  const companies = buildCompanyStats(filteredDevices).sort(
    (a, b) => b.devicesUnderCompany - a.devicesUnderCompany,
  );

  const totalUsersUnderCompany = companies.reduce(
    (sum, company) => sum + company.usersUnderCompany,
    0,
  );
  const totalDevicesUnderCompany = companies.reduce(
    (sum, company) => sum + company.devicesUnderCompany,
    0,
  );

  const avgRetentionMinutes = Math.round(
    companies.reduce((sum, company) => sum + company.retentionMinutes, 0) /
      Math.max(companies.length, 1),
  );
  const avgUsagePercent = round(
    companies.reduce((sum, company) => sum + company.usagePercent, 0) /
      Math.max(companies.length, 1),
  );

  const splitSeed = [...companies]
    .sort((a, b) => b.usersUnderCompany - a.usersUnderCompany)
    .slice(0, 3);
  const coveredUsers = splitSeed.reduce(
    (sum, company) => sum + company.usersUnderCompany,
    0,
  );
  const remainingUsers = totalUsersUnderCompany - coveredUsers;

  const usersUnderCompanySplit = splitSeed.map((company, index) => ({
    name: company.company,
    value: round(
      (company.usersUnderCompany / Math.max(totalUsersUnderCompany, 1)) * 100,
      0,
    ),
    color: piePalette[index],
  }));

  if (remainingUsers > 0) {
    usersUnderCompanySplit.push({
      name: "Others",
      value: round(
        (remainingUsers / Math.max(totalUsersUnderCompany, 1)) * 100,
        0,
      ),
      color: piePalette[3],
    });
  }

  const retentionByCompany = companies.map((company) => ({
    label: shortLabel(company.company),
    retentionHours: round(company.retentionMinutes / 60, 2),
  }));

  const usageByCompany = companies.map((company) => ({
    label: shortLabel(company.company),
    usage: company.usagePercent,
  }));

  const functionalityTotals = createEmptyFunctionalityMap();
  for (const company of companies) {
    for (const functionality of functionalityOrder) {
      functionalityTotals[functionality] +=
        company.functionalityBreakdown[functionality];
    }
  }

  const devicesByFunctionality = functionalityOrder.map(
    (functionality, index) => ({
      name: functionality,
      value: functionalityTotals[functionality],
      color: piePalette[index],
    }),
  );

  const topCompanies = addRanking(
    companies.slice(0, 5).map((company) => ({
      name: company.company,
      users: company.usersUnderCompany,
      devices: company.devicesUnderCompany,
      usagePercent: company.usagePercent,
    })),
  );

  const companyTableRows = companies.map((company, index) => ({
    id: `company-${index + 1}`,
    company: company.company,
    usersUnderCompany: String(company.usersUnderCompany),
    devicesUnderCompany: String(company.devicesUnderCompany),
    retentionTime: formatDuration(company.retentionMinutes),
    usage: formatPercent(company.usagePercent),
    lastActive: company.onlineDevices > 0 ? "Live data" : "No recent data",
  }));

  return {
    totalCompanies: companies.length,
    totalUsersUnderCompany,
    totalDevicesUnderCompany,
    avgRetentionMinutes,
    avgUsagePercent,
    usersUnderCompanySplit,
    retentionByCompany,
    usageByCompany,
    topCompanies,
    devicesByFunctionality,
    companyTableRows,
  };
}

export function getDeviceDashboardData(
  filters?: AnalyticsFilters,
): DeviceDashboardDerivedData {
  const devices = [
    ...safeDevicesWithFallback(
      applyAnalyticsFilters(mockDeviceSummaries, filters),
    ),
  ];
  const totalDevices = devices.length;
  const activeDevices = devices.filter((device) => device.isOnline).length;
  const inactiveDevices = totalDevices - activeDevices;
  const newlyAddedDevices = devices.filter(
    (device) => (device.position ?? Number.MAX_SAFE_INTEGER) <= 3,
  ).length;
  const faultyDevices = devices.filter((device) => device.alarms >= 2).length;
  const totalDataUsageGb = round(
    devices.reduce((sum, device) => sum + calculateDataUsageGb(device), 0),
    1,
  );

  const metrics: DeviceMetricSummary = {
    totalDevices,
    activeDevices,
    newlyAddedDevices,
    inactiveDevices,
    faultyDevices,
    totalDataUsageGb,
  };

  const monthFactors = [
    0.88, 0.94, 0.9, 1.02, 1.08, 1.05, 0.78, 0.8, 0.83, 0.92, 0.85, 0.79,
  ];
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const baseBandwidth = Math.max(6.5, activeDevices * 1.35);
  const bandwidthAndUsageTrend = monthLabels.map((month, index) => {
    const bandwidth = round(baseBandwidth * monthFactors[index], 1);
    const usage = round(bandwidth * 0.63 - inactiveDevices * 0.2, 1);
    return {
      month,
      bandwidthMbps: bandwidth,
      deviceUsageMbps: Math.max(1, usage),
    };
  });

  const yearOverYearGrowth = monthLabels.map((month, index) => {
    const seasonal = monthFactors[index];
    const activeProjection = Math.round(
      clamp(activeDevices * (0.82 + seasonal * 0.32), 1, totalDevices),
    );
    const disabledProjection = Math.max(0, totalDevices - activeProjection);
    return {
      month,
      activeDevices: activeProjection,
      disabled: disabledProjection,
    };
  });

  const topByScore = devices
    .map((device) => ({
      ...device,
      score: calculateDeviceUsageScore(device),
    }))
    .sort((a, b) => b.score - a.score);

  const topDeviceScores = topByScore.slice(0, 5).map((device) => ({
    name: shortLabel(device.name),
    score: device.score,
  }));

  const topDeviceTableRows = topByScore.slice(0, 5).map((device) => ({
    id: device.id,
    name: device.name,
    type: device.type,
    serialNumber: device.serialNumber,
    category: device.category,
    location: device.location,
    userCount: device.userCount,
    assignedUser: device.assignedUser.name,
    manufacturerModel: `${device.manufacturer} - ${device.model}`,
    firmwareVersion: device.firmwareVersion,
    macAddress: device.macAddress,
    alarms: device.alarms,
    usageScore: device.score,
  }));

  return {
    metrics,
    bandwidthAndUsageTrend,
    yearOverYearGrowth,
    topDeviceScores,
    topDeviceTableRows,
  };
}

export function formatMinutesAsDuration(minutes: number) {
  return formatDuration(minutes);
}
