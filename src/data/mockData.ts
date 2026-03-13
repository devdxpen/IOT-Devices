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
import { snapshotApi } from "@/lib/mock-api/access-control";
import type {
  CompanyEntity,
  DeviceEntity,
  IoTUserEntity,
  SessionUser,
} from "@/types/access-control";
import type {
  AnalyticsFilterOptions,
  AnalyticsFilters,
  CompanyAnalyticsData,
  CompanyTableRow,
  DashboardOverviewData,
  DeviceAnalyticsData,
  DeviceTableRow,
  SubscriptionPlan,
  UserAnalyticsData,
  UserTableRow,
} from "@/types/models";

interface AnalyticsDataset {
  companies: CompanyEntity[];
  iotUsers: IoTUserEntity[];
  devices: DeviceEntity[];
  deviceShares: Array<{
    id: string;
    companyId: string;
    deviceId: string;
    ownerUserId: string;
    targetUserId: string;
    role: "viewer" | "admin";
    sharedAt: string;
  }>;
}

interface FilterContext {
  companies: CompanyEntity[];
  users: IoTUserEntity[];
  devices: DeviceEntity[];
  timeWindowStart: Date;
  timeWindowEnd: Date;
}

const deviceTypeOrder = ["gateway", "sensor", "camera", "controller", "meter"];

export const defaultAnalyticsFilters: AnalyticsFilters = {
  dateRange: "month",
  customStartDate: null,
  customEndDate: null,
  companyId: "all",
  deviceType: "all",
  location: "all",
  subscriptionPlan: "all",
};

function resolveDataset(session?: SessionUser | null): AnalyticsDataset {
  if (session) {
    return snapshotApi.getScopedDataset(session);
  }
  return snapshotApi.getDataset();
}

function buildFilterOptionsFromDataset(
  dataset: AnalyticsDataset,
): AnalyticsFilterOptions {
  return {
    companies: dataset.companies.map((company) => ({
      id: company.id,
      name: company.name,
    })),
    deviceTypes: [...deviceTypeOrder] as AnalyticsFilterOptions["deviceTypes"],
    locations: Array.from(
      new Set(dataset.devices.map((device) => device.location)),
    ).sort(),
    subscriptionPlans: ["starter", "growth", "enterprise"],
  };
}

export const analyticsFilterOptions: AnalyticsFilterOptions =
  buildFilterOptionsFromDataset(resolveDataset());

export function buildAnalyticsFilterOptions(
  session?: SessionUser | null,
): AnalyticsFilterOptions {
  return buildFilterOptionsFromDataset(resolveDataset(session));
}

const percentageDelta = (current: number, baseline: number) => {
  if (baseline <= 0) {
    return current <= 0 ? "0.0%" : "+100.0%";
  }
  const value = ((current - baseline) / baseline) * 100;
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
};

function getFilterContext(
  filters: AnalyticsFilters,
  session?: SessionUser | null,
): FilterContext {
  const dataset = resolveDataset(session);
  const { start, end } = resolveDateWindow(filters);

  const selectedCompanies = dataset.companies.filter((company) => {
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

  const selectedUsers = dataset.iotUsers.filter((user) =>
    companyIds.has(user.companyId),
  );

  const selectedDevices = dataset.devices.filter((device) => {
    if (!companyIds.has(device.companyId)) {
      return false;
    }
    if (filters.deviceType !== "all" && device.type !== filters.deviceType) {
      return false;
    }
    if (filters.location !== "all" && device.location !== filters.location) {
      return false;
    }
    return true;
  });

  return {
    companies: selectedCompanies,
    users: selectedUsers,
    devices: selectedDevices,
    timeWindowStart: start,
    timeWindowEnd: end,
  };
}

function buildDeviceTableRows(
  selectedDevices: DeviceEntity[],
  users: IoTUserEntity[],
): DeviceTableRow[] {
  const userById = new Map(users.map((user) => [user.id, user.fullName]));
  return [...selectedDevices]
    .sort((a, b) => b.dataUsageGb - a.dataUsageGb)
    .slice(0, 5)
    .map((device) => ({
      id: device.id,
      deviceName: device.name,
      serialNumber: device.serialNumber,
      category: device.category,
      userAssigned: userById.get(device.ownerUserId) ?? "Unassigned",
      manufacturerModel: `${device.manufacturer} ${device.model}`,
      firmwareVersion: device.firmwareVersion,
      macAddress: device.macAddress,
      dataUsageGb: device.dataUsageGb,
    }));
}

function buildUserTableRows(
  selectedUsers: IoTUserEntity[],
  companyPlanById: Map<string, SubscriptionPlan>,
): UserTableRow[] {
  return [...selectedUsers]
    .sort((a, b) => b.totalUsageHours - a.totalUsageHours)
    .slice(0, 5)
    .map((user) => ({
      id: user.id,
      username: user.username,
      subscriptionPlan: companyPlanById.get(user.companyId) ?? "starter",
      status: user.status,
      renewalDate: user.renewalDate,
      totalUsageTime: formatHoursAsReadable(user.totalUsageHours),
    }));
}

function buildCompanyTableRows(
  selectedCompanies: CompanyEntity[],
  selectedUsers: IoTUserEntity[],
  selectedDevices: DeviceEntity[],
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
      users: selectedUsers.filter((user) => user.companyId === company.id).length,
      lastActiveTime: company.lastActiveAt,
    };
  });
}

export function buildDeviceAnalyticsData(
  filters: AnalyticsFilters,
  session?: SessionUser | null,
): DeviceAnalyticsData {
  const context = getFilterContext(filters, session);
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
  const totalDataUsageGb = sum(context.devices.map((device) => device.dataUsageGb));

  const avgBandwidth =
    average(context.devices.map((device) => device.bandwidthMbps)) || 18;
  const avgUsage =
    average(context.devices.map((device) => device.dataUsageGb)) || 42;

  const topDeviceRows = buildDeviceTableRows(context.devices, context.users);

  return {
    kpis: [
      {
        id: "total-devices",
        label: "Total Devices",
        value: formatCompactNumber(totalDevices),
        delta: percentageDelta(totalDevices, Math.max(totalDevices - 2, 1)),
        trend: "up",
      },
      {
        id: "active-devices",
        label: "Active Devices",
        value: formatCompactNumber(activeDevices),
        delta: percentageDelta(activeDevices, Math.max(activeDevices - 1, 1)),
        trend: "up",
        tone: "success",
      },
      {
        id: "newly-added",
        label: "Newly Added Devices",
        value: formatCompactNumber(newlyAddedDevices),
        delta: percentageDelta(
          newlyAddedDevices,
          Math.max(newlyAddedDevices - 1, 1),
        ),
        trend: "up",
        tone: "info",
      },
      {
        id: "inactive-devices",
        label: "Inactive Devices",
        value: formatCompactNumber(inactiveDevices),
        delta: percentageDelta(inactiveDevices, Math.max(inactiveDevices + 1, 1)),
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
            volatility: Math.max(2, avgBandwidth * 0.14),
            floor: 1,
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
            growth: Math.max(1, avgUsage * 0.08),
            volatility: Math.max(6, avgUsage * 0.2),
            floor: 2,
          }),
        },
      ],
    },
    yearOverYearGrowth: {
      categories: monthLabelsFromCurrentYear(),
      series: [
        {
          name: "Active Devices",
          data: buildTrendValues(12, Math.max(1, Math.round(activeDevices * 0.45)), {
            growth: 0.2,
            volatility: 1.2,
            floor: 0,
          }),
        },
        {
          name: "Disabled Devices",
          data: buildTrendValues(12, Math.max(0, Math.round(inactiveDevices * 0.4)), {
            growth: 0.1,
            volatility: 1,
            floor: 0,
          }),
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
  session?: SessionUser | null,
): UserAnalyticsData {
  const context = getFilterContext(filters, session);
  const categories = getTimeCategories(filters.dateRange, {
    start: context.timeWindowStart,
    end: context.timeWindowEnd,
  });

  const companyPlanById = new Map(
    context.companies.map((company) => [company.id, company.subscriptionPlan]),
  );

  const totalUsers = context.users.length;
  const activeUsers = context.users.filter((user) => user.status === "active").length;
  const inactiveUsers = context.users.filter(
    (user) => user.status === "inactive",
  ).length;
  const totalRevenue = sum(context.users.map((user) => user.monthlyRevenueUsd));
  const dueSubscriptions = sum(
    context.users
      .filter((user) => new Date(user.renewalDate).valueOf() < Date.now())
      .map(() => 120),
  );

  const avgRetention = average(context.users.map((user) => user.retentionRate)) || 0;
  const avgUptime = average(context.users.map((user) => user.uptimePercent)) || 0;
  const featureAverages = {
    deviceMonitoring:
      average(context.users.map((user) => user.featureUsage.deviceMonitoring)) || 0,
    reports: average(context.users.map((user) => user.featureUsage.reports)) || 0,
    alerts: average(context.users.map((user) => user.featureUsage.alerts)) || 0,
    dashboardUsage:
      average(context.users.map((user) => user.featureUsage.dashboardUsage)) || 0,
  };

  return {
    kpis: [
      {
        id: "total-users",
        label: "Total Users",
        value: formatCompactNumber(totalUsers),
        delta: percentageDelta(totalUsers, Math.max(totalUsers - 2, 1)),
        trend: "up",
      },
      {
        id: "active-users",
        label: "Active Users",
        value: formatCompactNumber(activeUsers),
        delta: percentageDelta(activeUsers, Math.max(activeUsers - 1, 1)),
        trend: "up",
        tone: "success",
      },
      {
        id: "inactive-users",
        label: "Inactive Users",
        value: formatCompactNumber(inactiveUsers),
        delta: percentageDelta(inactiveUsers, Math.max(inactiveUsers + 1, 1)),
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
            Math.max(1, Math.round(totalUsers / 2)),
            {
              growth: 0.4,
              volatility: 2,
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
            growth: 0.15,
            volatility: 2.2,
            floor: 45,
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
            growth: 0.1,
            volatility: 1.6,
            floor: 55,
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
    topUsers: buildUserTableRows(context.users, companyPlanById),
  };
}

export function buildCompanyAnalyticsData(
  filters: AnalyticsFilters,
  session?: SessionUser | null,
): CompanyAnalyticsData {
  const context = getFilterContext(filters, session);
  const categories = getTimeCategories(filters.dateRange, {
    start: context.timeWindowStart,
    end: context.timeWindowEnd,
  });

  const totalCompanies = context.companies.length;
  const totalDevices = context.devices.length;
  const activeDevices = context.devices.filter(
    (device) => device.status === "active",
  ).length;
  const totalDataUsage = sum(context.devices.map((device) => device.dataUsageGb));
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
    industries.set(company.industry, (industries.get(company.industry) ?? 0) + 1);
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
        delta: percentageDelta(totalDevices, Math.max(totalDevices - 2, 1)),
        trend: "up",
      },
      {
        id: "active-devices",
        label: "Active Devices",
        value: formatCompactNumber(activeDevices),
        delta: percentageDelta(activeDevices, Math.max(activeDevices - 1, 1)),
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
          data: buildTrendValues(12, Math.max(1, Math.round(totalCompanies / 2)), {
            growth: 0.25,
            volatility: 0.6,
            floor: 1,
          }),
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
          data: buildTrendValues(categories.length, Math.max(15, totalDataUsage / 6), {
            growth: 1.8,
            volatility: 8,
            floor: 5,
          }),
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
  session?: SessionUser | null,
): DashboardOverviewData {
  const context = getFilterContext(filters, session);
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
  const activeUsers = context.users.filter((user) => user.status === "active").length;
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
        delta: percentageDelta(totalUsers, Math.max(totalUsers - 2, 1)),
        trend: "up",
      },
      {
        id: "overview-devices",
        label: "Devices",
        value: formatCompactNumber(totalDevices),
        delta: percentageDelta(totalDevices, Math.max(totalDevices - 2, 1)),
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
          data: buildTrendValues(categories.length, Math.max(1, activeDevices), {
            growth: 0.5,
            volatility: 2.4,
            floor: 0,
          }),
        },
        {
          name: "Active Users",
          data: buildTrendValues(categories.length, Math.max(1, activeUsers), {
            growth: 0.4,
            volatility: 2,
            floor: 0,
          }),
        },
      ],
    },
    platformUsageSplit: {
      labels: ["Device Monitoring", "Reports", "Alerts", "Dashboard"],
      series: [
        average(context.users.map((user) => user.featureUsage.deviceMonitoring)),
        average(context.users.map((user) => user.featureUsage.reports)),
        average(context.users.map((user) => user.featureUsage.alerts)),
        average(context.users.map((user) => user.featureUsage.dashboardUsage)),
      ].map((value) => Number(formatPercent(value).replace("%", ""))),
    },
  };
}

export const toPlanLabel = (plan: SubscriptionPlan | "all") =>
  plan === "all"
    ? "All Plans"
    : `${plan.charAt(0).toUpperCase()}${plan.slice(1)}`;

export function findCompanyName(companyId: string) {
  return (
    resolveDataset().companies.find((company) => company.id === companyId)?.name ??
    "Unknown Company"
  );
}

export function formatCompanyLastActive(dateString: string) {
  return formatRelativeTime(dateString);
}
