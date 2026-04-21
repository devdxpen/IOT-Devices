"use client";

import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  Eye,
  Laptop,
  Plus,
  Settings,
  Users,
  Workflow,
} from "lucide-react";
import { useMemo } from "react";
import { EChart, type EChartsOption } from "@/components/charts/echart";
import { snapshotApi } from "@/lib/mock-api/access-control";

const devicesAnalytics = [
  { month: "Jan", active: 58, inactive: 8, newAdded: 18, discontinued: 5 },
  { month: "Feb", active: 28, inactive: 7, newAdded: 13, discontinued: 2 },
  { month: "Mar", active: 35, inactive: 6, newAdded: 20, discontinued: 3 },
  { month: "Apr", active: 42, inactive: 6, newAdded: 21, discontinued: 2 },
  { month: "May", active: 24, inactive: 5, newAdded: 16, discontinued: 2 },
  { month: "Jun", active: 38, inactive: 4, newAdded: 28, discontinued: 2 },
  { month: "Jul", active: 32, inactive: 5, newAdded: 21, discontinued: 2 },
  { month: "Aug", active: 28, inactive: 4, newAdded: 30, discontinued: 2 },
  { month: "Sep", active: 41, inactive: 4, newAdded: 27, discontinued: 2 },
  { month: "Oct", active: 31, inactive: 4, newAdded: 40, discontinued: 1 },
  { month: "Nov", active: 40, inactive: 3, newAdded: 30, discontinued: 1 },
  { month: "Dec", active: 48, inactive: 3, newAdded: 29, discontinued: 2 },
];

const userAnalytics = [
  { month: "Jan", active: 54, inactive: 6 },
  { month: "Feb", active: 24, inactive: 4 },
  { month: "Mar", active: 33, inactive: 5 },
  { month: "Apr", active: 41, inactive: 6 },
  { month: "May", active: 22, inactive: 4 },
  { month: "Jun", active: 36, inactive: 5 },
  { month: "Jul", active: 29, inactive: 5 },
  { month: "Aug", active: 24, inactive: 4 },
  { month: "Sep", active: 39, inactive: 6 },
  { month: "Oct", active: 27, inactive: 4 },
  { month: "Nov", active: 40, inactive: 6 },
  { month: "Dec", active: 43, inactive: 6 },
];

const companyAnalytics = [
  { month: "Jan", active: 54, inactive: 6 },
  { month: "Feb", active: 25, inactive: 4 },
  { month: "Mar", active: 34, inactive: 5 },
  { month: "Apr", active: 42, inactive: 5 },
  { month: "May", active: 23, inactive: 3 },
  { month: "Jun", active: 36, inactive: 4 },
  { month: "Jul", active: 30, inactive: 4 },
  { month: "Aug", active: 22, inactive: 3 },
  { month: "Sep", active: 40, inactive: 5 },
  { month: "Oct", active: 28, inactive: 4 },
  { month: "Nov", active: 39, inactive: 5 },
  { month: "Dec", active: 44, inactive: 6 },
];

const recentActivities = [
  {
    id: "act-1",
    device: "SENSOR-001",
    type: "Temperature Sensor",
    message: "Temperature Sensor - Lab was added to 'Lab Devices' group.",
    time: "2 hours ago",
  },
  {
    id: "act-2",
    device: "SENSOR-001",
    type: "Temperature Sensor",
    message: "Brightness level updated for Smart Light - Office.",
    time: "2 hours ago",
  },
  {
    id: "act-3",
    device: "SENSOR-001",
    type: "Temperature Sensor",
    message: "Battery threshold updated for warehouse tracker.",
    time: "2 hours ago",
  },
];

const alerts = [
  {
    id: "alert-1",
    level: "Critical",
    message: "Door lock DS-156 battery critical low (23%)",
    location: "Conference Room B",
    time: "5 mins ago",
    badgeClass: "bg-red-100 text-red-700",
  },
  {
    id: "alert-2",
    level: "Warning",
    message: "Devices pending firmware update v3.2.1",
    location: "Update Available",
    time: "1 hr ago",
    badgeClass: "bg-amber-100 text-amber-700",
  },
];

const quickLinks = [
  { id: "add-device", label: "Add Device", icon: Plus },
  { id: "add-user", label: "Add User", icon: Plus },
  { id: "add-company", label: "Add Company", icon: Plus },
  { id: "add-template", label: "Add Template", icon: Plus },
  { id: "view-reports", label: "View Reports", icon: Eye },
  { id: "settings", label: "Settings", icon: Settings },
];

const supportTickets = [
  {
    id: "001",
    subject: "Login Issues",
    customer: "Priya Mehta",
    priority: "Critical",
    assignedAgent: "Priya Mehta",
    createdDate: "May 19 2025 14:30:12",
    status: "New",
  },
  {
    id: "002",
    subject: "Sync Delay",
    customer: "Raj Sharma",
    priority: "High",
    assignedAgent: "Anita Roy",
    createdDate: "May 19 2025 14:30:12",
    status: "In Progress",
  },
  {
    id: "003",
    subject: "Report Export",
    customer: "Krunal Patel",
    priority: "Critical",
    assignedAgent: "Priya Mehta",
    createdDate: "May 19 2025 14:30:12",
    status: "Closed",
  },
];

const planBreakdown = [
  { name: "Enterprise", value: 30, color: "#1d4ed8" },
  { name: "Standard", value: 50, color: "#38bdf8" },
  { name: "Free", value: 20, color: "#bfdbfe" },
];

function buildMonthlyBarOption(
  data: Array<Record<string, string | number>>,
  keys: Array<{ key: string; label: string; color: string }>,
): EChartsOption {
  return {
    color: keys.map((item) => item.color),
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: {
      top: 0,
      textStyle: { color: "#475569", fontSize: 12 },
    },
    grid: { left: 16, right: 16, top: 48, bottom: 16, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((item) => String(item.month)),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#64748b" },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#e2e8f0", type: "dashed" } },
      axisLabel: { color: "#64748b" },
    },
    series: keys.map((item) => ({
      name: item.label,
      type: "bar",
      data: data.map((row) => Number(row[item.key] ?? 0)),
      stack: keys.length > 2 ? "total" : undefined,
      barMaxWidth: 20,
      itemStyle: { borderRadius: [5, 5, 0, 0] },
    })),
  };
}

export function AdminHomeDashboard() {
  const dataset = useMemo(() => snapshotApi.getDataset(), []);
  const devicesAnalyticsOption = buildMonthlyBarOption(devicesAnalytics, [
    { key: "active", label: "Active", color: "#1d9bf0" },
    { key: "inactive", label: "Inactive", color: "#64748b" },
    { key: "newAdded", label: "New Added", color: "#22c55e" },
    { key: "discontinued", label: "Discontinued", color: "#ef4444" },
  ]);
  const userAnalyticsOption = buildMonthlyBarOption(userAnalytics, [
    { key: "active", label: "Active", color: "#2496e6" },
    { key: "inactive", label: "Inactive", color: "#64748b" },
  ]);
  const companyAnalyticsOption = buildMonthlyBarOption(companyAnalytics, [
    { key: "active", label: "Active", color: "#2d9ae5" },
    { key: "inactive", label: "Inactive", color: "#64748b" },
  ]);
  const planBreakdownOption: EChartsOption = {
    color: planBreakdown.map((entry) => entry.color),
    tooltip: { trigger: "item" },
    legend: {
      bottom: 0,
      textStyle: { color: "#475569", fontSize: 12 },
    },
    series: [
      {
        type: "pie",
        radius: ["45%", "72%"],
        center: ["50%", "42%"],
        label: { show: false },
        data: planBreakdown.map((entry) => ({
          name: entry.name,
          value: entry.value,
        })),
      },
    ],
  };
  const summaryCards = [
    {
      id: "devices",
      label: "Total Devices",
      value: String(dataset.devices.length),
      icon: Laptop,
      iconClass: "bg-blue-50 text-blue-500",
    },
    {
      id: "users",
      label: "Total IoT Users",
      value: String(dataset.iotUsers.length),
      icon: Users,
      iconClass: "bg-sky-50 text-sky-500",
    },
    {
      id: "companies",
      label: "Total Companies",
      value: String(dataset.companies.length),
      icon: Building2,
      iconClass: "bg-indigo-50 text-indigo-500",
    },
    {
      id: "shares",
      label: "Device Shares",
      value: String(dataset.deviceShares.length),
      icon: Workflow,
      iconClass: "bg-cyan-50 text-cyan-500",
    },
  ];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-md p-2.5 ${card.iconClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="text-4xl leading-none font-semibold text-slate-900">
                    {card.value}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-2xl font-semibold text-slate-900">
              Devices Analytics
            </h2>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600"
            >
              2025
            </button>
          </header>
          <div className="h-[320px] px-2 py-3">
            <EChart option={devicesAnalyticsOption} height="100%" />
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-2xl font-semibold text-slate-900">
              User Analytics
            </h2>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600"
            >
              2025
            </button>
          </header>
          <div className="h-[320px] px-2 py-3">
            <EChart option={userAnalyticsOption} height="100%" />
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-2xl font-semibold text-slate-900">
              Company Analytics
            </h2>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600"
            >
              2025
            </button>
          </header>
          <div className="h-[320px] px-2 py-3">
            <EChart option={companyAnalyticsOption} height="100%" />
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-2xl font-semibold text-slate-900">Recent</h2>
            <div className="rounded-md bg-slate-100 p-1 text-xs">
              <button
                type="button"
                className="rounded px-2 py-1 font-medium text-white bg-[#1d9bf0]"
              >
                Devices
              </button>
              <button
                type="button"
                className="rounded px-2 py-1 text-slate-600"
              >
                Activities
              </button>
            </div>
          </header>
          <div className="space-y-3 p-3">
            {recentActivities.map((item) => (
              <div
                key={item.id}
                className="rounded-md border border-slate-200 p-3 transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {item.device}
                    </p>
                    <p className="text-sm text-slate-500">{item.type}</p>
                  </div>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700">{item.message}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-2xl font-semibold text-slate-900">Alerts</h2>
            <button
              type="button"
              className="rounded-md border border-slate-200 p-1.5 text-slate-700"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </header>
          <div className="space-y-3 p-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-md border border-slate-200 p-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold ${alert.badgeClass}`}
                  >
                    {alert.level}
                  </span>
                  <span className="text-xs text-slate-500">{alert.time}</span>
                </div>
                <p className="mt-2 text-xl text-slate-800">{alert.message}</p>
                <span className="mt-2 inline-flex rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {alert.location}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-2xl font-semibold text-slate-900">
              Quick Links
            </h2>
            <button
              type="button"
              className="rounded-md border border-slate-200 p-1.5 text-slate-700"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </header>
          <div className="grid grid-cols-2 gap-3 p-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className="flex h-16 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-2xl font-semibold text-slate-900">
            Recent Support Tickets
          </h2>
          <button
            type="button"
            className="rounded-md border border-slate-200 p-1.5 text-slate-700"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-sm font-semibold text-slate-600">
                <th className="px-3 py-2">Ticket Id</th>
                <th className="px-3 py-2">Subject</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Priority</th>
                <th className="px-3 py-2">Assigned Agent</th>
                <th className="px-3 py-2">Created Date</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-t border-slate-100 text-sm"
                >
                  <td className="px-3 py-2 text-slate-800">{ticket.id}</td>
                  <td className="px-3 py-2 text-slate-800">{ticket.subject}</td>
                  <td className="px-3 py-2 text-slate-800">
                    {ticket.customer}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        ticket.priority === "Critical"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-800">
                    {ticket.assignedAgent}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {ticket.createdDate}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        ticket.status === "New"
                          ? "bg-sky-100 text-sky-700"
                          : ticket.status === "Closed"
                            ? "bg-slate-200 text-slate-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Plan Split</h2>
          <div className="mt-3 h-[220px]">
            <EChart option={planBreakdownOption} height="100%" />
          </div>
        </article>
        <article className="rounded-lg border border-slate-200 bg-linear-to-b from-sky-600 to-blue-700 p-5 text-white shadow-sm">
          <p className="text-sm text-blue-100">Growth Snapshot</p>
          <p className="mt-2 text-4xl font-semibold">+12.4%</p>
          <p className="mt-2 text-sm text-blue-100">
            Monthly company and user growth is stable across enterprise plans.
          </p>
        </article>
      </section>
    </div>
  );
}
