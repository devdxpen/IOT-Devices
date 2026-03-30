"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApexOptions } from "apexcharts";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import {
  IoAlarmOutline,
  IoCashOutline,
  IoLaptopOutline,
  IoTimeOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons/lib";
import { ApexChart } from "@/components/charts/apex-chart";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultAnalyticsFilters } from "@/data/mockData";
import { useDemoSession } from "@/hooks/use-demo-session";
import { fetchDeviceAnalytics } from "@/lib/api";
import { cn } from "@/lib/utils";
import type {
  BrandModelEntry,
  DeviceTableRow,
  KpiMetric,
  RegionEntry,
} from "@/types/models";

// ---------------------------------------------------------------------------
// KPI Card (matches the Figma design card-kpi)
// ---------------------------------------------------------------------------

const kpiIcons: Record<string, IconType> = {
  devices: IoLaptopOutline,
  "avg-devices-per-user": IoLaptopOutline,
  "avg-revenue-per-device": IoCashOutline,
  "avg-uptime": IoTimeOutline,
  "alarms-per-device": IoAlarmOutline,
};

function DeviceKpiCard({ metric }: { metric: KpiMetric }) {
  const Icon = kpiIcons[metric.id] ?? IoLaptopOutline;
  const isDown = metric.trend === "down";

  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="flex items-start justify-between p-3">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            {metric.label}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground leading-none">
              {metric.value}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
                isDown
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-600",
              )}
            >
              {isDown ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronUp className="h-3 w-3" />
              )}
              {metric.delta}
            </span>
          </div>
          {metric.helperText && (
            <p className="text-xs text-muted-foreground">{metric.helperText}</p>
          )}
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Top Industries (Donut Chart Card)
// ---------------------------------------------------------------------------

function TopIndustriesCard({
  labels,
  series,
}: {
  labels: string[];
  series: number[];
}) {
  const colors = ["#1E88E5", "#64B5F6", "#90CAF9", "#BBDEFB"];

  const options: ApexOptions = {
    chart: { type: "donut" },
    labels,
    colors,
    legend: { show: false },
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: { size: "60%" },
      },
    },
  };

  return (
    <Card>
      <CardHeader className="border-b border-border/60 pb-3">
        <CardTitle className="text-base font-semibold text-foreground">
          Top Industries
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6 pt-4">
        <div className="w-[150px] shrink-0">
          <ApexChart
            type="donut"
            series={series}
            options={options}
            height={150}
          />
        </div>
        <div className="space-y-2">
          {labels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors[i] }}
              />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Brands & Models (Progress Bar Card)
// ---------------------------------------------------------------------------

function BrandsModelsCard({ items }: { items: BrandModelEntry[] }) {
  const maxCount = Math.max(...items.map((i) => i.count));

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <Card>
      <CardHeader className="border-b border-border/60 pb-3">
        <CardTitle className="text-base font-semibold text-foreground">
          Brands &amp; Models
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {items.map((item) => (
          <div key={`${item.brand}-${item.model}`} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">
                <span className="font-medium">{item.brand}</span>
                <span className="mx-1.5 text-muted-foreground">•</span>
                <span className="text-muted-foreground">{item.model}</span>
              </span>
              <span className="font-medium text-muted-foreground">
                {formatCount(item.count)}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Regions Card
// ---------------------------------------------------------------------------

function RegionsCard({ items }: { items: RegionEntry[] }) {
  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <Card>
      <CardHeader className="border-b border-border/60 pb-3">
        <CardTitle className="text-base font-semibold text-foreground">
          Regions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-foreground">{item.name}</span>
            <span className="font-medium text-muted-foreground">
              {formatCount(item.count)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Top 5 Device Table columns
// ---------------------------------------------------------------------------

const columns: TableColumn<DeviceTableRow>[] = [
  {
    key: "deviceName",
    header: "Device",
    render: (row) => (
      <div>
        <p className="font-medium text-foreground">{row.deviceName}</p>
        <p className="text-xs text-muted-foreground">{row.serialNumber}</p>
      </div>
    ),
  },
  {
    key: "category",
    header: "Template",
    render: (row) => (
      <div>
        <p className="text-foreground">{row.manufacturerModel}</p>
        <p className="text-xs text-muted-foreground">{row.category}</p>
      </div>
    ),
  },
  {
    key: "userAssigned",
    header: "Owner",
    render: (row) => (
      <span className="text-foreground">{row.userAssigned}</span>
    ),
  },
  {
    key: "firmwareVersion",
    header: "Access Users",
    render: () => <span className="text-muted-foreground">+5</span>,
  },
  {
    key: "macAddress",
    header: "Last Data Timestamp",
    render: () => (
      <span className="text-muted-foreground">27-07-2025 10:45 AM</span>
    ),
  },
  {
    key: "alertsCount",
    header: "Alarms",
    render: () => <span className="text-foreground">3</span>,
    className: "w-[72px]",
  },
  {
    key: "data1",
    header: "Data 1",
    render: () => (
      <div>
        <p className="font-medium text-foreground">50</p>
        <p className="text-xs text-muted-foreground">T1</p>
      </div>
    ),
    className: "w-[72px]",
  },
  {
    key: "data2",
    header: "Data 2",
    render: () => (
      <div>
        <p className="font-medium text-foreground">90</p>
        <p className="text-xs text-muted-foreground">T2</p>
      </div>
    ),
    className: "w-[72px]",
  },
  {
    key: "data3",
    header: "Data 3",
    render: () => (
      <div>
        <p className="font-medium text-foreground">90</p>
        <p className="text-xs text-muted-foreground">T3</p>
      </div>
    ),
    className: "w-[72px]",
  },
];

// ---------------------------------------------------------------------------
// Main View
// ---------------------------------------------------------------------------

export function DeviceAnalyticsView() {
  const session = useDemoSession();
  const canManageDevices = session?.role === "company";

  const summaryQuery = useQuery({
    queryKey: ["analytics", "device", "summary", defaultAnalyticsFilters],
    queryFn: () => fetchDeviceAnalytics(defaultAnalyticsFilters),
  });

  const data = summaryQuery.data;

  // Chart options
  const devicesDataOptions: ApexOptions = {
    chart: { type: "area", toolbar: { show: false } },
    xaxis: { categories: data?.devicesDataTrend.categories },
    yaxis: {
      labels: {
        formatter: (value) => `${Math.round(value)} MB`,
      },
    },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.45, opacityTo: 0.08 },
    },
    colors: ["#1E88E5"],
    stroke: { curve: "smooth", width: 2 },
    dataLabels: { enabled: false },
  };

  const yoyBarOptions: ApexOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    xaxis: { categories: data?.yearOverYearGrowth.categories },
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: "55%" },
    },
    colors: ["#4CAF50", "#EF5350"],
    dataLabels: { enabled: false },
  };

  const yoyAreaOptions: ApexOptions = {
    chart: { type: "area", toolbar: { show: false } },
    xaxis: { categories: data?.yearOverYearGrowthArea.categories },
    yaxis: {
      labels: {
        formatter: (value) =>
          value >= 1000 ? `${Math.round(value / 1000)}k` : String(Math.round(value)),
      },
    },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.35, opacityTo: 0.05 },
    },
    colors: ["#1E88E5", "#90A4AE"],
    stroke: { curve: "smooth", width: 2 },
    dataLabels: { enabled: false },
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
      ) : data?.topDevices.length ? (
        <>
          {/* KPI Row */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
            {data.kpis.map((kpi) => (
              <DeviceKpiCard key={kpi.id} metric={kpi} />
            ))}
          </section>

          {/* Devices Data + Year Device Growth */}
          <section className="grid gap-4 xl:grid-cols-2">
            <AnalyticsChartCard
              title="Devices Data"
              type="area"
              series={data.devicesDataTrend.series}
              options={devicesDataOptions}
              description={`Total Data : ${
                (data.kpis[0]?.helperText ?? "").replace("Total Devices ", "")
              } MB`}
              height={240}
            />
            <AnalyticsChartCard
              title="Year Device Growth"
              type="bar"
              series={data.yearOverYearGrowth.series}
              options={yoyBarOptions}
              height={240}
            />
          </section>

          {/* Top Industries + Brands & Models + Regions */}
          <section className="grid gap-4 xl:grid-cols-3">
            <TopIndustriesCard
              labels={data.topIndustries.labels}
              series={data.topIndustries.series}
            />
            <BrandsModelsCard items={data.brandsAndModels} />
            <RegionsCard items={data.regions} />
          </section>

          {/* Year over year growth (area) */}
          <section>
            <AnalyticsChartCard
              title="Year over year growth"
              type="area"
              series={data.yearOverYearGrowthArea.series}
              options={yoyAreaOptions}
              height={240}
            />
          </section>

          {/* Top 5 Devices Table */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Top 5 Devices
              </h2>
              <button
                type="button"
                className="rounded-md border border-border p-1.5 text-muted-foreground transition hover:bg-muted"
                aria-label="Expand table"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <AnalyticsDataTable
              rows={data.topDevices}
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
          description="No device analytics match the current selections."
          onReset={() => summaryQuery.refetch()}
        />
      )}
    </AnalyticsShell>
  );
}
