"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApexOptions } from "apexcharts";
import {
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoPeopleOutline,
  IoPersonAddOutline,
  IoTimerOutline,
} from "react-icons/io5";
import { useState } from "react";
import { KpiGrid } from "@/components/cards/kpi-grid";
import { AnalyticsChartCard } from "@/components/charts/chart-card";
import { ChartFilterGroup } from "@/components/filters/chart-filter-group";
import { AnalyticsShell } from "@/components/layout/analytics-shell";
import {
  AnalyticsEmptyState,
  AnalyticsErrorState,
  AnalyticsLoadingState,
} from "@/components/layout/analytics-state";
import {
  AnalyticsDataTable,
  type TableColumn,
} from "@/components/tables/analytics-data-table";
import { defaultAnalyticsFilters } from "@/data/mockData";
import { useAnalyticsFilterOptions } from "@/hooks/use-analytics-filter-options";
import { useDemoSession } from "@/hooks/use-demo-session";
import { fetchUserAnalytics } from "@/lib/api";
import { formatDate } from "@/lib/helpers";
import type { AnalyticsFilters, UserTableRow } from "@/types/models";

const iconMap = {
  "total-users": IoPeopleOutline,
  "active-users": IoCheckmarkCircleOutline,
  "inactive-users": IoTimerOutline,
  "total-revenue": IoCashOutline,
  "due-subscription": IoPersonAddOutline,
};

const columns: TableColumn<UserTableRow>[] = [
  {
    key: "username",
    header: "Username",
    render: (row) => (
      <span className="font-medium text-foreground">{row.username}</span>
    ),
  },
  {
    key: "subscriptionPlan",
    header: "Subscription Plan",
    render: (row) => row.subscriptionPlan,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          row.status === "active"
            ? "bg-success/20 text-success"
            : "bg-warning/20 text-warning"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "renewalDate",
    header: "Renewal Date",
    render: (row) => formatDate(row.renewalDate),
  },
  {
    key: "totalUsageTime",
    header: "Total Usage Time",
    render: (row) => row.totalUsageTime,
  },
];

export function UserAnalyticsView() {
  const session = useDemoSession();
  const filterOptionsQuery = useAnalyticsFilterOptions();
  const filterOptions = filterOptionsQuery.data;
  const canManageUsers = session?.role === "company";
  const showCompanyFilters = session?.role !== "iot_user";

  const defaultSummaryFilters = defaultAnalyticsFilters;
  const defaultRegistrationsFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
    dateRange: "week",
  };
  const defaultRetentionFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
    dateRange: "month",
  };
  const defaultUptimeFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
    dateRange: "month",
  };
  const defaultFeatureUsageFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
    dateRange: "month",
  };

  const [registrationsFilters, setRegistrationsFilters] =
    useState<AnalyticsFilters>(() => defaultRegistrationsFilters);
  const [retentionFilters, setRetentionFilters] = useState<AnalyticsFilters>(
    () => defaultRetentionFilters,
  );
  const [uptimeFilters, setUptimeFilters] = useState<AnalyticsFilters>(
    () => defaultUptimeFilters,
  );
  const [featureUsageFilters, setFeatureUsageFilters] =
    useState<AnalyticsFilters>(() => defaultFeatureUsageFilters);

  const resetAllCharts = () => {
    setRegistrationsFilters(defaultRegistrationsFilters);
    setRetentionFilters(defaultRetentionFilters);
    setUptimeFilters(defaultUptimeFilters);
    setFeatureUsageFilters(defaultFeatureUsageFilters);
  };

  const summaryQuery = useQuery({
    queryKey: ["analytics", "user", "summary", defaultSummaryFilters],
    queryFn: () => fetchUserAnalytics(defaultSummaryFilters),
  });

  const registrationsQuery = useQuery({
    queryKey: ["analytics", "user", "registrations", registrationsFilters],
    queryFn: () => fetchUserAnalytics(registrationsFilters),
    placeholderData: summaryQuery.data,
  });

  const retentionQuery = useQuery({
    queryKey: ["analytics", "user", "retention", retentionFilters],
    queryFn: () => fetchUserAnalytics(retentionFilters),
    placeholderData: summaryQuery.data,
  });

  const uptimeQuery = useQuery({
    queryKey: ["analytics", "user", "uptime", uptimeFilters],
    queryFn: () => fetchUserAnalytics(uptimeFilters),
    placeholderData: summaryQuery.data,
  });

  const featureUsageQuery = useQuery({
    queryKey: ["analytics", "user", "feature-usage", featureUsageFilters],
    queryFn: () => fetchUserAnalytics(featureUsageFilters),
    placeholderData: summaryQuery.data,
  });

  const registrationsOptions: ApexOptions = {
    chart: { type: "line" },
    xaxis: {
      categories: registrationsQuery.data?.newRegistrationsTrend.categories,
    },
    yaxis: { labels: { formatter: (value) => `${Math.round(value)}` } },
  };

  const retentionOptions: ApexOptions = {
    chart: { type: "area" },
    xaxis: { categories: retentionQuery.data?.retentionRateTrend.categories },
    yaxis: { labels: { formatter: (value) => `${value.toFixed(0)}%` } },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.45, opacityTo: 0.08 },
    },
  };

  const uptimeOptions: ApexOptions = {
    chart: { type: "line" },
    xaxis: { categories: uptimeQuery.data?.averageUptimeTrend.categories },
    yaxis: { labels: { formatter: (value) => `${value.toFixed(0)}%` } },
  };

  const featureUsageOptions: ApexOptions = {
    chart: { type: "bar" },
    xaxis: { categories: featureUsageQuery.data?.featureUsage.categories },
    yaxis: { labels: { formatter: (value) => `${value.toFixed(0)}%` } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "42%" } },
  };

  return (
    <AnalyticsShell
      title="User Analytics"
      description="User growth, retention, uptime, feature usage, and subscription behavior insights."
    >
      {summaryQuery.isLoading ? (
        <AnalyticsLoadingState />
      ) : summaryQuery.isError ? (
        <AnalyticsErrorState
          title="Unable to load user analytics"
          description={
            summaryQuery.error instanceof Error
              ? summaryQuery.error.message
              : "Unknown error"
          }
          onRetry={() => summaryQuery.refetch()}
        />
      ) : summaryQuery.data?.topUsers.length ? (
        <>
          <KpiGrid
            metrics={summaryQuery.data.kpis}
            iconMap={iconMap}
            columnsClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-5"
          />

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="New User Registrations Over Time"
              type="line"
              series={
                registrationsQuery.data?.newRegistrationsTrend.series ?? []
              }
              options={registrationsOptions}
              actions={
                <ChartFilterGroup
                  filters={registrationsFilters}
                  fields={
                    showCompanyFilters
                      ? ["dateRange", "companyId", "subscriptionPlan"]
                      : ["dateRange", "subscriptionPlan"]
                  }
                  options={filterOptions}
                  onChange={setRegistrationsFilters}
                  onReset={() =>
                    setRegistrationsFilters(defaultRegistrationsFilters)
                  }
                />
              }
            />
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="User Retention Rate"
              type="area"
              series={retentionQuery.data?.retentionRateTrend.series ?? []}
              options={retentionOptions}
              actions={
                <ChartFilterGroup
                  filters={retentionFilters}
                  fields={
                    showCompanyFilters
                      ? ["dateRange", "companyId", "subscriptionPlan"]
                      : ["dateRange", "subscriptionPlan"]
                  }
                  options={filterOptions}
                  onChange={setRetentionFilters}
                  onReset={() => setRetentionFilters(defaultRetentionFilters)}
                />
              }
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Average User Uptime"
              type="line"
              series={uptimeQuery.data?.averageUptimeTrend.series ?? []}
              options={uptimeOptions}
              actions={
                <ChartFilterGroup
                  filters={uptimeFilters}
                  fields={
                    showCompanyFilters
                      ? ["dateRange", "companyId", "location"]
                      : ["dateRange", "location"]
                  }
                  options={filterOptions}
                  onChange={setUptimeFilters}
                  onReset={() => setUptimeFilters(defaultUptimeFilters)}
                />
              }
            />
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Feature Usage Analytics"
              type="bar"
              series={featureUsageQuery.data?.featureUsage.series ?? []}
              options={featureUsageOptions}
              description="Device Monitoring, Reports, Alerts, and Dashboard usage"
              actions={
                <ChartFilterGroup
                  filters={featureUsageFilters}
                  fields={
                    showCompanyFilters
                      ? ["dateRange", "companyId", "subscriptionPlan"]
                      : ["dateRange", "subscriptionPlan"]
                  }
                  options={filterOptions}
                  onChange={setFeatureUsageFilters}
                  onReset={() =>
                    setFeatureUsageFilters(defaultFeatureUsageFilters)
                  }
                />
              }
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Top 5 Users
            </h2>
            <AnalyticsDataTable
              rows={summaryQuery.data.topUsers}
              columns={columns}
              rowActions={() =>
                canManageUsers
                  ? [
                      { label: "View" },
                      { label: "Edit" },
                      { label: "Delete", destructive: true },
                    ]
                  : [{ label: "View" }]
              }
            />
          </section>
        </>
      ) : (
        <AnalyticsEmptyState
          title="No users available"
          description="No user analytics match the current selections. Reset chart filters to restore results."
          onReset={resetAllCharts}
        />
      )}
    </AnalyticsShell>
  );
}
