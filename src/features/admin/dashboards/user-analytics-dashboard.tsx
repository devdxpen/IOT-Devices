"use client";

import { ArrowUpRight, Gauge, Mail, Timer, Users, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type DashboardMetricCard,
  DashboardMetrics,
  DashboardTableFooter,
} from "@/features/admin/dashboards/admin-dashboard-shared";
import { AnalyticsChartFilters } from "@/features/admin/dashboards/analytics-chart-filters";
import {
  type AnalyticsFilters,
  defaultAnalyticsFilters,
  formatMinutesAsDuration,
  getAnalyticsFilterOptions,
  getUserDashboardData,
} from "@/features/admin/dashboards/analytics-derived-data";

function tooltipStyle() {
  return {
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 20px -10px rgba(2, 6, 23, 0.25)",
    fontSize: "12px",
  };
}

function UserRankList({
  rows,
}: {
  rows: Array<{
    rank: number;
    name: string;
    role: string;
    uptime: string;
    retention: string;
    functionality: string;
  }>;
}) {
  return (
    <div className="space-y-2">
      {rows.map((user) => (
        <div
          key={`${user.rank}-${user.name}`}
          className="grid grid-cols-[30px_1fr_auto] items-center gap-3 rounded-md border border-slate-200 px-3 py-2"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-sm font-medium text-slate-700">
            {user.rank}
          </span>
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatar.jpg" alt={user.name} />
              <AvatarFallback className="text-xs">
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-xl font-medium text-slate-800">
                {user.name}
              </p>
              <p className="text-sm text-slate-500">{user.role}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-slate-700">
              {user.uptime}
            </p>
            <p className="text-sm text-slate-500">{user.retention}</p>
            <p className="text-xl text-slate-700">{user.functionality}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function UserAnalyticsDashboard() {
  const [uptimeFilters, setUptimeFilters] = useState<AnalyticsFilters>({
    ...defaultAnalyticsFilters,
  });
  const [retentionFilters, setRetentionFilters] = useState<AnalyticsFilters>({
    ...defaultAnalyticsFilters,
  });
  const [usageFilters, setUsageFilters] = useState<AnalyticsFilters>({
    ...defaultAnalyticsFilters,
  });
  const [topUsersFilters, setTopUsersFilters] = useState<AnalyticsFilters>({
    ...defaultAnalyticsFilters,
  });
  const [functionalityFilters, setFunctionalityFilters] =
    useState<AnalyticsFilters>({
      ...defaultAnalyticsFilters,
    });

  const filterOptions = useMemo(() => getAnalyticsFilterOptions(), []);
  const summaryData = useMemo(
    () => getUserDashboardData(defaultAnalyticsFilters),
    [],
  );
  const uptimeData = useMemo(
    () => getUserDashboardData(uptimeFilters),
    [uptimeFilters],
  );
  const retentionData = useMemo(
    () => getUserDashboardData(retentionFilters),
    [retentionFilters],
  );
  const usageData = useMemo(
    () => getUserDashboardData(usageFilters),
    [usageFilters],
  );
  const topUsersData = useMemo(
    () => getUserDashboardData(topUsersFilters),
    [topUsersFilters],
  );
  const functionalityData = useMemo(
    () => getUserDashboardData(functionalityFilters),
    [functionalityFilters],
  );

  const retentionPalette = ["#1d4ed8", "#1e40af", "#2563eb", "#3b82f6", "#60a5fa"];
  const retentionChartData = useMemo(() => {
    const months = retentionData.retentionByUserMonthlyStacked.months;
    const series = retentionData.retentionByUserMonthlyStacked.series;
    return months.map((month, index) => {
      const row: Record<string, string | number> = { month };
      series.forEach((item) => {
        row[item.name] = item.data[index] ?? 0;
      });
      return row;
    });
  }, [retentionData.retentionByUserMonthlyStacked]);

  const metricCards: DashboardMetricCard[] = [
    {
      id: "total-users",
      label: "Total Users",
      value: String(summaryData.metrics.totalUsers),
      icon: Users,
      iconClassName: "bg-sky-50 text-sky-500",
    },
    {
      id: "avg-uptime",
      label: "Avg Uptime",
      value: `${summaryData.metrics.avgUptime}%`,
      icon: Gauge,
      iconClassName: "bg-emerald-50 text-emerald-500",
    },
    {
      id: "retention-time",
      label: "Retention Time",
      value: formatMinutesAsDuration(summaryData.metrics.avgRetentionMinutes),
      icon: Timer,
      iconClassName: "bg-violet-50 text-violet-500",
    },
    {
      id: "functionality-usage",
      label: "Usage (Functionality)",
      value: `${summaryData.metrics.avgUsagePercent}%`,
      icon: Wrench,
      iconClassName: "bg-amber-50 text-amber-500",
    },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold text-slate-900">User Analytics</h1>

      <DashboardMetrics cards={metricCards} columnsClassName="xl:grid-cols-4" />

      <section className="grid gap-4 xl:grid-cols-12">
        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-3xl text-slate-900">
                Avg Uptime Split
              </CardTitle>
              <AnalyticsChartFilters
                filters={uptimeFilters}
                fields={["year", "company", "location", "status", "ownership"]}
                options={filterOptions}
                onChange={setUptimeFilters}
                onReset={() => setUptimeFilters({ ...defaultAnalyticsFilters })}
              />
            </div>
          </CardHeader>
          <CardContent className="grid items-center gap-4 py-4 sm:grid-cols-[210px_1fr]">
            <div className="relative mx-auto h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={uptimeData.uptimeDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={84}
                    stroke="none"
                  >
                    {uptimeData.uptimeDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle()} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-semibold text-slate-900">
                  {uptimeData.metrics.avgUptime}%
                </span>
                <span className="text-sm text-slate-500">Fleet Avg</span>
              </div>
            </div>
            <div className="space-y-3">
              {uptimeData.uptimeDistribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-xl"
                >
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700">
                    {item.value} users - {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-8">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-3xl text-slate-900">
                Retention Time by User
              </CardTitle>
              <AnalyticsChartFilters
                filters={retentionFilters}
                fields={["year", "company", "location", "deviceType"]}
                options={filterOptions}
                onChange={setRetentionFilters}
                onReset={() =>
                  setRetentionFilters({ ...defaultAnalyticsFilters })
                }
              />
            </div>
          </CardHeader>
          <CardContent className="h-[280px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retentionChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} unit="h" />
                <Tooltip contentStyle={tooltipStyle()} />
                {retentionData.retentionByUserMonthlyStacked.series.map(
                  (series, index) => (
                    <Bar
                      key={series.name}
                      dataKey={series.name}
                      fill={retentionPalette[index % retentionPalette.length]}
                      stackId="retention"
                      radius={[4, 4, 0, 0]}
                      name={`${series.name}`}
                    />
                  ),
                )}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-12">
        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-3xl text-slate-900">
                Usage (Functionality)
              </CardTitle>
              <AnalyticsChartFilters
                filters={usageFilters}
                fields={["year", "company", "location", "functionality"]}
                options={filterOptions}
                onChange={setUsageFilters}
                onReset={() => setUsageFilters({ ...defaultAnalyticsFilters })}
              />
            </div>
          </CardHeader>
          <CardContent className="h-[280px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData.functionalityUsageByUser}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} unit="%" />
                <Tooltip contentStyle={tooltipStyle()} />
                <Bar
                  dataKey="monitoring"
                  stackId="usage"
                  fill="#2496e6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="security" stackId="usage" fill="#7cc4ed" />
                <Bar dataKey="control" stackId="usage" fill="#9bd06e" />
                <Bar dataKey="energy" stackId="usage" fill="#f9c74f" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-3xl text-slate-900">
                Top Users
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="icon-sm">
                  <ArrowUpRight />
                </Button>
                <AnalyticsChartFilters
                  filters={topUsersFilters}
                  fields={["year", "company", "location", "functionality"]}
                  options={filterOptions}
                  onChange={setTopUsersFilters}
                  onReset={() =>
                    setTopUsersFilters({ ...defaultAnalyticsFilters })
                  }
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <Tabs defaultValue="usage">
              <TabsList className="mb-3 h-9 bg-slate-100">
                <TabsTrigger value="usage">By Usage</TabsTrigger>
                <TabsTrigger value="uptime">By Uptime</TabsTrigger>
                <TabsTrigger value="retention">By Retention</TabsTrigger>
              </TabsList>
              <TabsContent value="usage" className="mt-0">
                <UserRankList rows={topUsersData.topUsersByUsage} />
              </TabsContent>
              <TabsContent value="uptime" className="mt-0">
                <UserRankList rows={topUsersData.topUsersByUptime} />
              </TabsContent>
              <TabsContent value="retention" className="mt-0">
                <UserRankList rows={topUsersData.topUsersByRetention} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-3xl text-slate-900">
                Users by Functionality
              </CardTitle>
              <AnalyticsChartFilters
                filters={functionalityFilters}
                fields={["year", "company", "location"]}
                options={filterOptions}
                onChange={setFunctionalityFilters}
                onReset={() =>
                  setFunctionalityFilters({ ...defaultAnalyticsFilters })
                }
              />
            </div>
          </CardHeader>
          <CardContent className="h-[280px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={functionalityData.usersByFunctionality} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={95}
                />
                <Tooltip contentStyle={tooltipStyle()} />
                <Bar dataKey="value" fill="#2c9ae6" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200 px-4 py-3">
          <CardTitle className="text-3xl text-slate-900">
            User Usage Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                <TableHead className="text-sm">Username</TableHead>
                <TableHead className="text-sm">Avg Uptime</TableHead>
                <TableHead className="text-sm">Retention Time</TableHead>
                <TableHead className="text-sm">Functionality Usage</TableHead>
                <TableHead className="text-sm">Usage Score</TableHead>
                <TableHead className="text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryData.userTableRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatar.jpg" alt={row.username} />
                        <AvatarFallback>
                          {row.username
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xl font-medium text-slate-800">
                          {row.username}
                        </p>
                        <p className="text-sm text-slate-500">{row.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.avgUptime}
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.retentionTime}
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.functionalityUsage}
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.usageScore}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DashboardTableFooter
            showCount={5}
            total={summaryData.userTableRows.length}
          />
        </CardContent>
      </Card>
    </div>
  );
}
