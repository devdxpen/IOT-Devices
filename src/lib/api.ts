import {
  buildAnalyticsFilterOptions,
  buildCompanyAnalyticsData,
  buildDashboardOverviewData,
  buildDeviceAnalyticsData,
  buildUserAnalyticsData,
} from "@/data/mockData";
import { readDemoSession } from "@/lib/auth/demo-auth";
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

function requireSession() {
  const session = readDemoSession();
  if (!session) {
    throw new Error("Please login to access analytics.");
  }
  return session;
}

export async function fetchAnalyticsFilterOptions(): Promise<AnalyticsFilterOptions> {
  const session = requireSession();
  return withDelay(buildAnalyticsFilterOptions(session));
}

export async function fetchOverviewAnalytics(
  filters: AnalyticsFilters,
): Promise<DashboardOverviewData> {
  const session = requireSession();
  return withDelay(buildDashboardOverviewData(filters, session));
}

export async function fetchDeviceAnalytics(
  filters: AnalyticsFilters,
): Promise<DeviceAnalyticsData> {
  const session = requireSession();
  return withDelay(buildDeviceAnalyticsData(filters, session));
}

export async function fetchUserAnalytics(
  filters: AnalyticsFilters,
): Promise<UserAnalyticsData> {
  const session = requireSession();
  return withDelay(buildUserAnalyticsData(filters, session));
}

export async function fetchCompanyAnalytics(
  filters: AnalyticsFilters,
): Promise<CompanyAnalyticsData> {
  const session = requireSession();
  return withDelay(buildCompanyAnalyticsData(filters, session));
}
