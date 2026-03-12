"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Database,
  Eye,
  Laptop,
  Pencil,
  PlusSquare,
  PowerOff,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  type DashboardMetricCard,
  DashboardMetrics,
  DashboardTableFooter,
  YearSelect,
} from "@/features/admin/dashboards/admin-dashboard-shared";
import {
  type AnalyticsFilters,
  defaultAnalyticsFilters,
  getAnalyticsFilterOptions,
  getDeviceDashboardData,
} from "@/features/admin/dashboards/analytics-derived-data";
import { AnalyticsFilterBar } from "@/features/admin/dashboards/analytics-filter-bar";

function tooltipStyle() {
  return {
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 20px -10px rgba(2, 6, 23, 0.25)",
    fontSize: "12px",
  };
}

export function DeviceAnalyticsDashboard() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    ...defaultAnalyticsFilters,
  });
  const [showBandwidth, setShowBandwidth] = useState(true);
  const [showUsage, setShowUsage] = useState(true);
  const [topDeviceAngle, setTopDeviceAngle] = useState<
    "usageScore" | "alarms" | "userLoad"
  >("usageScore");

  const filterOptions = useMemo(() => getAnalyticsFilterOptions(), []);
  const data = useMemo(() => getDeviceDashboardData(filters), [filters]);

  const topDeviceChartData = useMemo(
    () =>
      data.topDeviceTableRows.map((row) => ({
        name: row.name,
        usageScore: row.usageScore,
        alarms: row.alarms,
        userLoad: row.userCount,
      })),
    [data.topDeviceTableRows],
  );

  const metricCards: DashboardMetricCard[] = [
    {
      id: "total-devices",
      label: "Total Devices",
      value: String(data.metrics.totalDevices),
      icon: Laptop,
      iconClassName: "bg-blue-50 text-blue-500",
    },
    {
      id: "active-devices",
      label: "Active Devices",
      value: String(data.metrics.activeDevices),
      icon: Activity,
      iconClassName: "bg-emerald-50 text-emerald-500",
    },
    {
      id: "newly-added",
      label: "Newly Added",
      value: String(data.metrics.newlyAddedDevices),
      icon: PlusSquare,
      iconClassName: "bg-violet-50 text-violet-500",
    },
    {
      id: "inactive-devices",
      label: "Inactive Devices",
      value: String(data.metrics.inactiveDevices),
      icon: PowerOff,
      iconClassName: "bg-rose-50 text-rose-500",
    },
    {
      id: "faulty-devices",
      label: "Faulty Devices",
      value: String(data.metrics.faultyDevices),
      icon: AlertTriangle,
      iconClassName: "bg-amber-50 text-amber-500",
    },
    {
      id: "total-data-usage",
      label: "Total Data Usage",
      value: `${data.metrics.totalDataUsageGb} GB`,
      icon: Database,
      iconClassName: "bg-green-50 text-green-500",
    },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold text-slate-900">
        Device Analytics
      </h1>

      <AnalyticsFilterBar
        filters={filters}
        options={filterOptions}
        onChange={setFilters}
        onReset={() => setFilters({ ...defaultAnalyticsFilters })}
      />

      <DashboardMetrics cards={metricCards} columnsClassName="xl:grid-cols-6" />

      <section className="grid gap-4 xl:grid-cols-12">
        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl text-slate-900">
                Device Bandwidth & Usage
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={showBandwidth ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowBandwidth((prev) => !prev)}
                >
                  Bandwidth
                </Button>
                <Button
                  variant={showUsage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowUsage((prev) => !prev)}
                >
                  Usage
                </Button>
                <YearSelect defaultValue={filters.year} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[280px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.bandwidthAndUsageTrend}>
                <defs>
                  <linearGradient
                    id="bandwidth-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="usage-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} unit="Mbps" />
                <Tooltip contentStyle={tooltipStyle()} />
                {showBandwidth && (
                  <Area
                    type="monotone"
                    dataKey="bandwidthMbps"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#bandwidth-fill)"
                    strokeWidth={2}
                    name="Bandwidth"
                  />
                )}
                {(showUsage || !showBandwidth) && (
                  <Area
                    type="monotone"
                    dataKey="deviceUsageMbps"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#usage-fill)"
                    strokeWidth={2}
                    name="Device Usage"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl text-slate-900">
                Year Over Year Device Growth
              </CardTitle>
              <YearSelect defaultValue={filters.year} />
            </div>
          </CardHeader>
          <CardContent className="h-[280px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.yearOverYearGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle()} />
                <Bar
                  dataKey="activeDevices"
                  stackId="growth"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="Active Devices"
                />
                <Bar
                  dataKey="disabled"
                  stackId="growth"
                  fill="#ef4444"
                  name="Disabled"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl text-slate-900">
                Top Devices
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={
                    topDeviceAngle === "usageScore" ? "default" : "outline"
                  }
                  onClick={() => setTopDeviceAngle("usageScore")}
                >
                  Usage
                </Button>
                <Button
                  size="sm"
                  variant={topDeviceAngle === "alarms" ? "default" : "outline"}
                  onClick={() => setTopDeviceAngle("alarms")}
                >
                  Alarms
                </Button>
                <Button
                  size="sm"
                  variant={
                    topDeviceAngle === "userLoad" ? "default" : "outline"
                  }
                  onClick={() => setTopDeviceAngle("userLoad")}
                >
                  Users
                </Button>
                <Button variant="outline" size="icon-sm">
                  <ArrowUpRight />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[280px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDeviceChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={
                    topDeviceAngle === "userLoad" ? [0, "auto"] : [0, 100]
                  }
                  unit={topDeviceAngle === "usageScore" ? "%" : ""}
                />
                <Tooltip contentStyle={tooltipStyle()} />
                <Bar
                  dataKey={topDeviceAngle}
                  fill="#2c9ae6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl text-slate-900">
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
                <TableHead className="text-sm">Serial Number</TableHead>
                <TableHead className="text-sm">Category</TableHead>
                <TableHead className="text-sm">User</TableHead>
                <TableHead className="text-sm">Manufacturer & Model</TableHead>
                <TableHead className="text-sm">Firmware Version</TableHead>
                <TableHead className="text-sm">MAC Address</TableHead>
                <TableHead className="text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topDeviceTableRows.map((row) => (
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
                        <p className="text-xl font-medium text-slate-800">
                          {row.name}
                        </p>
                        <p className="text-sm text-slate-500">{row.type}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.serialNumber}
                  </TableCell>
                  <TableCell>
                    <p className="text-xl text-slate-700">{row.category}</p>
                    <p className="text-sm text-slate-500">{row.location}</p>
                  </TableCell>
                  <TableCell>
                    <AvatarGroup
                      names={[row.assignedUser]}
                      extraCount={Math.max(row.userCount - 1, 0)}
                    />
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-xl text-slate-700">
                    {row.manufacturerModel}
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.firmwareVersion}
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.macAddress}
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
            total={data.topDeviceTableRows.length}
          />
        </CardContent>
      </Card>
    </div>
  );
}
