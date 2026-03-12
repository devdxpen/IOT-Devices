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
import { fetchDeviceAnalytics } from "@/lib/api";
import type { DeviceTableRow } from "@/types/models";

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
  const { filters, resetFilters } = useAnalyticsFilters((state) => ({
    filters: state.filters,
    resetFilters: state.resetFilters,
  }));

  const query = useQuery({
    queryKey: ["analytics", "device", filters],
    queryFn: () => fetchDeviceAnalytics(filters),
  });

  const bandwidthOptions: ApexOptions = {
    chart: { type: "line" },
    xaxis: { categories: query.data?.bandwidthUsageTrend.categories },
    yaxis: { labels: { formatter: (value) => `${Math.round(value)} Mbps` } },
  };

  const usageOptions: ApexOptions = {
    chart: { type: "area" },
    xaxis: { categories: query.data?.dataUsageTrend.categories },
    yaxis: { labels: { formatter: (value) => `${Math.round(value)} GB` } },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.45, opacityTo: 0.08 },
    },
  };

  const yoyOptions: ApexOptions = {
    chart: { type: "bar", stacked: true },
    xaxis: { categories: query.data?.yearOverYearGrowth.categories },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
  };

  const activeVsDisabledOptions: ApexOptions = {
    labels: query.data?.activeVsDisabledDevices.labels,
    legend: { position: "bottom" },
    stroke: { width: 0 },
  };

  const topUsageOptions: ApexOptions = {
    chart: { type: "bar" },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
    xaxis: {
      categories: query.data?.topDevicesByDataUsage.categories,
      labels: { formatter: (value) => `${Math.round(Number(value))} GB` },
    },
  };

  return (
    <AnalyticsShell
      title="Device Analytics"
      description="Device performance, usage trends, growth, and top-consumption insights for fleet operations."
    >
      {query.isLoading ? (
        <AnalyticsLoadingState />
      ) : query.isError ? (
        <AnalyticsErrorState
          title="Unable to load device analytics"
          description={
            query.error instanceof Error ? query.error.message : "Unknown error"
          }
          onRetry={() => query.refetch()}
        />
      ) : query.data?.topDevices.length ? (
        <>
          <KpiGrid
            metrics={query.data.kpis}
            iconMap={iconMap}
            columnsClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-6"
          />

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Device Bandwidth Usage Trend"
              type="line"
              series={query.data.bandwidthUsageTrend.series}
              options={bandwidthOptions}
              description="Bandwidth throughput trend for selected filters"
            />
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Device Data Usage Trend"
              type="area"
              series={query.data.dataUsageTrend.series}
              options={usageOptions}
              description="Data volume consumed by devices"
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-6"
              title="Year-over-Year Device Growth"
              type="bar"
              series={query.data.yearOverYearGrowth.series}
              options={yoyOptions}
              description="Active vs disabled device growth"
            />
            <AnalyticsChartCard
              className="xl:col-span-3"
              title="Active vs Disabled Devices"
              type="donut"
              series={query.data.activeVsDisabledDevices.series}
              options={activeVsDisabledOptions}
            />
            <AnalyticsChartCard
              className="xl:col-span-3"
              title="Top Devices by Data Usage"
              type="bar"
              series={query.data.topDevicesByDataUsage.series}
              options={topUsageOptions}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Top 5 Devices
            </h2>
            <AnalyticsDataTable
              rows={query.data.topDevices}
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
          title="No devices available"
          description="No device analytics match the selected filters. Reset filters to see full fleet data."
          onReset={resetFilters}
        />
      )}
    </AnalyticsShell>
  );
}
