"use client";

import {
  ArrowUpRight,
  Building2,
  Database,
  Laptop,
  Timer,
  Users,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  getCompanyDashboardData,
} from "@/features/admin/dashboards/analytics-derived-data";

function chartTooltipStyle() {
  return {
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 20px -10px rgba(2, 6, 23, 0.25)",
    fontSize: "12px",
  };
}

export function CompanyAnalyticsDashboard() {
  const [usersSplitFilters, setUsersSplitFilters] = useState<AnalyticsFilters>({
    ...defaultAnalyticsFilters,
  });
  const [retentionFilters, setRetentionFilters] = useState<AnalyticsFilters>({
    ...defaultAnalyticsFilters,
  });
  const [usageFilters, setUsageFilters] = useState<AnalyticsFilters>({
    ...defaultAnalyticsFilters,
  });
  const [topCompaniesFilters, setTopCompaniesFilters] =
    useState<AnalyticsFilters>({
      ...defaultAnalyticsFilters,
    });
  const [functionalityFilters, setFunctionalityFilters] =
    useState<AnalyticsFilters>({
      ...defaultAnalyticsFilters,
    });

  const filterOptions = useMemo(() => getAnalyticsFilterOptions(), []);
  const summaryData = useMemo(
    () => getCompanyDashboardData(defaultAnalyticsFilters),
    [],
  );
  const usersSplitData = useMemo(
    () => getCompanyDashboardData(usersSplitFilters),
    [usersSplitFilters],
  );
  const retentionData = useMemo(
    () => getCompanyDashboardData(retentionFilters),
    [retentionFilters],
  );
  const usageData = useMemo(
    () => getCompanyDashboardData(usageFilters),
    [usageFilters],
  );
  const topCompaniesData = useMemo(
    () => getCompanyDashboardData(topCompaniesFilters),
    [topCompaniesFilters],
  );
  const functionalityData = useMemo(
    () => getCompanyDashboardData(functionalityFilters),
    [functionalityFilters],
  );

  const retentionPalette = ["#1d4ed8", "#1e40af", "#2563eb", "#3b82f6", "#60a5fa"];
  const retentionChartData = useMemo(() => {
    const months = retentionData.retentionByCompanyMonthlyStacked.months;
    const series = retentionData.retentionByCompanyMonthlyStacked.series;
    return months.map((month, index) => {
      const row: Record<string, string | number> = { month };
      series.forEach((item) => {
        row[item.name] = item.data[index] ?? 0;
      });
      return row;
    });
  }, [retentionData.retentionByCompanyMonthlyStacked]);

  const metricCards: DashboardMetricCard[] = [
    {
      id: "total-companies",
      label: "Total Companies",
      value: String(summaryData.totalCompanies),
      icon: Building2,
      iconClassName: "bg-blue-50 text-blue-500",
    },
    {
      id: "users-under-company",
      label: "User Under Company",
      value: String(summaryData.totalUsersUnderCompany),
      icon: Users,
      iconClassName: "bg-sky-50 text-sky-500",
    },
    {
      id: "devices-under-company",
      label: "Device Under Company",
      value: String(summaryData.totalDevicesUnderCompany),
      icon: Laptop,
      iconClassName: "bg-emerald-50 text-emerald-500",
    },
    {
      id: "retention-time",
      label: "Retention Time",
      value: formatMinutesAsDuration(summaryData.avgRetentionMinutes),
      icon: Timer,
      iconClassName: "bg-violet-50 text-violet-500",
    },
    {
      id: "usage",
      label: "Usage",
      value: `${summaryData.avgUsagePercent}%`,
      icon: Database,
      iconClassName: "bg-amber-50 text-amber-500",
    },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold text-slate-900">
        Company Analytics
      </h1>

      <DashboardMetrics cards={metricCards} columnsClassName="xl:grid-cols-5" />

      <section className="grid gap-4 xl:grid-cols-12">
        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-3xl text-slate-900">
                User Under Company
              </CardTitle>
              <AnalyticsChartFilters
                filters={usersSplitFilters}
                fields={["year", "location", "functionality"]}
                options={filterOptions}
                onChange={setUsersSplitFilters}
                onReset={() =>
                  setUsersSplitFilters({ ...defaultAnalyticsFilters })
                }
              />
            </div>
          </CardHeader>
          <CardContent className="px-2 py-4">
            <div className="grid items-center gap-4 sm:grid-cols-[220px_1fr]">
              <div className="relative mx-auto h-[180px] w-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usersSplitData.usersUnderCompanySplit}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={84}
                      stroke="none"
                    >
                      {usersSplitData.usersUnderCompanySplit.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-semibold text-slate-900">
                    {usersSplitData.totalUsersUnderCompany}
                  </span>
                  <span className="text-sm text-slate-500">Users</span>
                </div>
              </div>
              <div className="space-y-3">
                {usersSplitData.usersUnderCompanySplit.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-xl"
                  >
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700">
                      {item.value}% {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-8">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-3xl text-slate-900">
                Retention Time by Company
              </CardTitle>
              <AnalyticsChartFilters
                filters={retentionFilters}
                fields={["year", "location", "deviceType"]}
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
                <Tooltip contentStyle={chartTooltipStyle()} />
                {retentionData.retentionByCompanyMonthlyStacked.series.map(
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
              <CardTitle className="text-3xl text-slate-900">Usage</CardTitle>
              <AnalyticsChartFilters
                filters={usageFilters}
                fields={["year", "location", "functionality"]}
                options={filterOptions}
                onChange={setUsageFilters}
                onReset={() => setUsageFilters({ ...defaultAnalyticsFilters })}
              />
            </div>
          </CardHeader>
          <CardContent className="h-[280px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData.usageByCompany}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} unit="%" />
                <Tooltip contentStyle={chartTooltipStyle()} />
                <Bar dataKey="usage" fill="#2c9ae6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-3xl text-slate-900">
                Device Under Company
              </CardTitle>
              <AnalyticsChartFilters
                filters={topCompaniesFilters}
                fields={["year", "location", "deviceType"]}
                options={filterOptions}
                onChange={setTopCompaniesFilters}
                onReset={() =>
                  setTopCompaniesFilters({ ...defaultAnalyticsFilters })
                }
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            {topCompaniesData.topCompanies.map((company) => (
              <div
                key={company.rank}
                className="grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-md border border-slate-200 px-3 py-2"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-sm font-medium text-slate-700">
                  {company.rank}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 rounded-md">
                      <AvatarImage src="/gateway.png" alt={company.name} />
                      <AvatarFallback className="rounded-md bg-orange-100 text-xs">
                        CO
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="truncate text-lg font-medium text-slate-800">
                        {company.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {company.users} users | {company.devices} devices
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-[120px]">
                  <div className="mb-1 text-right text-sm text-slate-500">
                    {company.usagePercent}%
                  </div>
                  <Progress
                    value={company.usagePercent}
                    className="h-2 bg-slate-200"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-3xl text-slate-900">
                Devices by Functionality
              </CardTitle>
              <AnalyticsChartFilters
                filters={functionalityFilters}
                fields={["year", "location", "functionality"]}
                options={filterOptions}
                onChange={setFunctionalityFilters}
                onReset={() =>
                  setFunctionalityFilters({ ...defaultAnalyticsFilters })
                }
              />
            </div>
          </CardHeader>
          <CardContent className="grid items-center gap-4 py-4 sm:grid-cols-[180px_1fr]">
            <div className="relative mx-auto h-[170px] w-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={functionalityData.devicesByFunctionality}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={38}
                    outerRadius={68}
                    stroke="none"
                  >
                    {functionalityData.devicesByFunctionality.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle()} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {functionalityData.devicesByFunctionality.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-xl"
                >
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl text-slate-900">
              Company Usage Breakdown
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
                <TableHead className="text-sm">Company</TableHead>
                <TableHead className="text-sm">User Under Company</TableHead>
                <TableHead className="text-sm">Device Under Company</TableHead>
                <TableHead className="text-sm">Retention Time</TableHead>
                <TableHead className="text-sm">Usage</TableHead>
                <TableHead className="text-sm">Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryData.companyTableRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-9 w-9 rounded-md">
                        <AvatarImage src="/gateway.png" alt={row.company} />
                        <AvatarFallback className="rounded-md">
                          CO
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xl font-medium text-slate-800">
                        {row.company}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.usersUnderCompany}
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.devicesUnderCompany}
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.retentionTime}
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.usage}
                  </TableCell>
                  <TableCell className="text-xl text-slate-700">
                    {row.lastActive}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DashboardTableFooter
            showCount={5}
            total={summaryData.companyTableRows.length}
          />
        </CardContent>
      </Card>
    </div>
  );
}
