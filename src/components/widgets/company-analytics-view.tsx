"use client";

import { useQuery } from "@tanstack/react-query";
import {
  IoAlertCircleOutline,
  IoBusinessOutline,
  IoCashOutline,
  IoCloudDownloadOutline,
  IoFlashOutline,
  IoHardwareChipOutline,
} from "react-icons/io5";
import { useState } from "react";
import { KpiGrid } from "@/components/cards/kpi-grid";
import type { ApexOptions } from "@/components/charts/apex-chart";
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
import { defaultAnalyticsFilters, formatCompanyLastActive } from "@/data/mockData";
import { useAnalyticsFilterOptions } from "@/hooks/use-analytics-filter-options";
import { useDemoSession } from "@/hooks/use-demo-session";
import { fetchCompanyAnalytics } from "@/lib/api";
import type { AnalyticsFilters, CompanyTableRow } from "@/types/models";

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
  const session = useDemoSession();
  const filterOptionsQuery = useAnalyticsFilterOptions();
  const filterOptions = filterOptionsQuery.data;
  const canManageCompany = session?.role === "company";
  const showCompanyFilters = session?.role !== "iot_user";

  const defaultSummaryFilters = defaultAnalyticsFilters;
  const defaultGrowthFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
    dateRange: "year",
  };
  const defaultUsageFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
    dateRange: "month",
  };
  const defaultPlanFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
  };
  const defaultIndustryFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
  };
  const defaultTopActiveFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
  };

  const [growthFilters, setGrowthFilters] = useState<AnalyticsFilters>(
    () => defaultGrowthFilters,
  );
  const [usageFilters, setUsageFilters] = useState<AnalyticsFilters>(
    () => defaultUsageFilters,
  );
  const [planFilters, setPlanFilters] = useState<AnalyticsFilters>(
    () => defaultPlanFilters,
  );
  const [industryFilters, setIndustryFilters] = useState<AnalyticsFilters>(
    () => defaultIndustryFilters,
  );
  const [topActiveFilters, setTopActiveFilters] = useState<AnalyticsFilters>(
    () => defaultTopActiveFilters,
  );

  const resetAllCharts = () => {
    setGrowthFilters(defaultGrowthFilters);
    setUsageFilters(defaultUsageFilters);
    setPlanFilters(defaultPlanFilters);
    setIndustryFilters(defaultIndustryFilters);
    setTopActiveFilters(defaultTopActiveFilters);
  };

  const summaryQuery = useQuery({
    queryKey: ["analytics", "company", "summary", defaultSummaryFilters],
    queryFn: () => fetchCompanyAnalytics(defaultSummaryFilters),
  });

  const growthQuery = useQuery({
    queryKey: ["analytics", "company", "growth", growthFilters],
    queryFn: () => fetchCompanyAnalytics(growthFilters),
    placeholderData: summaryQuery.data,
  });

  const usageQuery = useQuery({
    queryKey: ["analytics", "company", "usage", usageFilters],
    queryFn: () => fetchCompanyAnalytics(usageFilters),
    placeholderData: summaryQuery.data,
  });

  const planQuery = useQuery({
    queryKey: ["analytics", "company", "plan-distribution", planFilters],
    queryFn: () => fetchCompanyAnalytics(planFilters),
    placeholderData: summaryQuery.data,
  });

  const industryQuery = useQuery({
    queryKey: ["analytics", "company", "industry", industryFilters],
    queryFn: () => fetchCompanyAnalytics(industryFilters),
    placeholderData: summaryQuery.data,
  });

  const topActiveQuery = useQuery({
    queryKey: ["analytics", "company", "top-active", topActiveFilters],
    queryFn: () => fetchCompanyAnalytics(topActiveFilters),
    placeholderData: summaryQuery.data,
  });

  const growthOptions: ApexOptions = {
    chart: { type: "line" },
    xaxis: { categories: growthQuery.data?.companyGrowthTrend.categories },
  };

  const planOptions: ApexOptions = {
    labels: planQuery.data?.subscriptionPlanDistribution.labels,
    legend: { position: "bottom" },
    stroke: { width: 0 },
  };

  const usageOptions: ApexOptions = {
    chart: { type: "area" },
    xaxis: { categories: usageQuery.data?.dataUsageTrend.categories },
    yaxis: { labels: { formatter: (value) => `${Math.round(value)} GB` } },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.45, opacityTo: 0.1 },
    },
  };

  const industryOptions: ApexOptions = {
    chart: { type: "bar" },
    xaxis: { categories: industryQuery.data?.companiesByIndustry.categories },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "48%" } },
  };

  const topActiveOptions: ApexOptions = {
    chart: { type: "bar" },
    xaxis: { categories: topActiveQuery.data?.topActiveCompanies.categories },
    yaxis: { labels: { formatter: (value) => `${value.toFixed(0)}%` } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
  };

  return (
    <AnalyticsShell
      title="Company Analytics"
      description="Company-level growth, subscription mix, usage trends, and operational health."
    >
      {summaryQuery.isLoading ? (
        <AnalyticsLoadingState />
      ) : summaryQuery.isError ? (
        <AnalyticsErrorState
          title="Unable to load company analytics"
          description={
            summaryQuery.error instanceof Error
              ? summaryQuery.error.message
              : "Unknown error"
          }
          onRetry={() => summaryQuery.refetch()}
        />
      ) : summaryQuery.data?.companies.length ? (
        <>
          <KpiGrid
            metrics={summaryQuery.data.kpis}
            iconMap={iconMap}
            columnsClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-6"
          />

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Company Growth Trend"
              type="line"
              series={growthQuery.data?.companyGrowthTrend.series ?? []}
              options={growthOptions}
              actions={
                <ChartFilterGroup
                  filters={growthFilters}
                  fields={
                    showCompanyFilters
                      ? ["dateRange", "companyId", "location"]
                      : ["dateRange", "location"]
                  }
                  options={filterOptions}
                  onChange={setGrowthFilters}
                  onReset={() => setGrowthFilters(defaultGrowthFilters)}
                />
              }
            />
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Data Usage Trend"
              type="area"
              series={usageQuery.data?.dataUsageTrend.series ?? []}
              options={usageOptions}
              actions={
                <ChartFilterGroup
                  filters={usageFilters}
                  fields={
                    showCompanyFilters
                      ? ["dateRange", "companyId", "location"]
                      : ["dateRange", "location"]
                  }
                  options={filterOptions}
                  onChange={setUsageFilters}
                  onReset={() => setUsageFilters(defaultUsageFilters)}
                />
              }
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-4"
              title="Subscription Plan Distribution"
              type="pie"
              series={
                planQuery.data?.subscriptionPlanDistribution.series ?? []
              }
              options={planOptions}
              actions={
                <ChartFilterGroup
                  filters={planFilters}
                  fields={
                    showCompanyFilters
                      ? ["companyId", "location"]
                      : ["location"]
                  }
                  options={filterOptions}
                  onChange={setPlanFilters}
                  onReset={() => setPlanFilters(defaultPlanFilters)}
                />
              }
            />
            <AnalyticsChartCard
              className="xl:col-span-4"
              title="Companies by Industry"
              type="bar"
              series={industryQuery.data?.companiesByIndustry.series ?? []}
              options={industryOptions}
              actions={
                <ChartFilterGroup
                  filters={industryFilters}
                  fields={
                    showCompanyFilters
                      ? ["companyId", "location", "subscriptionPlan"]
                      : ["location", "subscriptionPlan"]
                  }
                  options={filterOptions}
                  onChange={setIndustryFilters}
                  onReset={() => setIndustryFilters(defaultIndustryFilters)}
                />
              }
            />
            <AnalyticsChartCard
              className="xl:col-span-4"
              title="Top Active Companies"
              type="bar"
              series={topActiveQuery.data?.topActiveCompanies.series ?? []}
              options={topActiveOptions}
              actions={
                <ChartFilterGroup
                  filters={topActiveFilters}
                  fields={
                    showCompanyFilters
                      ? ["companyId", "location", "subscriptionPlan"]
                      : ["location", "subscriptionPlan"]
                  }
                  options={filterOptions}
                  onChange={setTopActiveFilters}
                  onReset={() => setTopActiveFilters(defaultTopActiveFilters)}
                />
              }
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Company Details
            </h2>
            <AnalyticsDataTable
              rows={summaryQuery.data.companies}
              columns={columns}
              rowActions={() =>
                canManageCompany
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
          title="No companies available"
          description="No company analytics match the current selections. Reset chart filters to restore data."
          onReset={resetAllCharts}
        />
      )}
    </AnalyticsShell>
  );
}
