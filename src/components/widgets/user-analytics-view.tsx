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
import { KpiGrid } from "@/components/cards/kpi-grid";
import { AnalyticsChartCard } from "@/components/charts/chart-card";
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
import { useAnalyticsFilters } from "@/hooks/use-analytics-filters";
import { fetchUserAnalytics } from "@/lib/api";
import { formatDate } from "@/lib/helpers";
import type { UserTableRow } from "@/types/models";

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
  const { filters, resetFilters } = useAnalyticsFilters((state) => ({
    filters: state.filters,
    resetFilters: state.resetFilters,
  }));

  const query = useQuery({
    queryKey: ["analytics", "user", filters],
    queryFn: () => fetchUserAnalytics(filters),
  });

  const registrationsOptions: ApexOptions = {
    chart: { type: "line" },
    xaxis: { categories: query.data?.newRegistrationsTrend.categories },
    yaxis: { labels: { formatter: (value) => `${Math.round(value)}` } },
  };

  const retentionOptions: ApexOptions = {
    chart: { type: "area" },
    xaxis: { categories: query.data?.retentionRateTrend.categories },
    yaxis: { labels: { formatter: (value) => `${value.toFixed(0)}%` } },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.45, opacityTo: 0.08 },
    },
  };

  const uptimeOptions: ApexOptions = {
    chart: { type: "line" },
    xaxis: { categories: query.data?.averageUptimeTrend.categories },
    yaxis: { labels: { formatter: (value) => `${value.toFixed(0)}%` } },
  };

  const featureUsageOptions: ApexOptions = {
    chart: { type: "bar" },
    xaxis: { categories: query.data?.featureUsage.categories },
    yaxis: { labels: { formatter: (value) => `${value.toFixed(0)}%` } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "42%" } },
  };

  return (
    <AnalyticsShell
      title="User Analytics"
      description="User growth, retention, uptime, feature usage, and subscription behavior insights."
    >
      {query.isLoading ? (
        <AnalyticsLoadingState />
      ) : query.isError ? (
        <AnalyticsErrorState
          title="Unable to load user analytics"
          description={
            query.error instanceof Error ? query.error.message : "Unknown error"
          }
          onRetry={() => query.refetch()}
        />
      ) : query.data?.topUsers.length ? (
        <>
          <KpiGrid
            metrics={query.data.kpis}
            iconMap={iconMap}
            columnsClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-5"
          />

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="New User Registrations Over Time"
              type="line"
              series={query.data.newRegistrationsTrend.series}
              options={registrationsOptions}
            />
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="User Retention Rate"
              type="area"
              series={query.data.retentionRateTrend.series}
              options={retentionOptions}
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Average User Uptime"
              type="line"
              series={query.data.averageUptimeTrend.series}
              options={uptimeOptions}
            />
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Feature Usage Analytics"
              type="bar"
              series={query.data.featureUsage.series}
              options={featureUsageOptions}
              description="Device Monitoring, Reports, Alerts, and Dashboard usage"
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Top 5 Users
            </h2>
            <AnalyticsDataTable
              rows={query.data.topUsers}
              columns={columns}
              rowActions={() => [
                { label: "View" },
                { label: "Edit" },
                { label: "Delete", destructive: true },
              ]}
            />
          </section>
        </>
      ) : (
        <AnalyticsEmptyState
          title="No users available"
          description="No user analytics match the selected filters. Reset filters to restore results."
          onReset={resetFilters}
        />
      )}
    </AnalyticsShell>
  );
}
