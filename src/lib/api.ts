import {
  analyticsFilterOptions,
  buildCompanyAnalyticsData,
  buildDashboardOverviewData,
  buildDeviceAnalyticsData,
  buildUserAnalyticsData,
} from "@/data/mockData";
import type {
  AnalyticsFilterOptions,
  AnalyticsFilters,
  CompanyAnalyticsData,
  DashboardOverviewData,
  DeviceAnalyticsData,
  UserAnalyticsData,
} from "@/types/models";

const API_DELAY_MS = 420;

function withDelay<T>(result: T) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(result), API_DELAY_MS);
  });
}

export async function fetchAnalyticsFilterOptions(): Promise<AnalyticsFilterOptions> {
  return withDelay(analyticsFilterOptions);
}

export async function fetchOverviewAnalytics(
  filters: AnalyticsFilters,
): Promise<DashboardOverviewData> {
  return withDelay(buildDashboardOverviewData(filters));
}

export async function fetchDeviceAnalytics(
  filters: AnalyticsFilters,
): Promise<DeviceAnalyticsData> {
  return withDelay(buildDeviceAnalyticsData(filters));
}

export async function fetchUserAnalytics(
  filters: AnalyticsFilters,
): Promise<UserAnalyticsData> {
  return withDelay(buildUserAnalyticsData(filters));
}

export async function fetchCompanyAnalytics(
  filters: AnalyticsFilters,
): Promise<CompanyAnalyticsData> {
  return withDelay(buildCompanyAnalyticsData(filters));
}
