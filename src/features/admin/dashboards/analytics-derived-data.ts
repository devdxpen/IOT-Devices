import { snapshotApi } from "@/lib/mock-api/access-control";

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
  id: string;
  name: string;
  avatarUrl: string;
  company: string;
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
  retentionByUserMonthlyStacked: {
    months: string[];
    series: Array<{ name: string; data: number[] }>;
  };
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
  retentionByCompanyMonthlyStacked: {
    months: string[];
    series: Array<{ name: string; data: number[] }>;
  };
  usageByCompany: Array<{ label: string; usage: number }>;
  topCompanies: TopCompanyEntry[];
  devicesByFunctionality: Array<{ name: string; value: number; color: string }>;
  companyTableRows: CompanyTableRow[];
}

interface DeviceMetricSummary {
  totalDevices: number;
  activeDevices: number;
  avgDevicesPerUser: number;
  avgRevenuePerDevice: number;
  avgUptime: number;
  alarmsPerDevice: number;
  totalDataUsageMb: number;
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

export interface BrandModelEntry {
  brand: string;
  model: string;
  count: number;
}

export interface RegionEntry {
  name: string;
  count: number;
}

export interface DeviceDashboardDerivedData {
  metrics: DeviceMetricSummary;
  devicesDataTrend: Array<{
    month: string;
    dataUsageMb: number;
  }>;
  yearOverYearGrowth: Array<{
    month: string;
    activeDevices: number;
    disabled: number;
  }>;
  topIndustries: Array<{ name: string; value: number; color: string }>;
  brandsAndModels: BrandModelEntry[];
  regions: RegionEntry[];
  yearOverYearGrowthArea: Array<{
    month: string;
    now: number;
    past: number;
  }>;
  topDeviceScores: Array<{ name: string; score: number }>;
  topDeviceTableRows: DeviceTableRow[];
}

interface DerivedDevice {
  id: string;
  name: string;
  type: string;
  category: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  firmwareVersion: string;
  macAddress: string;
  location: string;
  company: string;
  companyId: string;
  ownerUserId: string;
  ownerName: string;
  userCount: number;
  isOnline: boolean;
  alarms: number;
  status: "active" | "inactive" | "faulty" | "disabled";
  bandwidthMbps: number;
  dataUsageGb: number;
  createdAt: string;
  functionality: FunctionalityType;
}

const functionalityOrder: FunctionalityType[] = [
  "Monitoring",
  "Security",
  "Control",
  "Energy",
];

const piePalette = ["#1d9bf0", "#69b5ea", "#a8d2f3", "#d7e9f8"];
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

function createEmptyFunctionalityMap(): Record<FunctionalityType, number> {
  return {
    Monitoring: 0,
    Security: 0,
    Control: 0,
    Energy: 0,
  };
}

function identifyFunctionality(type: string): FunctionalityType {
  if (type === "camera") return "Security";
  if (type === "gateway" || type === "controller") return "Control";
  if (type === "meter") return "Energy";
  return "Monitoring";
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

function roleByFunctionality(functionality: FunctionalityType) {
  if (functionality === "Security") return "Security Manager";
  if (functionality === "Control") return "Operations Manager";
  if (functionality === "Energy") return "Energy Manager";
  return "Monitoring Manager";
}

function addRanking<T>(rows: T[]): Array<T & { rank: number }> {
  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

function buildMonthlyStackedSeries(
  items: Array<{ name: string; baseHours: number }>,
) {
  return {
    months: monthLabels,
    series: items.map((item, itemIndex) => {
      const bias = (itemIndex - (items.length - 1) / 2) * 0.4;
      const data = monthFactors.map((factor, index) => {
        const wobble = ((index % 4) - 1.5) * 0.2;
        const value = item.baseHours * factor + bias + wobble;
        return round(clamp(value, 0.5, item.baseHours * 1.6), 2);
      });
      return {
        name: item.name,
        data,
      };
    }),
  };
}

function getDerivedDevices(): DerivedDevice[] {
  const dataset = snapshotApi.getDataset();
  const companyById = new Map(dataset.companies.map((company) => [company.id, company]));
  const userById = new Map(dataset.iotUsers.map((user) => [user.id, user]));
  const sharesByDeviceId = new Map<string, number>();

  for (const share of dataset.deviceShares) {
    sharesByDeviceId.set(
      share.deviceId,
      (sharesByDeviceId.get(share.deviceId) ?? 0) + 1,
    );
  }

  return dataset.devices.map((device) => {
    const company = companyById.get(device.companyId);
    const owner = userById.get(device.ownerUserId);

    return {
      id: device.id,
      name: device.name,
      type: device.type,
      category: device.category,
      serialNumber: device.serialNumber,
      manufacturer: device.manufacturer,
      model: device.model,
      firmwareVersion: device.firmwareVersion,
      macAddress: device.macAddress,
      location: device.location,
      company: company?.name ?? "Unknown Company",
      companyId: device.companyId,
      ownerUserId: device.ownerUserId,
      ownerName: owner?.fullName ?? "Unknown User",
      userCount: 1 + (sharesByDeviceId.get(device.id) ?? 0),
      isOnline: device.status === "active",
      alarms: device.alertsCount,
      status: device.status,
      bandwidthMbps: device.bandwidthMbps,
      dataUsageGb: device.dataUsageGb,
      createdAt: device.createdAt,
      functionality: identifyFunctionality(device.type),
    };
  });
}

function applyAnalyticsFilters(
  devices: DerivedDevice[],
  filters?: AnalyticsFilters,
) {
  if (!filters) return devices;
  const dataset = snapshotApi.getDataset();
  const shareDeviceIds = new Set(dataset.deviceShares.map((share) => share.deviceId));

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
    if (
      filters.ownership === "own" &&
      shareDeviceIds.has(device.id)
    ) {
      return false;
    }
    if (
      filters.ownership === "shared" &&
      !shareDeviceIds.has(device.id)
    ) {
      return false;
    }
    if (
      filters.functionality !== "all" &&
      device.functionality !== filters.functionality
    ) {
      return false;
    }
    return true;
  });
}

function safeDevicesWithFallback(filteredDevices: DerivedDevice[]) {
  if (filteredDevices.length) return filteredDevices;
  return getDerivedDevices();
}

function buildUserStats(devices: DerivedDevice[]): UserStat[] {
  const dataset = snapshotApi.getDataset();
  const companyById = new Map(dataset.companies.map((company) => [company.id, company]));
  const userById = new Map(dataset.iotUsers.map((user) => [user.id, user]));
  const sharesByTarget = new Map<string, string[]>();

  for (const share of dataset.deviceShares) {
    const linkedDevices = sharesByTarget.get(share.targetUserId) ?? [];
    linkedDevices.push(share.deviceId);
    sharesByTarget.set(share.targetUserId, linkedDevices);
  }

  return dataset.iotUsers
    .map((user) => {
      const ownedDevices = devices.filter((device) => device.ownerUserId === user.id);
      const sharedDeviceIds = new Set(sharesByTarget.get(user.id) ?? []);
      const sharedDevices = devices.filter((device) => sharedDeviceIds.has(device.id));
      const linkedDevices = [...ownedDevices, ...sharedDevices];

      if (!linkedDevices.length) {
        return null;
      }

      const functionalityBreakdown = createEmptyFunctionalityMap();
      for (const device of linkedDevices) {
        functionalityBreakdown[device.functionality] += 1;
      }

      const avgUptime = round(user.uptimePercent, 1);
      const retentionMinutes = Math.round(clamp(user.retentionRate * 7.2, 90, 720));
      const usagePercent = round(
        clamp(
          (user.featureUsage.deviceMonitoring +
            user.featureUsage.reports +
            user.featureUsage.alerts +
            user.featureUsage.dashboardUsage) /
            4,
          35,
          98,
        ),
      );

      return {
        id: user.id,
        name: user.fullName,
        avatarUrl: "/avatar.jpg",
        company: companyById.get(user.companyId)?.name ?? "Unknown",
        devices: linkedDevices.length,
        onlineDevices: linkedDevices.filter((device) => device.isOnline).length,
        avgUptime,
        retentionMinutes,
        usagePercent,
        dominantFunctionality: dominantFunctionality(functionalityBreakdown),
        functionalityBreakdown,
      };
    })
    .filter((item): item is UserStat => Boolean(item));
}

function buildCompanyStats(devices: DerivedDevice[]): CompanyStat[] {
  const dataset = snapshotApi.getDataset();
  const usersByCompany = new Map<string, number>();
  const uptimeByCompany = new Map<string, number[]>();
  const retentionByCompany = new Map<string, number[]>();
  const usageByCompany = new Map<string, number[]>();

  for (const company of dataset.companies) {
    const companyUsers = dataset.iotUsers.filter((user) => user.companyId === company.id);
    usersByCompany.set(company.name, companyUsers.length);
    uptimeByCompany.set(company.name, companyUsers.map((user) => user.uptimePercent));
    retentionByCompany.set(
      company.name,
      companyUsers.map((user) => clamp(user.retentionRate * 7.2, 90, 720)),
    );
    usageByCompany.set(
      company.name,
      companyUsers.map(
        (user) =>
          (user.featureUsage.deviceMonitoring +
            user.featureUsage.reports +
            user.featureUsage.alerts +
            user.featureUsage.dashboardUsage) /
          4,
      ),
    );
  }

  return dataset.companies.map((company) => {
    const companyDevices = devices.filter((device) => device.companyId === company.id);
    const functionalityBreakdown = createEmptyFunctionalityMap();

    for (const device of companyDevices) {
      functionalityBreakdown[device.functionality] += 1;
    }

    const uptimeSeries = uptimeByCompany.get(company.name) ?? [90];
    const retentionSeries = retentionByCompany.get(company.name) ?? [120];
    const usageSeries = usageByCompany.get(company.name) ?? [40];

    return {
      company: company.name,
      devicesUnderCompany: companyDevices.length,
      usersUnderCompany: usersByCompany.get(company.name) ?? 0,
      onlineDevices: companyDevices.filter((device) => device.isOnline).length,
      avgUptime: round(
        uptimeSeries.reduce((sum, value) => sum + value, 0) /
          Math.max(uptimeSeries.length, 1),
      ),
      retentionMinutes: Math.round(
        retentionSeries.reduce((sum, value) => sum + value, 0) /
          Math.max(retentionSeries.length, 1),
      ),
      usagePercent: round(
        usageSeries.reduce((sum, value) => sum + value, 0) /
          Math.max(usageSeries.length, 1),
      ),
      dominantFunctionality: dominantFunctionality(functionalityBreakdown),
      functionalityBreakdown,
    };
  });
}

function calculateDeviceUsageScore(device: DerivedDevice) {
  const telemetryFactor = clamp(
    device.dataUsageGb / 22 + device.bandwidthMbps / 8,
    4,
    36,
  );
  const onlineFactor = device.isOnline ? 22 : -16;
  const alarmPenalty = device.alarms * 3.8;
  return round(clamp(54 + telemetryFactor + onlineFactor - alarmPenalty, 20, 98), 0);
}

export function getAnalyticsFilterOptions(): AnalyticsFilterOptions {
  const devices = getDerivedDevices();
  return {
    companies: Array.from(new Set(devices.map((device) => device.company))).sort(),
    locations: Array.from(new Set(devices.map((device) => device.location))).sort(),
    deviceTypes: Array.from(new Set(devices.map((device) => device.type))).sort(),
    functionalities: [...functionalityOrder],
  };
}

export function getUserDashboardData(
  filters?: AnalyticsFilters,
): UserDashboardDerivedData {
  const filteredDevices = safeDevicesWithFallback(
    applyAnalyticsFilters(getDerivedDevices(), filters),
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

  const topRetentionUsers = [...users]
    .sort((a, b) => b.retentionMinutes - a.retentionMinutes)
    .slice(0, 5)
    .map((user) => ({
      name: shortLabel(user.name),
      baseHours: round(user.retentionMinutes / 60, 2),
    }));

  const retentionByUserMonthlyStacked =
    buildMonthlyStackedSeries(topRetentionUsers);

  const functionalityUsageByUser = users.map((user) => ({
    label: shortLabel(user.name),
    monitoring: round(
      (user.functionalityBreakdown.Monitoring / Math.max(user.devices, 1)) * 100,
      0,
    ),
    security: round(
      (user.functionalityBreakdown.Security / Math.max(user.devices, 1)) * 100,
      0,
    ),
    control: round(
      (user.functionalityBreakdown.Control / Math.max(user.devices, 1)) * 100,
      0,
    ),
    energy: round(
      (user.functionalityBreakdown.Energy / Math.max(user.devices, 1)) * 100,
      0,
    ),
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
    .map((user) => ({
      id: user.id,
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
    retentionByUserMonthlyStacked,
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
    applyAnalyticsFilters(getDerivedDevices(), filters),
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

  const topRetentionCompanies = [...companies]
    .sort((a, b) => b.retentionMinutes - a.retentionMinutes)
    .slice(0, 5)
    .map((company) => ({
      name: shortLabel(company.company),
      baseHours: round(company.retentionMinutes / 60, 2),
    }));

  const retentionByCompanyMonthlyStacked =
    buildMonthlyStackedSeries(topRetentionCompanies);

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
    retentionByCompanyMonthlyStacked,
    usageByCompany,
    topCompanies,
    devicesByFunctionality,
    companyTableRows,
  };
}

export function getDeviceDashboardData(
  filters?: AnalyticsFilters,
): DeviceDashboardDerivedData {
  const dataset = snapshotApi.getDataset();
  const devices = [
    ...safeDevicesWithFallback(applyAnalyticsFilters(getDerivedDevices(), filters)),
  ];
  const totalDevices = devices.length;
  const activeDevices = devices.filter((device) => device.isOnline).length;
  const inactiveDevices = totalDevices - activeDevices;
  const totalUsers = dataset.iotUsers.length || 1;
  const totalAlarms = devices.reduce((sum, device) => sum + device.alarms, 0);

  const totalDataUsageGb = devices.reduce(
    (sum, device) => sum + device.dataUsageGb,
    0,
  );
  const totalDataUsageMb = Math.round(totalDataUsageGb * 1024) || 10987;

  const metrics: DeviceMetricSummary = {
    totalDevices,
    activeDevices,
    avgDevicesPerUser: round(totalDevices / totalUsers, 1),
    avgRevenuePerDevice: 142.5,
    avgUptime: 99.82,
    alarmsPerDevice: totalDevices > 0 ? round(totalAlarms / totalDevices, 2) : 0.45,
    totalDataUsageMb,
  };

  const avgUsageMb = totalDataUsageMb / 12;

  const devicesDataTrend = monthLabels.map((month, index) => ({
    month,
    dataUsageMb: Math.round(Math.max(1, avgUsageMb * monthFactors[index])),
  }));

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

  // Top Industries (donut chart)
  const industryCounts = new Map<string, number>();
  for (const company of dataset.companies) {
    industryCounts.set(
      company.industry,
      (industryCounts.get(company.industry) ?? 0) + 1,
    );
  }
  const industryEntries = [...industryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const industryColors = ["#1E88E5", "#64B5F6", "#90CAF9", "#BBDEFB"];
  const topIndustries = industryEntries.map(([name, value], index) => ({
    name,
    value,
    color: industryColors[index] ?? "#BBDEFB",
  }));

  // Brands & Models
  const brandModelCounts = new Map<string, { brand: string; model: string; count: number }>();
  for (const device of devices) {
    const key = `${device.manufacturer}|${device.model}`;
    const existing = brandModelCounts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      brandModelCounts.set(key, {
        brand: device.manufacturer,
        model: device.model,
        count: 1,
      });
    }
  }
  const brandsAndModels = [...brandModelCounts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Regions
  const regionCounts = new Map<string, number>();
  for (const device of devices) {
    regionCounts.set(
      device.location,
      (regionCounts.get(device.location) ?? 0) + 1,
    );
  }
  const regions: RegionEntry[] = [...regionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  // Year over Year Growth Area
  const yearOverYearGrowthArea = monthLabels.map((month, index) => {
    const baseFactor = monthFactors[index];
    return {
      month,
      now: Math.round(15000 * baseFactor + (index * 400)),
      past: Math.round(10000 * baseFactor + (index * 300)),
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
    assignedUser: device.ownerName,
    manufacturerModel: `${device.manufacturer} - ${device.model}`,
    firmwareVersion: device.firmwareVersion,
    macAddress: device.macAddress,
    alarms: device.alarms,
    usageScore: device.score,
  }));

  return {
    metrics,
    devicesDataTrend,
    yearOverYearGrowth,
    topIndustries,
    brandsAndModels,
    regions,
    yearOverYearGrowthArea,
    topDeviceScores,
    topDeviceTableRows,
  };
}

export function formatMinutesAsDuration(minutes: number) {
  return formatDuration(minutes);
}
