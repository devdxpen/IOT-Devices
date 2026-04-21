"use client";

import { 
  AlertTriangle,
  Calendar,
  Calendar as CalendarIcon,
  Edit2,
  Eye,
  Smile,
  Ticket,
  Trash2,
} from "lucide-react";
import { EChart, type EChartsOption } from "@/components/charts/echart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Tickets", value: "120", icon: Ticket, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Average Response Time", value: "6.2 hr", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Satisfaction Score", value: "4.3", icon: Smile, color: "text-purple-500", bg: "bg-purple-50" },
  { label: "SLA Breach", value: "3%", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
];

const areaData = [
  { name: "Jan", total: 18000, avg: 8000, satisfaction: 12000, sla: 5000 },
  { name: "Feb", total: 21000, avg: 9000, satisfaction: 14000, sla: 6000 },
  { name: "Mar", total: 19000, avg: 8500, satisfaction: 13000, sla: 5500 },
  { name: "Apr", total: 22000, avg: 10000, satisfaction: 15000, sla: 7000 },
  { name: "May", total: 24000, avg: 11000, satisfaction: 17000, sla: 8000 },
  { name: "Jun", total: 20000, avg: 9500, satisfaction: 14000, sla: 6500 },
  { name: "Jul", total: 16000, avg: 8000, satisfaction: 11000, sla: 5000 },
  { name: "Aug", total: 18000, avg: 8500, satisfaction: 12000, sla: 5500 },
  { name: "Sep", total: 22000, avg: 10000, satisfaction: 15000, sla: 7000 },
  { name: "Oct", total: 18000, avg: 8000, satisfaction: 12000, sla: 5000 },
  { name: "Nov", total: 15000, avg: 7000, satisfaction: 10000, sla: 4000 },
  { name: "Dec", total: 13000, avg: 6000, satisfaction: 9000, sla: 3500 },
];

const barData = [
  { name: "John", score: 23, second: 14 },
  { name: "Sarah", score: 23, second: 11 },
  { name: "Mike", score: 17, second: 15 },
  { name: "Lisa", score: 26, second: 22 },
  { name: "Smith", score: 17, second: 15 },
  { name: "Mikal", score: 17, second: 17 },
];

const pieData = [
  { name: "Login Issue", value: 20, color: "#10b981" },
  { name: "Payment", value: 10, color: "#f43f5e" },
  { name: "Bug Reports", value: 8, color: "#64748b" },
  { name: "Request", value: 10, color: "#3b82f6" },
  { name: "Others", value: 2, color: "#eab308" },
];

const escalatedTickets = [
  { id: "#TK-001", subject: "Server down", priority: "Critical", violation: "2h 10m", level: "L2" },
  { id: "#TK-002", subject: "Server down", priority: "Critical", violation: "2h 10m", level: "L2" },
  { id: "#TK-003", subject: "Server down", priority: "Critical", violation: "2h 10m", level: "L2" },
  { id: "#TK-004", subject: "Server down", priority: "Critical", violation: "2h 10m", level: "L2" },
];

export default function SupportAnalyticsPage() {
  const ticketVolumeOption: EChartsOption = {
    color: ["#10b981", "#f43f5e", "#3b82f6", "#64748b"],
    tooltip: { trigger: "axis" },
    legend: { show: false },
    grid: { left: 18, right: 18, top: 20, bottom: 20, containLabel: true },
    xAxis: {
      type: "category",
      data: areaData.map((item) => item.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#94a3b8", fontSize: 10, margin: 10 },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
      axisLabel: {
        color: "#94a3b8",
        fontSize: 10,
        formatter: (value: number) => `${value / 1000}k`,
      },
    },
    series: [
      {
        name: "Total Tickets",
        type: "line",
        smooth: true,
        showSymbol: false,
        areaStyle: { opacity: 0.12 },
        lineStyle: { width: 2 },
        data: areaData.map((item) => item.total),
      },
      {
        name: "Avg. Response",
        type: "line",
        smooth: true,
        showSymbol: false,
        areaStyle: { opacity: 0.1 },
        lineStyle: { width: 2 },
        data: areaData.map((item) => item.avg),
      },
      {
        name: "Satisfaction",
        type: "line",
        smooth: true,
        showSymbol: false,
        areaStyle: { opacity: 0.08 },
        lineStyle: { width: 2 },
        data: areaData.map((item) => item.satisfaction),
      },
      {
        name: "SLA Breach",
        type: "line",
        smooth: true,
        showSymbol: false,
        areaStyle: { opacity: 0.08 },
        lineStyle: { width: 2 },
        data: areaData.map((item) => item.sla),
      },
    ],
  };

  const agentPerformanceOption: EChartsOption = {
    color: ["#3b82f6", "#64748b"],
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: 18, right: 18, top: 20, bottom: 20, containLabel: true },
    xAxis: {
      type: "category",
      data: barData.map((item) => item.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#94a3b8", fontSize: 10, margin: 10 },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
      axisLabel: { color: "#94a3b8", fontSize: 10 },
    },
    series: [
      {
        name: "Score",
        type: "bar",
        data: barData.map((item) => item.score),
        barMaxWidth: 24,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
      {
        name: "Second",
        type: "bar",
        data: barData.map((item) => item.second),
        barMaxWidth: 24,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  };

  const topIssuesOption: EChartsOption = {
    color: pieData.map((item) => item.color),
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: ["50%", "74%"],
        center: ["50%", "50%"],
        label: { show: false },
        data: pieData.map((item) => ({ name: item.name, value: item.value })),
      },
    ],
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50/50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Comprehensive performance insights and metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
            <Button variant="ghost" size="sm" className="h-8 group">
                <CalendarIcon className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            </Button>
            {["Last 7D", "Last 30D", "Quarter", "Year", "All Time"].map((filter, i) => (
                <Button 
                    key={filter} 
                    variant={i === 0 ? "secondary" : "ghost"} 
                    size="sm" 
                    className={cn("h-8 text-xs font-medium px-4", i === 0 ? "bg-slate-100 text-slate-900" : "text-slate-500")}
                >
                    {filter}
                </Button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Volume Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Ticket Volume</h3>
            <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-wider">
                <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Total Tickets</div>
                <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-rose-500" /> Avg. Response</div>
                <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-500" /> Satisfaction</div>
                <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-slate-500" /> SLA Breach</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <EChart option={ticketVolumeOption} height="100%" />
          </div>
        </div>

        {/* Agent Performance Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800">Agent Performance</h3>
          <div className="h-[300px] w-full">
            <EChart option={agentPerformanceOption} height="100%" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Issues */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800">Top 5 Issues</h3>
          <div className="flex flex-col items-center">
            <div className="h-[240px] w-full relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-slate-900">100</span>
                    <span className="text-xs text-slate-500 font-medium">Issues</span>
                </div>
                <EChart option={topIssuesOption} height="100%" />
            </div>
            <div className="w-full space-y-3 mt-4">
                {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: item.color }} />
                            <span className="text-xs font-medium text-slate-600">{item.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900">{item.value} {item.name.includes("Issue") ? "" : item.name}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Escalated Tickets Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Escalated Tickets</h3>
            <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-1 rounded-lg flex items-center">
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold px-3">SLA Settings</Button>
                    <Button variant="secondary" size="sm" className="h-7 text-[10px] font-bold px-3 bg-[#2596be] text-white hover:bg-[#1d7fa1] shadow-sm">Escalation Rules</Button>
                </div>
            </div>
          </div>
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="w-12 px-6">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ticket ID</TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject</TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">SLA Violation</TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Level</TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escalatedTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-slate-50/30 transition-colors">
                    <TableCell className="px-6">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-600">{ticket.id}</TableCell>
                    <TableCell className="text-xs font-medium text-slate-700">{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-50 shadow-none text-[10px] font-bold px-2 py-0.5 relative pl-4">
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-rose-500" />
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-600">{ticket.violation}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-900">{ticket.level}</TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-600">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-rose-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
