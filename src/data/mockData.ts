import {
  average,
  buildTrendValues,
  formatCompactNumber,
  formatCurrency,
  formatDataUsage,
  formatHoursAsReadable,
  formatPercent,
  formatRelativeTime,
  getTimeCategories,
  isDateInRange,
  monthLabelsFromCurrentYear,
  resolveDateWindow,
  sum,
} from "@/lib/helpers";
import type {
  Account,
  AnalyticsFilterOptions,
  AnalyticsFilters,
  Company,
  CompanyAnalyticsData,
  CompanyTableRow,
  DashboardOverviewData,
  Device,
  DeviceAnalyticsData,
  DeviceTableRow,
  DeviceType,
  Notification,
  Project,
  SubscriptionPlan,
  User,
  UserAnalyticsData,
  UserStatus,
  UserTableRow,
} from "@/types/models";

const now = new Date();
const daysAgo = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const companySeed: Array<{
  id: string;
  name: string;
  industry: string;
  location: string;
  plan: SubscriptionPlan;
  revenue: number;
  createdAgo: number;
  activeAgo: number;
}> = [
  {
    id: "comp-aurora",
    name: "Aurora Energy",
    industry: "Energy",
    location: "Austin",
    plan: "enterprise",
    revenue: 24500,
    createdAgo: 860,
    activeAgo: 0,
  },
  {
    id: "comp-orbit",
    name: "Orbit Logistics",
    industry: "Logistics",
    location: "Chicago",
    plan: "growth",
    revenue: 14200,
    createdAgo: 640,
    activeAgo: 1,
  },
  {
    id: "comp-skyline",
    name: "Skyline Retail",
    industry: "Retail",
    location: "San Francisco",
    plan: "growth",
    revenue: 13600,
    createdAgo: 520,
    activeAgo: 0,
  },
  {
    id: "comp-pulse",
    name: "Pulse Healthcare",
    industry: "Healthcare",
    location: "Boston",
    plan: "enterprise",
    revenue: 21900,
    createdAgo: 490,
    activeAgo: 2,
  },
  {
    id: "comp-nova",
    name: "Nova Manufacturing",
    industry: "Manufacturing",
    location: "Detroit",
    plan: "starter",
    revenue: 8300,
    createdAgo: 300,
    activeAgo: 1,
  },
  {
    id: "comp-river",
    name: "River Utility",
    industry: "Utilities",
    location: "Seattle",
    plan: "starter",
    revenue: 7600,
    createdAgo: 180,
    activeAgo: 5,
  },
  {
    id: "comp-zenith",
    name: "Zenith Smart Homes",
    industry: "Consumer Tech",
    location: "New York",
    plan: "growth",
    revenue: 15700,
    createdAgo: 95,
    activeAgo: 0,
  },
];

export const companies: Company[] = companySeed.map((seed) => ({
  id: seed.id,
  name: seed.name,
  industry: seed.industry,
  location: seed.location,
  subscriptionPlan: seed.plan,
  createdAt: daysAgo(seed.createdAgo),
  lastActiveAt: daysAgo(seed.activeAgo),
  monthlyRevenueUsd: seed.revenue,
}));

const planSeats: Record<SubscriptionPlan, number> = {
  starter: 50,
  growth: 250,
  enterprise: 1000,
};

export const accounts: Account[] = companies.map((company, index) => ({
  id: `acct-${company.id}`,
  companyId: company.id,
  plan: company.subscriptionPlan,
  seats: planSeats[company.subscriptionPlan],
  renewsAt: daysAgo(-(10 + index * 3)),
  dueAmountUsd: index % 3 === 0 ? 0 : 450 + index * 150,
  isPastDue: index === 5,
}));

export const projects: Project[] = companies.map((company, index) => ({
  id: `proj-${company.id}`,
  companyId: company.id,
  name: `${company.name} Core Ops`,
  status: "active",
  deviceIds: [],
  createdAt: daysAgo(380 - index * 26),
}));

const userSeed: Array<{
  id: string;
  companyId: string;
  username: string;
  fullName: string;
  status: UserStatus;
  plan: SubscriptionPlan;
  joinedAgo: number;
  renewIn: number;
  usage: number;
  retention: number;
  uptime: number;
  revenue: number;
}> = [
  {
    id: "usr-001",
    companyId: "comp-aurora",
    username: "sasha.turner",
    fullName: "Sasha Turner",
    status: "active",
    plan: "enterprise",
    joinedAgo: 420,
    renewIn: 21,
    usage: 173.2,
    retention: 93,
    uptime: 98.2,
    revenue: 2200,
  },
  {
    id: "usr-002",
    companyId: "comp-aurora",
    username: "ravi.nair",
    fullName: "Ravi Nair",
    status: "active",
    plan: "enterprise",
    joinedAgo: 320,
    renewIn: 10,
    usage: 188.4,
    retention: 95,
    uptime: 99.1,
    revenue: 2400,
  },
  {
    id: "usr-003",
    companyId: "comp-orbit",
    username: "mia.chan",
    fullName: "Mia Chan",
    status: "inactive",
    plan: "growth",
    joinedAgo: 280,
    renewIn: -12,
    usage: 89.5,
    retention: 74,
    uptime: 90.4,
    revenue: 1300,
  },
  {
    id: "usr-004",
    companyId: "comp-orbit",
    username: "jordan.miles",
    fullName: "Jordan Miles",
    status: "active",
    plan: "growth",
    joinedAgo: 270,
    renewIn: 17,
    usage: 141.3,
    retention: 87,
    uptime: 95.6,
    revenue: 1450,
  },
  {
    id: "usr-005",
    companyId: "comp-skyline",
    username: "alicia.wong",
    fullName: "Alicia Wong",
    status: "active",
    plan: "growth",
    joinedAgo: 220,
    renewIn: 4,
    usage: 162.8,
    retention: 91,
    uptime: 96.8,
    revenue: 1700,
  },
  {
    id: "usr-006",
    companyId: "comp-pulse",
    username: "omar.khan",
    fullName: "Omar Khan",
    status: "active",
    plan: "enterprise",
    joinedAgo: 200,
    renewIn: 28,
    usage: 176.7,
    retention: 94,
    uptime: 98.4,
    revenue: 2500,
  },
  {
    id: "usr-007",
    companyId: "comp-pulse",
    username: "dana.lopez",
    fullName: "Dana Lopez",
    status: "inactive",
    plan: "enterprise",
    joinedAgo: 190,
    renewIn: -5,
    usage: 78.2,
    retention: 71,
    uptime: 88.9,
    revenue: 1050,
  },
  {
    id: "usr-008",
    companyId: "comp-nova",
    username: "harry.chen",
    fullName: "Harry Chen",
    status: "active",
    plan: "starter",
    joinedAgo: 150,
    renewIn: 9,
    usage: 129.6,
    retention: 86,
    uptime: 94.7,
    revenue: 980,
  },
  {
    id: "usr-009",
    companyId: "comp-river",
    username: "nina.patel",
    fullName: "Nina Patel",
    status: "active",
    plan: "starter",
    joinedAgo: 115,
    renewIn: 14,
    usage: 104.2,
    retention: 82,
    uptime: 93.1,
    revenue: 910,
  },
  {
    id: "usr-010",
    companyId: "comp-zenith",
    username: "leo.garcia",
    fullName: "Leo Garcia",
    status: "active",
    plan: "growth",
    joinedAgo: 70,
    renewIn: 23,
    usage: 147.8,
    retention: 89,
    uptime: 95.8,
    revenue: 1600,
  },
  {
    id: "usr-011",
    companyId: "comp-zenith",
    username: "emma.wright",
    fullName: "Emma Wright",
    status: "active",
    plan: "growth",
    joinedAgo: 45,
    renewIn: 12,
    usage: 136.1,
    retention: 88,
    uptime: 96.2,
    revenue: 1520,
  },
  {
    id: "usr-012",
    companyId: "comp-skyline",
    username: "kai.foster",
    fullName: "Kai Foster",
    status: "inactive",
    plan: "growth",
    joinedAgo: 35,
    renewIn: -4,
    usage: 59.9,
    retention: 66,
    uptime: 85.4,
    revenue: 620,
  },
];

export const users: User[] = userSeed.map((seed, index) => ({
  id: seed.id,
  companyId: seed.companyId,
  username: seed.username,
  fullName: seed.fullName,
  status: seed.status,
  subscriptionPlan: seed.plan,
  joinedAt: daysAgo(seed.joinedAgo),
  renewalDate: daysAgo(-seed.renewIn),
  totalUsageHours: seed.usage,
  retentionRate: seed.retention,
  uptimePercent: seed.uptime,
  monthlyRevenueUsd: seed.revenue,
  featureUsage: {
    deviceMonitoring: Math.max(35, Math.min(95, seed.retention + (index % 8))),
    reports: Math.max(30, Math.min(92, seed.retention - 8 + (index % 6))),
    alerts: Math.max(28, Math.min(91, seed.retention - 5 + (index % 4))),
    dashboardUsage: Math.max(
      40,
      Math.min(96, seed.retention + 2 + (index % 7)),
    ),
  },
}));

const deviceTypeOrder: DeviceType[] = [
  "gateway",
  "sensor",
  "camera",
  "controller",
  "meter",
];
const deviceMeta: Record<
  DeviceType,
  { category: string; baseBandwidth: number; baseUsage: number }
> = {
  gateway: { category: "Gateway", baseBandwidth: 118, baseUsage: 780 },
  sensor: { category: "Sensor", baseBandwidth: 54, baseUsage: 315 },
  camera: { category: "Camera", baseBandwidth: 109, baseUsage: 645 },
  controller: { category: "Controller", baseBandwidth: 72, baseUsage: 430 },
  meter: { category: "Meter", baseBandwidth: 63, baseUsage: 382 },
};
function makeSerial(index: number, type: DeviceType) {
  return `${type.toUpperCase().slice(0, 3)}-${String(100000 + index * 177).slice(0, 6)}`;
}

function makeMac(index: number) {
  const value = (index * 1103515245 + 12345) >>> 0;
  return Array.from({ length: 6 }, (_, part) =>
    ((value >> (part * 4)) & 0xff).toString(16).padStart(2, "0").toUpperCase(),
  ).join(":");
}

export const devices: Device[] = companies.flatMap((company, companyIndex) => {
  const plannedTypes = [
    deviceTypeOrder[companyIndex % deviceTypeOrder.length],
    deviceTypeOrder[(companyIndex + 1) % deviceTypeOrder.length],
    deviceTypeOrder[(companyIndex + 2) % deviceTypeOrder.length],
  ];

  return plannedTypes.map((type, localIndex) => {
    const globalIndex = companyIndex * 3 + localIndex;
    const meta = deviceMeta[type];
    const assignedUser =
      users.find((user) => user.companyId === company.id)?.id ?? users[0].id;
    const status: Device["status"] =
      globalIndex % 9 === 0
        ? "faulty"
        : globalIndex % 7 === 0
          ? "disabled"
          : globalIndex % 5 === 0
            ? "inactive"
            : "active";

    return {
      id: `dev-${String(globalIndex + 1).padStart(3, "0")}`,
      companyId: company.id,
      projectId: `proj-${company.id}`,
      name: `${company.name} ${meta.category} ${String.fromCharCode(65 + localIndex)}${localIndex + 1}`,
      serialNumber: makeSerial(globalIndex + 1, type),
      category: meta.category,
      type,
      userAssignedId: assignedUser,
      manufacturer: ["Cisco", "Siemens", "Axis", "Honeywell", "Schneider"][
        globalIndex % 5
      ],
      model: ["IR1101", "SITRANS", "P1468", "HC900", "PM5000"][globalIndex % 5],
      firmwareVersion: `v${2 + (globalIndex % 6)}.${globalIndex % 10}.${(globalIndex * 3) % 10}`,
      macAddress: makeMac(globalIndex + 1),
      status,
      location: company.location,
      bandwidthMbps: Math.round(
        meta.baseBandwidth + ((globalIndex % 4) - 1.5) * 11,
      ),
      dataUsageGb: Math.round(meta.baseUsage + ((globalIndex % 5) - 2) * 58),
      alertsCount: Math.max(
        0,
        Math.round((globalIndex % 6) + (status === "faulty" ? 7 : 1)),
      ),
      createdAt: daysAgo(320 - globalIndex * 12),
      lastSeenAt: daysAgo(
        status === "inactive" || status === "disabled"
          ? 4 + (globalIndex % 4)
          : globalIndex % 2,
      ),
    };
  });
});

export const notifications: Notification[] = [
  {
    id: "not-1",
    companyId: "comp-river",
    type: "incident",
    message: "Pump Controller reported vibration threshold",
    severity: "high",
    createdAt: daysAgo(1),
    isRead: false,
  },
  {
    id: "not-2",
    companyId: "comp-orbit",
    type: "device",
    message: "Route Camera offline for 15 minutes",
    severity: "medium",
    createdAt: daysAgo(2),
    isRead: false,
  },
  {
    id: "not-3",
    companyId: "comp-zenith",
    type: "billing",
    message: "Invoice due in 7 days",
    severity: "low",
    createdAt: daysAgo(3),
    isRead: true,
  },
];

export const defaultAnalyticsFilters: AnalyticsFilters = {
  dateRange: "month",
  customStartDate: null,
  customEndDate: null,
  companyId: "all",
  deviceType: "all",
  location: "all",
  subscriptionPlan: "all",
};

export const analyticsFilterOptions: AnalyticsFilterOptions = {
  companies: companies.map((company) => ({
    id: company.id,
    name: company.name,
  })),
  deviceTypes: ["gateway", "sensor", "camera", "controller", "meter"],
  locations: Array.from(
    new Set(companies.map((company) => company.location)),
  ).sort(),
  subscriptionPlans: ["starter", "growth", "enterprise"],
};

interface FilterContext {
  companies: Company[];
  users: User[];
  devices: Device[];
  accounts: Account[];
  notifications: Notification[];
  timeWindowStart: Date;
  timeWindowEnd: Date;
}

const percentageDelta = (current: number, baseline: number) => {
  if (baseline <= 0) {
    return current <= 0 ? "0.0%" : "+100.0%";
  }
  const value = ((current - baseline) / baseline) * 100;
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
};

export const toPlanLabel = (plan: SubscriptionPlan | "all") =>
  plan === "all"
    ? "All Plans"
    : `${plan.charAt(0).toUpperCase()}${plan.slice(1)}`;

function getFilterContext(filters: AnalyticsFilters): FilterContext {
  const { start, end } = resolveDateWindow(filters);
  const selectedCompanies = companies.filter((company) => {
    if (filters.companyId !== "all" && company.id !== filters.companyId) {
      return false;
    }
    if (filters.location !== "all" && company.location !== filters.location) {
      return false;
    }
    if (
      filters.subscriptionPlan !== "all" &&
      company.subscriptionPlan !== filters.subscriptionPlan
    ) {
      return false;
    }
    return true;
  });

  const companyIds = new Set(selectedCompanies.map((company) => company.id));
  const selectedUsers = users.filter(
    (user) =>
      companyIds.has(user.companyId) &&
      (filters.subscriptionPlan === "all" ||
        user.subscriptionPlan === filters.subscriptionPlan),
  );
  const selectedDevices = devices.filter(
    (device) =>
      companyIds.has(device.companyId) &&
      (filters.deviceType === "all" || device.type === filters.deviceType) &&
      (filters.location === "all" || device.location === filters.location),
  );

  return {
    companies: selectedCompanies,
    users: selectedUsers,
    devices: selectedDevices,
    accounts: accounts.filter((account) => companyIds.has(account.companyId)),
    notifications: notifications.filter((notification) =>
      companyIds.has(notification.companyId),
    ),
    timeWindowStart: start,
    timeWindowEnd: end,
  };
}

const buildDeviceTableRows = (selectedDevices: Device[]): DeviceTableRow[] => {
  const userById = new Map(users.map((user) => [user.id, user.fullName]));
  return [...selectedDevices]
    .sort((a, b) => b.dataUsageGb - a.dataUsageGb)
    .slice(0, 5)
    .map((device) => ({
      id: device.id,
      deviceName: device.name,
      serialNumber: device.serialNumber,
      category: device.category,
      userAssigned: userById.get(device.userAssignedId) ?? "Unassigned",
      manufacturerModel: `${device.manufacturer} ${device.model}`,
      firmwareVersion: device.firmwareVersion,
      macAddress: device.macAddress,
      dataUsageGb: device.dataUsageGb,
    }));
};

const buildUserTableRows = (selectedUsers: User[]): UserTableRow[] =>
  [...selectedUsers]
    .sort((a, b) => b.totalUsageHours - a.totalUsageHours)
    .slice(0, 5)
    .map((user) => ({
      id: user.id,
      username: user.username,
      subscriptionPlan: user.subscriptionPlan,
      status: user.status,
      renewalDate: user.renewalDate,
      totalUsageTime: formatHoursAsReadable(user.totalUsageHours),
    }));

function buildCompanyTableRows(
  selectedCompanies: Company[],
  selectedUsers: User[],
  selectedDevices: Device[],
): CompanyTableRow[] {
  return selectedCompanies.map((company) => {
    const companyDevices = selectedDevices.filter(
      (device) => device.companyId === company.id,
    );
    const activeCount = companyDevices.filter(
      (device) => device.status === "active",
    ).length;
    return {
      id: company.id,
      companyName: company.name,
      devicesCount: companyDevices.length,
      activePercentage: companyDevices.length
        ? Number(((activeCount / companyDevices.length) * 100).toFixed(1))
        : 0,
      dataUsageGb: Number(
        sum(companyDevices.map((device) => device.dataUsageGb)).toFixed(1),
      ),
      alertsCount: sum(companyDevices.map((device) => device.alertsCount)),
      users: selectedUsers.filter((user) => user.companyId === company.id)
        .length,
      lastActiveTime: company.lastActiveAt,
    };
  });
}
export function buildDeviceAnalyticsData(
  filters: AnalyticsFilters,
): DeviceAnalyticsData {
  const context = getFilterContext(filters);
  const categories = getTimeCategories(filters.dateRange, {
    start: context.timeWindowStart,
    end: context.timeWindowEnd,
  });

  const totalDevices = context.devices.length;
  const activeDevices = context.devices.filter(
    (device) => device.status === "active",
  ).length;
  const newlyAddedDevices = context.devices.filter((device) =>
    isDateInRange(device.createdAt, {
      start: context.timeWindowStart,
      end: context.timeWindowEnd,
    }),
  ).length;
  const inactiveDevices = context.devices.filter(
    (device) => device.status === "inactive" || device.status === "disabled",
  ).length;
  const faultyDevices = context.devices.filter(
    (device) => device.status === "faulty",
  ).length;
  const totalDataUsageGb = sum(
    context.devices.map((device) => device.dataUsageGb),
  );

  const avgBandwidth =
    average(context.devices.map((device) => device.bandwidthMbps)) || 20;
  const avgUsage =
    average(context.devices.map((device) => device.dataUsageGb)) || 60;

  const topDeviceRows = buildDeviceTableRows(context.devices);

  return {
    kpis: [
      {
        id: "total-devices",
        label: "Total Devices",
        value: formatCompactNumber(totalDevices),
        delta: percentageDelta(totalDevices, Math.max(totalDevices - 8, 1)),
        trend: "up",
      },
      {
        id: "active-devices",
        label: "Active Devices",
        value: formatCompactNumber(activeDevices),
        delta: percentageDelta(activeDevices, Math.max(activeDevices - 6, 1)),
        trend: "up",
        tone: "success",
      },
      {
        id: "newly-added",
        label: "Newly Added Devices",
        value: formatCompactNumber(newlyAddedDevices),
        delta: percentageDelta(
          newlyAddedDevices,
          Math.max(newlyAddedDevices - 2, 1),
        ),
        trend: "up",
        tone: "info",
      },
      {
        id: "inactive-devices",
        label: "Inactive Devices",
        value: formatCompactNumber(inactiveDevices),
        delta: percentageDelta(
          inactiveDevices,
          Math.max(inactiveDevices + 2, 1),
        ),
        trend: "down",
        tone: "warning",
      },
      {
        id: "faulty-devices",
        label: "Faulty Devices",
        value: formatCompactNumber(faultyDevices),
        delta: percentageDelta(faultyDevices, Math.max(faultyDevices + 1, 1)),
        trend: "down",
        tone: "danger",
      },
      {
        id: "total-data-usage",
        label: "Total Data Usage",
        value: formatDataUsage(totalDataUsageGb),
        delta: "+5.8%",
        trend: "up",
        tone: "info",
      },
    ],
    bandwidthUsageTrend: {
      categories,
      series: [
        {
          name: "Bandwidth (Mbps)",
          data: buildTrendValues(categories.length, avgBandwidth, {
            growth: Math.max(1, avgBandwidth * 0.04),
            volatility: Math.max(3, avgBandwidth * 0.15),
            floor: 2,
          }),
        },
      ],
    },
    dataUsageTrend: {
      categories,
      series: [
        {
          name: "Data Usage (GB)",
          data: buildTrendValues(categories.length, avgUsage, {
            growth: Math.max(2, avgUsage * 0.08),
            volatility: Math.max(8, avgUsage * 0.22),
            floor: 4,
          }),
        },
      ],
    },
    yearOverYearGrowth: {
      categories: monthLabelsFromCurrentYear(),
      series: [
        {
          name: "Active Devices",
          data: buildTrendValues(
            12,
            Math.max(4, Math.round(activeDevices * 0.35)),
            {
              growth: 1,
              volatility: 2,
              floor: 1,
            },
          ),
        },
        {
          name: "Disabled Devices",
          data: buildTrendValues(
            12,
            Math.max(1, Math.round(inactiveDevices * 0.3)),
            {
              growth: 0.3,
              volatility: 1.5,
              floor: 0,
            },
          ),
        },
      ],
    },
    activeVsDisabledDevices: {
      labels: ["Active", "Disabled", "Faulty"],
      series: [activeDevices, inactiveDevices, faultyDevices],
    },
    topDevicesByDataUsage: {
      categories: topDeviceRows.map((row) => row.deviceName),
      series: [
        {
          name: "Data Usage (GB)",
          data: topDeviceRows.map((row) => row.dataUsageGb),
        },
      ],
    },
    topDevices: topDeviceRows,
  };
}

export function buildUserAnalyticsData(
  filters: AnalyticsFilters,
): UserAnalyticsData {
  const context = getFilterContext(filters);
  const categories = getTimeCategories(filters.dateRange, {
    start: context.timeWindowStart,
    end: context.timeWindowEnd,
  });

  const totalUsers = context.users.length;
  const activeUsers = context.users.filter(
    (user) => user.status === "active",
  ).length;
  const inactiveUsers = context.users.filter(
    (user) => user.status === "inactive",
  ).length;
  const totalRevenue = sum(context.users.map((user) => user.monthlyRevenueUsd));
  const dueSubscriptions = sum(
    context.accounts
      .filter((account) => account.dueAmountUsd > 0)
      .map((account) => account.dueAmountUsd),
  );

  const avgRetention =
    average(context.users.map((user) => user.retentionRate)) || 0;
  const avgUptime =
    average(context.users.map((user) => user.uptimePercent)) || 0;
  const featureAverages = {
    deviceMonitoring:
      average(
        context.users.map((user) => user.featureUsage.deviceMonitoring),
      ) || 0,
    reports:
      average(context.users.map((user) => user.featureUsage.reports)) || 0,
    alerts: average(context.users.map((user) => user.featureUsage.alerts)) || 0,
    dashboardUsage:
      average(context.users.map((user) => user.featureUsage.dashboardUsage)) ||
      0,
  };

  return {
    kpis: [
      {
        id: "total-users",
        label: "Total Users",
        value: formatCompactNumber(totalUsers),
        delta: percentageDelta(totalUsers, Math.max(totalUsers - 6, 1)),
        trend: "up",
      },
      {
        id: "active-users",
        label: "Active Users",
        value: formatCompactNumber(activeUsers),
        delta: percentageDelta(activeUsers, Math.max(activeUsers - 4, 1)),
        trend: "up",
        tone: "success",
      },
      {
        id: "inactive-users",
        label: "Inactive Users",
        value: formatCompactNumber(inactiveUsers),
        delta: percentageDelta(inactiveUsers, Math.max(inactiveUsers + 2, 1)),
        trend: "down",
        tone: "warning",
      },
      {
        id: "total-revenue",
        label: "Total Revenue",
        value: formatCurrency(totalRevenue),
        delta: "+6.7%",
        trend: "up",
        tone: "info",
      },
      {
        id: "due-subscription",
        label: "Due Subscription",
        value: formatCurrency(dueSubscriptions),
        delta: "-4.1%",
        trend: "down",
        tone: "danger",
      },
    ],
    newRegistrationsTrend: {
      categories,
      series: [
        {
          name: "New Registrations",
          data: buildTrendValues(
            categories.length,
            Math.max(2, Math.round(totalUsers / 2.2)),
            {
              growth: 0.5,
              volatility: 2.4,
              floor: 0,
            },
          ),
        },
      ],
    },
    retentionRateTrend: {
      categories,
      series: [
        {
          name: "Retention Rate (%)",
          data: buildTrendValues(categories.length, avgRetention, {
            growth: 0.2,
            volatility: 2.6,
            floor: 50,
            precision: 1,
          }),
        },
      ],
    },
    averageUptimeTrend: {
      categories,
      series: [
        {
          name: "Average Uptime (%)",
          data: buildTrendValues(categories.length, avgUptime, {
            growth: 0.15,
            volatility: 1.8,
            floor: 60,
            precision: 1,
          }),
        },
      ],
    },
    featureUsage: {
      categories: ["Device Monitoring", "Reports", "Alerts", "Dashboard Usage"],
      series: [
        {
          name: "Feature Usage (%)",
          data: [
            Number(featureAverages.deviceMonitoring.toFixed(1)),
            Number(featureAverages.reports.toFixed(1)),
            Number(featureAverages.alerts.toFixed(1)),
            Number(featureAverages.dashboardUsage.toFixed(1)),
          ],
        },
      ],
    },
    topUsers: buildUserTableRows(context.users),
  };
}
export function buildCompanyAnalyticsData(
  filters: AnalyticsFilters,
): CompanyAnalyticsData {
  const context = getFilterContext(filters);
  const categories = getTimeCategories(filters.dateRange, {
    start: context.timeWindowStart,
    end: context.timeWindowEnd,
  });

  const totalCompanies = context.companies.length;
  const totalDevices = context.devices.length;
  const activeDevices = context.devices.filter(
    (device) => device.status === "active",
  ).length;
  const totalDataUsage = sum(
    context.devices.map((device) => device.dataUsageGb),
  );
  const totalAlerts = sum(context.devices.map((device) => device.alertsCount));
  const monthlyRevenue = sum(
    context.companies.map((company) => company.monthlyRevenueUsd),
  );

  const companyRows = buildCompanyTableRows(
    context.companies,
    context.users,
    context.devices,
  );

  const planCounts = {
    starter: context.companies.filter(
      (company) => company.subscriptionPlan === "starter",
    ).length,
    growth: context.companies.filter(
      (company) => company.subscriptionPlan === "growth",
    ).length,
    enterprise: context.companies.filter(
      (company) => company.subscriptionPlan === "enterprise",
    ).length,
  };

  const industries = new Map<string, number>();
  context.companies.forEach((company) => {
    industries.set(
      company.industry,
      (industries.get(company.industry) ?? 0) + 1,
    );
  });

  const topActiveCompanies = [...companyRows]
    .sort((a, b) => b.activePercentage - a.activePercentage)
    .slice(0, 5);

  return {
    kpis: [
      {
        id: "total-companies",
        label: "Total Companies",
        value: formatCompactNumber(totalCompanies),
        delta: percentageDelta(totalCompanies, Math.max(totalCompanies - 1, 1)),
        trend: "up",
      },
      {
        id: "total-devices",
        label: "Total Devices",
        value: formatCompactNumber(totalDevices),
        delta: percentageDelta(totalDevices, Math.max(totalDevices - 5, 1)),
        trend: "up",
      },
      {
        id: "active-devices",
        label: "Active Devices",
        value: formatCompactNumber(activeDevices),
        delta: percentageDelta(activeDevices, Math.max(activeDevices - 4, 1)),
        trend: "up",
        tone: "success",
      },
      {
        id: "data-usage",
        label: "Data Usage",
        value: formatDataUsage(totalDataUsage),
        delta: "+7.2%",
        trend: "up",
        tone: "info",
      },
      {
        id: "total-alerts",
        label: "Total Alerts",
        value: formatCompactNumber(totalAlerts),
        delta: "-3.4%",
        trend: "down",
        tone: "warning",
      },
      {
        id: "monthly-revenue",
        label: "Monthly Revenue",
        value: formatCurrency(monthlyRevenue),
        delta: "+4.9%",
        trend: "up",
      },
    ],
    companyGrowthTrend: {
      categories: monthLabelsFromCurrentYear(),
      series: [
        {
          name: "Companies",
          data: buildTrendValues(
            12,
            Math.max(1, Math.round(totalCompanies / 2)),
            {
              growth: 0.4,
              volatility: 0.7,
              floor: 1,
            },
          ),
        },
      ],
    },
    subscriptionPlanDistribution: {
      labels: ["Starter", "Growth", "Enterprise"],
      series: [planCounts.starter, planCounts.growth, planCounts.enterprise],
    },
    dataUsageTrend: {
      categories,
      series: [
        {
          name: "Data Usage (GB)",
          data: buildTrendValues(
            categories.length,
            Math.max(40, totalDataUsage / 9),
            {
              growth: 2.4,
              volatility: 10,
              floor: 10,
            },
          ),
        },
      ],
    },
    companiesByIndustry: {
      categories: [...industries.keys()],
      series: [{ name: "Companies", data: [...industries.values()] }],
    },
    topActiveCompanies: {
      categories: topActiveCompanies.map((row) => row.companyName),
      series: [
        {
          name: "Active Percentage",
          data: topActiveCompanies.map((row) =>
            Number(row.activePercentage.toFixed(1)),
          ),
        },
      ],
    },
    companies: companyRows,
  };
}

export function buildDashboardOverviewData(
  filters: AnalyticsFilters,
): DashboardOverviewData {
  const context = getFilterContext(filters);
  const categories = getTimeCategories(filters.dateRange, {
    start: context.timeWindowStart,
    end: context.timeWindowEnd,
  });

  const totalCompanies = context.companies.length;
  const totalUsers = context.users.length;
  const totalDevices = context.devices.length;
  const activeDevices = context.devices.filter(
    (device) => device.status === "active",
  ).length;
  const activeUsers = context.users.filter(
    (user) => user.status === "active",
  ).length;
  const totalRevenue = sum(
    context.companies.map((company) => company.monthlyRevenueUsd),
  );
  const totalAlerts = sum(context.devices.map((device) => device.alertsCount));

  return {
    kpis: [
      {
        id: "overview-companies",
        label: "Companies",
        value: formatCompactNumber(totalCompanies),
        delta: percentageDelta(totalCompanies, Math.max(totalCompanies - 1, 1)),
        trend: "up",
      },
      {
        id: "overview-users",
        label: "Users",
        value: formatCompactNumber(totalUsers),
        delta: percentageDelta(totalUsers, Math.max(totalUsers - 5, 1)),
        trend: "up",
      },
      {
        id: "overview-devices",
        label: "Devices",
        value: formatCompactNumber(totalDevices),
        delta: percentageDelta(totalDevices, Math.max(totalDevices - 7, 1)),
        trend: "up",
      },
      {
        id: "overview-revenue",
        label: "Monthly Revenue",
        value: formatCurrency(totalRevenue),
        delta: "+5.6%",
        trend: "up",
      },
      {
        id: "overview-alerts",
        label: "Active Alerts",
        value: formatCompactNumber(totalAlerts),
        delta: "-2.8%",
        trend: "down",
        tone: "warning",
      },
    ],
    platformActivityTrend: {
      categories,
      series: [
        {
          name: "Active Devices",
          data: buildTrendValues(
            categories.length,
            Math.max(2, activeDevices),
            {
              growth: 0.8,
              volatility: 3,
              floor: 0,
            },
          ),
        },
        {
          name: "Active Users",
          data: buildTrendValues(categories.length, Math.max(2, activeUsers), {
            growth: 0.5,
            volatility: 2,
            floor: 0,
          }),
        },
      ],
    },
    platformUsageSplit: {
      labels: ["Device Monitoring", "Reports", "Alerts", "Dashboard"],
      series: [
        average(
          context.users.map((user) => user.featureUsage.deviceMonitoring),
        ),
        average(context.users.map((user) => user.featureUsage.reports)),
        average(context.users.map((user) => user.featureUsage.alerts)),
        average(context.users.map((user) => user.featureUsage.dashboardUsage)),
      ].map((value) => Number(formatPercent(value).replace("%", ""))),
    },
  };
}

export function findCompanyName(companyId: string) {
  return (
    companies.find((company) => company.id === companyId)?.name ??
    "Unknown Company"
  );
}

export function formatCompanyLastActive(dateString: string) {
  return formatRelativeTime(dateString);
}
