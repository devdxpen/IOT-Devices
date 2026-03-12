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
  Area,
  AreaChart,
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
  YearSelect,
} from "@/features/admin/dashboards/admin-dashboard-shared";
import {
  type AnalyticsFilters,
  defaultAnalyticsFilters,
  formatMinutesAsDuration,
  getAnalyticsFilterOptions,
  getCompanyDashboardData,
} from "@/features/admin/dashboards/analytics-derived-data";
import { AnalyticsFilterBar } from "@/features/admin/dashboards/analytics-filter-bar";

function chartTooltipStyle() {
  return {
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 20px -10px rgba(2, 6, 23, 0.25)",
    fontSize: "12px",
  };
}

export function CompanyAnalyticsDashboard() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    ...defaultAnalyticsFilters,
  });
  const filterOptions = useMemo(() => getAnalyticsFilterOptions(), []);
  const data = useMemo(() => getCompanyDashboardData(filters), [filters]);

  const metricCards: DashboardMetricCard[] = [
    {
      id: "total-companies",
      label: "Total Companies",
      value: String(data.totalCompanies),
      icon: Building2,
      iconClassName: "bg-blue-50 text-blue-500",
    },
    {
      id: "users-under-company",
      label: "User Under Company",
      value: String(data.totalUsersUnderCompany),
      icon: Users,
      iconClassName: "bg-sky-50 text-sky-500",
    },
    {
      id: "devices-under-company",
      label: "Device Under Company",
      value: String(data.totalDevicesUnderCompany),
      icon: Laptop,
      iconClassName: "bg-emerald-50 text-emerald-500",
    },
    {
      id: "retention-time",
      label: "Retention Time",
      value: formatMinutesAsDuration(data.avgRetentionMinutes),
      icon: Timer,
      iconClassName: "bg-violet-50 text-violet-500",
    },
    {
      id: "usage",
      label: "Usage",
      value: `${data.avgUsagePercent}%`,
      icon: Database,
      iconClassName: "bg-amber-50 text-amber-500",
    },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold text-slate-900">
        Company Analytics
      </h1>

      <AnalyticsFilterBar
        filters={filters}
        options={filterOptions}
        onChange={setFilters}
        onReset={() => setFilters({ ...defaultAnalyticsFilters })}
      />

      <DashboardMetrics cards={metricCards} columnsClassName="xl:grid-cols-5" />

      <section className="grid gap-4 xl:grid-cols-12">
        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <CardTitle className="text-3xl text-slate-900">
              User Under Company
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-4">
            <div className="grid items-center gap-4 sm:grid-cols-[220px_1fr]">
              <div className="relative mx-auto h-[180px] w-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.usersUnderCompanySplit}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={84}
                      stroke="none"
                    >
                      {data.usersUnderCompanySplit.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-semibold text-slate-900">
                    {data.totalUsersUnderCompany}
                  </span>
                  <span className="text-sm text-slate-500">Users</span>
                </div>
              </div>
              <div className="space-y-3">
                {data.usersUnderCompanySplit.map((item) => (
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl text-slate-900">
                Retention Time by Company
              </CardTitle>
              <YearSelect defaultValue={filters.year} />
            </div>
          </CardHeader>
          <CardContent className="h-[280px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.retentionByCompany}>
                <defs>
                  <linearGradient
                    id="company-retention-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} unit="h" />
                <Tooltip contentStyle={chartTooltipStyle()} />
                <Area
                  type="monotone"
                  dataKey="retentionHours"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#company-retention-fill)"
                  strokeWidth={2.5}
                  name="Retention (hours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-12">
        <Card className="border-slate-200 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-slate-200 px-4 py-3">
            <CardTitle className="text-3xl text-slate-900">Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.usageByCompany}>
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
            <CardTitle className="text-3xl text-slate-900">
              Device Under Company
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            {data.topCompanies.map((company) => (
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
            <CardTitle className="text-3xl text-slate-900">
              Devices by Functionality
            </CardTitle>
          </CardHeader>
          <CardContent className="grid items-center gap-4 py-4 sm:grid-cols-[180px_1fr]">
            <div className="relative mx-auto h-[170px] w-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.devicesByFunctionality}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={38}
                    outerRadius={68}
                    stroke="none"
                  >
                    {data.devicesByFunctionality.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle()} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {data.devicesByFunctionality.map((item) => (
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
              {data.companyTableRows.map((row) => (
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
            total={data.companyTableRows.length}
          />
        </CardContent>
      </Card>
    </div>
  );
}
