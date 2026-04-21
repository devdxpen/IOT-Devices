"use client";

import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Laptop,
  Pencil,
  Trash2,
} from "lucide-react";
import { useMemo } from "react";
import { EChart, type EChartsOption } from "@/components/charts/echart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AvatarGroup,
  DashboardTableFooter,
} from "@/features/admin/dashboards/admin-dashboard-shared";
import {
  type BrandModelEntry,
  type RegionEntry,
  defaultAnalyticsFilters,
  getDeviceDashboardData,
} from "@/features/admin/dashboards/analytics-derived-data";

function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------

interface KpiCardProps {
  label: string;
  value: string;
  delta: string;
  trendUp: boolean;
  icon: React.ElementType;
  iconBgClass: string;
  helper?: string;
}

function KpiCard({
  label,
  value,
  delta,
  trendUp,
  icon: Icon,
  iconBgClass,
  helper,
}: KpiCardProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="flex items-start justify-between p-4">
        <div className="space-y-1.5">
          <p className="text-sm text-slate-500">{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold leading-none text-slate-900">
              {value}
            </span>
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium ${
                trendUp
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {trendUp ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              {delta}
            </span>
          </div>
          {helper && (
            <p className="text-xs text-slate-400">{helper}</p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconBgClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Top Industries (donut)
// ---------------------------------------------------------------------------

function TopIndustriesCard({
  data,
}: {
  data: Array<{ name: string; value: number; color: string }>;
}) {
  const chartOption = useMemo(
    () =>
      ({
        tooltip: { trigger: "item" },
        series: [
          {
            type: "pie",
            radius: ["50%", "86%"],
            label: { show: false },
            data: data.map((entry) => ({
              name: entry.name,
              value: entry.value,
              itemStyle: { color: entry.color },
            })),
          },
        ],
      }) satisfies EChartsOption,
    [data],
  );

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-4 py-3">
        <CardTitle className="text-base font-semibold text-slate-900">
          Top Industries
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6 px-4 py-5">
        <div className="w-[140px] shrink-0">
          <EChart option={chartOption} height={140} />
        </div>
        <div className="space-y-2.5">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600">{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Brands & Models
// ---------------------------------------------------------------------------

function BrandsModelsCard({ items }: { items: BrandModelEntry[] }) {
  const maxCount = Math.max(...items.map((i) => i.count));

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-4 py-3">
        <CardTitle className="text-base font-semibold text-slate-900">
          Brands &amp; Models
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-5">
        {items.map((item) => (
          <div key={`${item.brand}-${item.model}`} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">
                <span className="font-medium">{item.brand}</span>
                <span className="mx-1.5 text-slate-400">•</span>
                <span className="text-slate-500">{item.model}</span>
              </span>
              <span className="text-sm font-medium text-slate-500">
                {formatCount(item.count)}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-blue-500"
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
// Regions
// ---------------------------------------------------------------------------

function RegionsCard({ items }: { items: RegionEntry[] }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-4 py-3">
        <CardTitle className="text-base font-semibold text-slate-900">
          Regions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-5">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-slate-700">{item.name}</span>
            <span className="font-medium text-slate-500">
              {formatCount(item.count)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------

export function DeviceAnalyticsDashboard() {
  const summaryData = useMemo(
    () => getDeviceDashboardData(defaultAnalyticsFilters),
    [],
  );

  const { metrics } = summaryData;
  const devicesDataOption = useMemo(
    () =>
      ({
        tooltip: { trigger: "axis" },
        grid: { left: 12, right: 12, top: 16, bottom: 8, containLabel: true },
        xAxis: {
          type: "category",
          data: summaryData.devicesDataTrend.map((item) => item.month),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: "#64748b", fontSize: 12 },
        },
        yAxis: {
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: "#94a3b8",
            fontSize: 12,
            formatter: (value: number) => `${value} MB`,
          },
          splitLine: { lineStyle: { color: "#e2e8f0", type: "dashed" } },
        },
        series: [
          {
            name: "Data Usage",
            type: "line",
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 2, color: "#1E88E5" },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(30, 136, 229, 0.45)" },
                  { offset: 1, color: "rgba(30, 136, 229, 0.05)" },
                ],
              },
            },
            data: summaryData.devicesDataTrend.map((item) => item.dataUsageMb),
          },
        ],
      }) satisfies EChartsOption,
    [summaryData.devicesDataTrend],
  );
  const growthOption = useMemo(
    () =>
      ({
        color: ["#4CAF50", "#EF5350"],
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        grid: { left: 12, right: 12, top: 16, bottom: 8, containLabel: true },
        xAxis: {
          type: "category",
          data: summaryData.yearOverYearGrowth.map((item) => item.month),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: "#64748b", fontSize: 12 },
        },
        yAxis: {
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: "#94a3b8", fontSize: 12 },
          splitLine: { lineStyle: { color: "#e2e8f0", type: "dashed" } },
        },
        series: [
          {
            name: "Active Devices",
            type: "bar",
            stack: "growth",
            barMaxWidth: 28,
            data: summaryData.yearOverYearGrowth.map((item) => item.activeDevices),
            itemStyle: { borderRadius: [8, 8, 0, 0] },
          },
          {
            name: "Disabled",
            type: "bar",
            stack: "growth",
            barMaxWidth: 28,
            data: summaryData.yearOverYearGrowth.map((item) => item.disabled),
          },
        ],
      }) satisfies EChartsOption,
    [summaryData.yearOverYearGrowth],
  );
  const growthAreaOption = useMemo(
    () =>
      ({
        color: ["#1E88E5", "#90A4AE"],
        tooltip: { trigger: "axis" },
        grid: { left: 12, right: 12, top: 16, bottom: 8, containLabel: true },
        xAxis: {
          type: "category",
          data: summaryData.yearOverYearGrowthArea.map((item) => item.month),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: "#64748b", fontSize: 12 },
        },
        yAxis: {
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: "#94a3b8",
            fontSize: 12,
            formatter: (value: number) =>
              value >= 1000 ? `${Math.round(value / 1000)}k` : String(value),
          },
          splitLine: { lineStyle: { color: "#e2e8f0", type: "dashed" } },
        },
        series: [
          {
            name: "Now",
            type: "line",
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 2, color: "#1E88E5" },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(30, 136, 229, 0.35)" },
                  { offset: 1, color: "rgba(30, 136, 229, 0.05)" },
                ],
              },
            },
            data: summaryData.yearOverYearGrowthArea.map((item) => item.now),
          },
          {
            name: "Past",
            type: "line",
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 2, color: "#90A4AE" },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(144, 164, 174, 0.30)" },
                  { offset: 1, color: "rgba(144, 164, 174, 0.05)" },
                ],
              },
            },
            data: summaryData.yearOverYearGrowthArea.map((item) => item.past),
          },
        ],
      }) satisfies EChartsOption,
    [summaryData.yearOverYearGrowthArea],
  );

  const kpiCards: KpiCardProps[] = [
    {
      label: "Devices",
      value: String(metrics.totalDevices),
      delta: "6.42%",
      trendUp: true,
      icon: Laptop,
      iconBgClass: "bg-blue-50 text-blue-500",
      helper: `Total Data ${formatCount(metrics.totalDataUsageMb)} MB`,
    },
    {
      label: "Average devices \\ user",
      value: String(metrics.avgDevicesPerUser),
      delta: "12%",
      trendUp: true,
      icon: Activity,
      iconBgClass: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "Average revenue \\ Device",
      value: `₹${metrics.avgRevenuePerDevice.toFixed(2)}`,
      delta: "4.5%",
      trendUp: true,
      icon: Laptop,
      iconBgClass: "bg-violet-50 text-violet-500",
    },
    {
      label: "Average uptime (%)",
      value: `${metrics.avgUptime}%`,
      delta: "0.02%",
      trendUp: false,
      icon: Activity,
      iconBgClass: "bg-rose-50 text-rose-500",
    },
    {
      label: "Alarms \\ Device",
      value: String(metrics.alarmsPerDevice),
      delta: "18%",
      trendUp: true,
      icon: Laptop,
      iconBgClass: "bg-amber-50 text-amber-500",
    },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold text-slate-900">
        Device Analytics
      </h1>

      {/* KPI Row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpiCards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </section>

      {/* Devices Data + Year Device Growth */}
      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-900">
                Devices Data
              </CardTitle>
              <span className="text-xs text-slate-400">
                Total Data : {formatCount(metrics.totalDataUsageMb)} MB
              </span>
            </div>
          </CardHeader>
          <CardContent className="h-[260px] px-2 py-4">
            <EChart option={devicesDataOption} height="100%" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <CardTitle className="text-base font-semibold text-slate-900">
              Year Device Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px] px-2 py-4">
            <EChart option={growthOption} height="100%" />
          </CardContent>
        </Card>
      </section>

      {/* Top Industries + Brands & Models + Regions */}
      <section className="grid gap-4 xl:grid-cols-3">
        <TopIndustriesCard data={summaryData.topIndustries} />
        <BrandsModelsCard items={summaryData.brandsAndModels} />
        <RegionsCard items={summaryData.regions} />
      </section>

      {/* Year over Year Growth (area) */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200 px-4 py-3">
          <CardTitle className="text-base font-semibold text-slate-900">
            Year over year growth
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[260px] px-2 py-4">
          <EChart option={growthAreaOption} height="100%" />
        </CardContent>
      </Card>

      {/* Top 5 Devices Table */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-900">
              Top 5 Devices
            </CardTitle>
            <Button variant="outline" size="icon-sm">
              <ArrowUpRight />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                <TableHead className="w-[36px]" />
                <TableHead className="text-sm">Device</TableHead>
                <TableHead className="text-sm">Template</TableHead>
                <TableHead className="text-sm">Owner</TableHead>
                <TableHead className="text-sm">Access Users</TableHead>
                <TableHead className="text-sm">Last Data Timestamp</TableHead>
                <TableHead className="text-sm">Alarms</TableHead>
                <TableHead className="text-sm">Data 1</TableHead>
                <TableHead className="text-sm">Data 2</TableHead>
                <TableHead className="text-sm">Data 3</TableHead>
                <TableHead className="text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryData.topDeviceTableRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300"
                      aria-label={`Select ${row.name}`}
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-9 w-9 rounded-md">
                        <AvatarImage src="/gateway.png" alt={row.name} />
                        <AvatarFallback className="rounded-md">
                          DV
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {row.name}
                        </p>
                        <p className="text-xs text-slate-500">{row.type}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-700">
                      {row.manufacturerModel}
                    </p>
                    <p className="text-xs text-slate-500">{row.category}</p>
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">
                    {row.assignedUser}
                  </TableCell>
                  <TableCell>
                    <AvatarGroup
                      names={[row.assignedUser]}
                      extraCount={Math.max(row.userCount - 1, 0)}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    27-07-2025 10:45 AM
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">
                    {row.alarms}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-slate-700">50</p>
                    <p className="text-xs text-slate-400">T1</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-slate-700">90</p>
                    <p className="text-xs text-slate-400">T2</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-slate-700">90</p>
                    <p className="text-xs text-slate-400">T3</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100"
                        aria-label={`View ${row.name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100"
                        aria-label={`Edit ${row.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100"
                        aria-label={`Delete ${row.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DashboardTableFooter
            showCount={5}
            total={summaryData.topDeviceTableRows.length}
          />
        </CardContent>
      </Card>
    </div>
  );
}
