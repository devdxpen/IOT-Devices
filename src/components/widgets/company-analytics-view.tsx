"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApexOptions } from "apexcharts";
import {
  IoAlertCircleOutline,
  IoBusinessOutline,
  IoCashOutline,
  IoCloudDownloadOutline,
  IoFlashOutline,
  IoHardwareChipOutline,
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
import { formatCompanyLastActive } from "@/data/mockData";
import { useAnalyticsFilters } from "@/hooks/use-analytics-filters";
import { fetchCompanyAnalytics } from "@/lib/api";
import type { CompanyTableRow } from "@/types/models";

const iconMap = {
  "total-companies": IoBusinessOutline,
  "total-devices": IoHardwareChipOutline,
  "active-devices": IoFlashOutline,
  "data-usage": IoCloudDownloadOutline,
  "total-alerts": IoAlertCircleOutline,
  "monthly-revenue": IoCashOutline,
};

const columns: TableColumn<CompanyTableRow>[] = [
  {
    key: "companyName",
    header: "Company Name",
    render: (row) => (
      <span className="font-medium text-foreground">{row.companyName}</span>
    ),
  },
  {
    key: "devicesCount",
    header: "Devices Count",
    render: (row) => row.devicesCount,
  },
  {
    key: "activePercentage",
    header: "Active Percentage",
    render: (row) => `${row.activePercentage}%`,
  },
  {
    key: "dataUsageGb",
    header: "Data Usage",
    render: (row) => `${row.dataUsageGb} GB`,
  },
  {
    key: "alertsCount",
    header: "Alerts Count",
    render: (row) => row.alertsCount,
  },
  { key: "users", header: "Users", render: (row) => row.users },
  {
    key: "lastActiveTime",
    header: "Last Active Time",
    render: (row) => formatCompanyLastActive(row.lastActiveTime),
  },
];

export function CompanyAnalyticsView() {
  const { filters, resetFilters } = useAnalyticsFilters((state) => ({
    filters: state.filters,
    resetFilters: state.resetFilters,
  }));

  const query = useQuery({
    queryKey: ["analytics", "company", filters],
    queryFn: () => fetchCompanyAnalytics(filters),
  });

  const growthOptions: ApexOptions = {
    chart: { type: "line" },
    xaxis: { categories: query.data?.companyGrowthTrend.categories },
  };

  const planOptions: ApexOptions = {
    labels: query.data?.subscriptionPlanDistribution.labels,
    legend: { position: "bottom" },
    stroke: { width: 0 },
  };

  const usageOptions: ApexOptions = {
    chart: { type: "area" },
    xaxis: { categories: query.data?.dataUsageTrend.categories },
    yaxis: { labels: { formatter: (value) => `${Math.round(value)} GB` } },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.45, opacityTo: 0.1 },
    },
  };

  const industryOptions: ApexOptions = {
    chart: { type: "bar" },
    xaxis: { categories: query.data?.companiesByIndustry.categories },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "48%" } },
  };

  const topActiveOptions: ApexOptions = {
    chart: { type: "bar" },
    xaxis: { categories: query.data?.topActiveCompanies.categories },
    yaxis: { labels: { formatter: (value) => `${value.toFixed(0)}%` } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
  };

  return (
    <AnalyticsShell
      title="Company Analytics"
      description="Company-level growth, subscription mix, usage trends, and operational health."
    >
      {query.isLoading ? (
        <AnalyticsLoadingState />
      ) : query.isError ? (
        <AnalyticsErrorState
          title="Unable to load company analytics"
          description={
            query.error instanceof Error ? query.error.message : "Unknown error"
          }
          onRetry={() => query.refetch()}
        />
      ) : query.data?.companies.length ? (
        <>
          <KpiGrid
            metrics={query.data.kpis}
            iconMap={iconMap}
            columnsClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-6"
          />

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Company Growth Trend"
              type="line"
              series={query.data.companyGrowthTrend.series}
              options={growthOptions}
            />
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Data Usage Trend"
              type="area"
              series={query.data.dataUsageTrend.series}
              options={usageOptions}
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-4"
              title="Subscription Plan Distribution"
              type="pie"
              series={query.data.subscriptionPlanDistribution.series}
              options={planOptions}
            />
            <AnalyticsChartCard
              className="xl:col-span-4"
              title="Companies by Industry"
              type="bar"
              series={query.data.companiesByIndustry.series}
              options={industryOptions}
            />
            <AnalyticsChartCard
              className="xl:col-span-4"
              title="Top Active Companies"
              type="bar"
              series={query.data.topActiveCompanies.series}
              options={topActiveOptions}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Company Details
            </h2>
            <AnalyticsDataTable
              rows={query.data.companies}
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
          title="No companies available"
          description="No company analytics match the selected filters. Reset filters to restore data."
          onReset={resetFilters}
        />
      )}
    </AnalyticsShell>
  );
}
