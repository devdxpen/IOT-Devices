"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApexOptions } from "apexcharts";
import {
  IoAddCircleOutline,
  IoAlertCircleOutline,
  IoCloudDownloadOutline,
  IoFlashOutline,
  IoPauseCircleOutline,
  IoServerOutline,
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
import { fetchDeviceAnalytics } from "@/lib/api";
import type { AnalyticsFilters, DeviceTableRow } from "@/types/models";

const iconMap = {
  "total-devices": IoServerOutline,
  "active-devices": IoFlashOutline,
  "newly-added": IoAddCircleOutline,
  "inactive-devices": IoPauseCircleOutline,
  "faulty-devices": IoAlertCircleOutline,
  "total-data-usage": IoCloudDownloadOutline,
};

const columns: TableColumn<DeviceTableRow>[] = [
  {
    key: "deviceName",
    header: "Device Name",
    render: (row) => (
      <span className="font-medium text-foreground">{row.deviceName}</span>
    ),
  },
  {
    key: "serialNumber",
    header: "Serial Number",
    render: (row) => row.serialNumber,
  },
  { key: "category", header: "Category", render: (row) => row.category },
  {
    key: "userAssigned",
    header: "User Assigned",
    render: (row) => row.userAssigned,
  },
  {
    key: "manufacturerModel",
    header: "Manufacturer & Model",
    render: (row) => row.manufacturerModel,
  },
  {
    key: "firmwareVersion",
    header: "Firmware Version",
    render: (row) => row.firmwareVersion,
  },
  { key: "macAddress", header: "MAC Address", render: (row) => row.macAddress },
];

export function DeviceAnalyticsView() {
  const session = useDemoSession();
  const filterOptionsQuery = useAnalyticsFilterOptions();
  const filterOptions = filterOptionsQuery.data;
  const canManageDevices = session?.role === "company";
  const showCompanyFilters = session?.role !== "iot_user";

  const defaultSummaryFilters = defaultAnalyticsFilters;
  const defaultBandwidthFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
    dateRange: "week",
  };
  const defaultUsageFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
    dateRange: "month",
  };
  const defaultGrowthFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
    dateRange: "year",
  };
  const defaultStatusFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
  };
  const defaultTopUsageFilters: AnalyticsFilters = {
    ...defaultAnalyticsFilters,
  };

  const [bandwidthFilters, setBandwidthFilters] = useState<AnalyticsFilters>(
    () => defaultBandwidthFilters,
  );
  const [usageFilters, setUsageFilters] = useState<AnalyticsFilters>(
    () => defaultUsageFilters,
  );
  const [growthFilters, setGrowthFilters] = useState<AnalyticsFilters>(
    () => defaultGrowthFilters,
  );
  const [statusFilters, setStatusFilters] = useState<AnalyticsFilters>(
    () => defaultStatusFilters,
  );
  const [topUsageFilters, setTopUsageFilters] = useState<AnalyticsFilters>(
    () => defaultTopUsageFilters,
  );

  const resetAllCharts = () => {
    setBandwidthFilters(defaultBandwidthFilters);
    setUsageFilters(defaultUsageFilters);
    setGrowthFilters(defaultGrowthFilters);
    setStatusFilters(defaultStatusFilters);
    setTopUsageFilters(defaultTopUsageFilters);
  };

  const summaryQuery = useQuery({
    queryKey: ["analytics", "device", "summary", defaultSummaryFilters],
    queryFn: () => fetchDeviceAnalytics(defaultSummaryFilters),
  });

  const bandwidthQuery = useQuery({
    queryKey: ["analytics", "device", "bandwidth", bandwidthFilters],
    queryFn: () => fetchDeviceAnalytics(bandwidthFilters),
    placeholderData: summaryQuery.data,
  });

  const usageQuery = useQuery({
    queryKey: ["analytics", "device", "usage", usageFilters],
    queryFn: () => fetchDeviceAnalytics(usageFilters),
    placeholderData: summaryQuery.data,
  });

  const growthQuery = useQuery({
    queryKey: ["analytics", "device", "growth", growthFilters],
    queryFn: () => fetchDeviceAnalytics(growthFilters),
    placeholderData: summaryQuery.data,
  });

  const statusQuery = useQuery({
    queryKey: ["analytics", "device", "status", statusFilters],
    queryFn: () => fetchDeviceAnalytics(statusFilters),
    placeholderData: summaryQuery.data,
  });

  const topUsageQuery = useQuery({
    queryKey: ["analytics", "device", "top-usage", topUsageFilters],
    queryFn: () => fetchDeviceAnalytics(topUsageFilters),
    placeholderData: summaryQuery.data,
  });

  const bandwidthOptions: ApexOptions = {
    chart: { type: "line" },
    xaxis: { categories: bandwidthQuery.data?.bandwidthUsageTrend.categories },
    yaxis: { labels: { formatter: (value) => `${Math.round(value)} Mbps` } },
  };

  const usageOptions: ApexOptions = {
    chart: { type: "area" },
    xaxis: { categories: usageQuery.data?.dataUsageTrend.categories },
    yaxis: { labels: { formatter: (value) => `${Math.round(value)} GB` } },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.45, opacityTo: 0.08 },
    },
  };

  const yoyOptions: ApexOptions = {
    chart: { type: "bar", stacked: true },
    xaxis: { categories: growthQuery.data?.yearOverYearGrowth.categories },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
  };

  const activeVsDisabledOptions: ApexOptions = {
    labels: statusQuery.data?.activeVsDisabledDevices.labels,
    legend: { position: "bottom" },
    stroke: { width: 0 },
  };

  const topUsageOptions: ApexOptions = {
    chart: { type: "bar" },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
    xaxis: {
      categories: topUsageQuery.data?.topDevicesByDataUsage.categories,
      labels: { formatter: (value) => `${Math.round(Number(value))} GB` },
    },
  };

  return (
    <AnalyticsShell
      title="Device Analytics"
      description="Device performance, usage trends, growth, and top-consumption insights for fleet operations."
    >
      {summaryQuery.isLoading ? (
        <AnalyticsLoadingState />
      ) : summaryQuery.isError ? (
        <AnalyticsErrorState
          title="Unable to load device analytics"
          description={
            summaryQuery.error instanceof Error
              ? summaryQuery.error.message
              : "Unknown error"
          }
          onRetry={() => summaryQuery.refetch()}
        />
      ) : summaryQuery.data?.topDevices.length ? (
        <>
          <KpiGrid
            metrics={summaryQuery.data.kpis}
            iconMap={iconMap}
            columnsClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-6"
          />

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Device Bandwidth Usage Trend"
              type="line"
              series={bandwidthQuery.data?.bandwidthUsageTrend.series ?? []}
              options={bandwidthOptions}
              description="Bandwidth throughput trend for selected filters"
              actions={
                <ChartFilterGroup
                  filters={bandwidthFilters}
                  fields={
                    showCompanyFilters
                      ? ["dateRange", "companyId", "deviceType", "location"]
                      : ["dateRange", "deviceType", "location"]
                  }
                  options={filterOptions}
                  onChange={setBandwidthFilters}
                  onReset={() => setBandwidthFilters(defaultBandwidthFilters)}
                />
              }
            />
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Device Data Usage Trend"
              type="area"
              series={usageQuery.data?.dataUsageTrend.series ?? []}
              options={usageOptions}
              description="Data volume consumed by devices"
              actions={
                <ChartFilterGroup
                  filters={usageFilters}
                  fields={
                    showCompanyFilters
                      ? ["dateRange", "companyId", "deviceType", "location"]
                      : ["dateRange", "deviceType", "location"]
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
              className="xl:col-span-6"
              title="Year-over-Year Device Growth"
              type="bar"
              series={growthQuery.data?.yearOverYearGrowth.series ?? []}
              options={yoyOptions}
              description="Active vs disabled device growth"
              actions={
                <ChartFilterGroup
                  filters={growthFilters}
                  fields={
                    showCompanyFilters
                      ? ["dateRange", "companyId", "deviceType"]
                      : ["dateRange", "deviceType"]
                  }
                  options={filterOptions}
                  onChange={setGrowthFilters}
                  onReset={() => setGrowthFilters(defaultGrowthFilters)}
                />
              }
            />
            <AnalyticsChartCard
              className="xl:col-span-3"
              title="Active vs Disabled Devices"
              type="donut"
              series={statusQuery.data?.activeVsDisabledDevices.series ?? []}
              options={activeVsDisabledOptions}
              actions={
                <ChartFilterGroup
                  filters={statusFilters}
                  fields={
                    showCompanyFilters
                      ? ["companyId", "deviceType", "location"]
                      : ["deviceType", "location"]
                  }
                  options={filterOptions}
                  onChange={setStatusFilters}
                  onReset={() => setStatusFilters(defaultStatusFilters)}
                />
              }
            />
            <AnalyticsChartCard
              className="xl:col-span-3"
              title="Top Devices by Data Usage"
              type="bar"
              series={topUsageQuery.data?.topDevicesByDataUsage.series ?? []}
              options={topUsageOptions}
              actions={
                <ChartFilterGroup
                  filters={topUsageFilters}
                  fields={
                    showCompanyFilters
                      ? ["companyId", "deviceType", "location"]
                      : ["deviceType", "location"]
                  }
                  options={filterOptions}
                  onChange={setTopUsageFilters}
                  onReset={() => setTopUsageFilters(defaultTopUsageFilters)}
                />
              }
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Top 5 Devices
            </h2>
            <AnalyticsDataTable
              rows={summaryQuery.data.topDevices}
              columns={columns}
              rowActions={() =>
                canManageDevices
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
          title="No devices available"
          description="No device analytics match the current selections. Reset chart filters to see full fleet data."
          onReset={resetAllCharts}
        />
      )}
    </AnalyticsShell>
  );
}
