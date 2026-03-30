export type DateRangePreset = "today" | "week" | "month" | "year" | "custom";

export type SubscriptionPlan = "starter" | "growth" | "enterprise";

export type DeviceType =
  | "gateway"
  | "sensor"
  | "camera"
  | "controller"
  | "meter";

export type DeviceStatus = "active" | "inactive" | "faulty" | "disabled";

export type UserStatus = "active" | "inactive";

export type FeatureUsageKey =
  | "deviceMonitoring"
  | "reports"
  | "alerts"
  | "dashboardUsage";

export interface Account {
  id: string;
  companyId: string;
  plan: SubscriptionPlan;
  seats: number;
  renewsAt: string;
  dueAmountUsd: number;
  isPastDue: boolean;
}

export interface Project {
  id: string;
  companyId: string;
  name: string;
  status: "active" | "paused" | "archived";
  deviceIds: string[];
  createdAt: string;
}

export interface Device {
  id: string;
  companyId: string;
  projectId: string;
  name: string;
  serialNumber: string;
  category: string;
  type: DeviceType;
  userAssignedId: string;
  manufacturer: string;
  model: string;
  firmwareVersion: string;
  macAddress: string;
  status: DeviceStatus;
  location: string;
  bandwidthMbps: number;
  dataUsageGb: number;
  alertsCount: number;
  createdAt: string;
  lastSeenAt: string;
}

export interface User {
  id: string;
  companyId: string;
  username: string;
  fullName: string;
  status: UserStatus;
  subscriptionPlan: SubscriptionPlan;
  joinedAt: string;
  renewalDate: string;
  totalUsageHours: number;
  retentionRate: number;
  uptimePercent: number;
  monthlyRevenueUsd: number;
  featureUsage: Record<FeatureUsageKey, number>;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  subscriptionPlan: SubscriptionPlan;
  createdAt: string;
  lastActiveAt: string;
  monthlyRevenueUsd: number;
}

export interface Notification {
  id: string;
  companyId: string;
  type: "incident" | "billing" | "device" | "security";
  message: string;
  severity: "low" | "medium" | "high";
  createdAt: string;
  isRead: boolean;
}

export interface AnalyticsFilters {
  dateRange: DateRangePreset;
  customStartDate: string | null;
  customEndDate: string | null;
  companyId: string;
  deviceType: DeviceType | "all";
  location: string;
  subscriptionPlan: SubscriptionPlan | "all";
}

export interface AnalyticsFilterOptions {
  companies: Array<{ id: string; name: string }>;
  deviceTypes: DeviceType[];
  locations: string[];
  subscriptionPlans: SubscriptionPlan[];
}

export interface ChartSeries {
  name: string;
  data: number[];
}

export interface AxisChartData {
  categories: string[];
  series: ChartSeries[];
}

export interface PieChartData {
  labels: string[];
  series: number[];
}

export type KpiTrend = "up" | "down" | "neutral";

export type KpiTone = "default" | "success" | "warning" | "danger" | "info";

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: KpiTrend;
  helperText?: string;
  tone?: KpiTone;
}

export interface DeviceTableRow {
  id: string;
  deviceName: string;
  serialNumber: string;
  category: string;
  userAssigned: string;
  manufacturerModel: string;
  firmwareVersion: string;
  macAddress: string;
  dataUsageGb: number;
}

export interface UserTableRow {
  id: string;
  username: string;
  subscriptionPlan: SubscriptionPlan;
  status: UserStatus;
  renewalDate: string;
  totalUsageTime: string;
}

export interface CompanyTableRow {
  id: string;
  companyName: string;
  devicesCount: number;
  activePercentage: number;
  dataUsageGb: number;
  alertsCount: number;
  users: number;
  lastActiveTime: string;
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

export interface DeviceAnalyticsData {
  kpis: KpiMetric[];
  devicesDataTrend: AxisChartData;
  yearOverYearGrowth: AxisChartData;
  topIndustries: PieChartData;
  brandsAndModels: BrandModelEntry[];
  regions: RegionEntry[];
  yearOverYearGrowthArea: AxisChartData;
  topDevices: DeviceTableRow[];
}

export interface UserAnalyticsData {
  kpis: KpiMetric[];
  newRegistrationsTrend: AxisChartData;
  retentionRateTrend: AxisChartData;
  averageUptimeTrend: AxisChartData;
  featureUsage: AxisChartData;
  topUsers: UserTableRow[];
}

export interface CompanyAnalyticsData {
  kpis: KpiMetric[];
  companyGrowthTrend: AxisChartData;
  subscriptionPlanDistribution: PieChartData;
  dataUsageTrend: AxisChartData;
  companiesByIndustry: AxisChartData;
  topActiveCompanies: AxisChartData;
  companies: CompanyTableRow[];
}

export interface DashboardOverviewData {
  kpis: KpiMetric[];
  platformActivityTrend: AxisChartData;
  platformUsageSplit: PieChartData;
}

export interface ChartSelectionDetail {
  chartTitle: string;
  seriesName: string;
  label: string;
  value: number;
}
