"use client";

import React, { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { EChart, type EChartsOption } from "@/components/charts/echart";

const chartConfigs: Record<string, EChartsOption> = {
  chart_bar: {
    color: ["#6366f1"],
    grid: { left: 12, right: 12, top: 24, bottom: 24, containLabel: true },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      axisLabel: { color: "#64748b", fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#64748b", fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
    },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    series: [
      {
        type: "bar",
        data: [44, 55, 41, 67, 22],
        barMaxWidth: 20,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  },
  histogram: {
    color: ["#8b5cf6"],
    grid: { left: 12, right: 12, top: 24, bottom: 24, containLabel: true },
    xAxis: {
      type: "category",
      data: ["0-10", "10-20", "20-30", "30-40", "40-50"],
      axisLabel: { color: "#64748b", fontSize: 9 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#64748b", fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
    },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    series: [
      {
        type: "bar",
        data: [12, 28, 45, 32, 18],
        barMaxWidth: 24,
        itemStyle: { borderRadius: [2, 2, 0, 0] },
      },
    ],
  },
  "ring-chart": {
    color: ["#22c55e", "#f59e0b", "#ef4444", "#94a3b8"],
    legend: {
      bottom: 0,
      textStyle: { color: "#64748b", fontSize: 10 },
    },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: ["55%", "78%"],
        center: ["50%", "44%"],
        label: { show: false },
        data: [
          { value: 44, name: "Active" },
          { value: 25, name: "Idle" },
          { value: 13, name: "Error" },
          { value: 18, name: "Offline" },
        ],
      },
    ],
  },
  "pie-chart": {
    color: ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"],
    legend: {
      bottom: 0,
      textStyle: { color: "#64748b", fontSize: 10 },
    },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "72%",
        center: ["50%", "44%"],
        label: { show: false },
        data: [
          { value: 35, name: "Sensors" },
          { value: 25, name: "Actuators" },
          { value: 20, name: "Gateway" },
          { value: 20, name: "Edge" },
        ],
      },
    ],
  },
  "radar-chart": {
    color: ["#6366f1"],
    radar: {
      indicator: ["Temp", "Humidity", "Pressure", "Wind", "Light"].map((name) => ({
        name,
        max: 100,
      })),
      splitLine: { lineStyle: { color: "#e2e8f0" } },
      splitArea: { areaStyle: { color: ["#ffffff", "#f8fafc"] } },
      axisName: { color: "#64748b", fontSize: 10 },
    },
    series: [
      {
        type: "radar",
        data: [{ value: [80, 50, 70, 40, 90], name: "Sensor" }],
        areaStyle: { opacity: 0.2 },
      },
    ],
  },
  "trend-chart": {
    color: ["#22c55e"],
    grid: { left: 12, right: 12, top: 20, bottom: 24, containLabel: true },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      axisLabel: { color: "#64748b", fontSize: 9 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#64748b", fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
    },
    tooltip: { trigger: "axis" },
    series: [
      {
        type: "line",
        smooth: true,
        showSymbol: false,
        areaStyle: { opacity: 0.18 },
        lineStyle: { width: 2 },
        data: [30, 40, 35, 50, 49, 60],
      },
    ],
  },
  "line-chart": {
    color: ["#3b82f6", "#ef4444"],
    grid: { left: 12, right: 12, top: 20, bottom: 24, containLabel: true },
    xAxis: {
      type: "category",
      data: ["1h", "2h", "3h", "4h", "5h", "6h"],
      axisLabel: { color: "#64748b", fontSize: 9 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#64748b", fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
    },
    tooltip: { trigger: "axis" },
    series: [
      {
        name: "Sensor A",
        type: "line",
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2 },
        data: [10, 41, 35, 51, 49, 62],
      },
      {
        name: "Sensor B",
        type: "line",
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2 },
        data: [23, 32, 27, 43, 38, 55],
      },
    ],
  },
  horizontal: {
    color: ["#f59e0b"],
    grid: { left: 16, right: 12, top: 20, bottom: 20, containLabel: true },
    xAxis: {
      type: "value",
      axisLabel: { color: "#64748b", fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
    },
    yAxis: {
      type: "category",
      data: ["Core", "Edge", "AI", "Power", "Storage"],
      axisLabel: { color: "#64748b", fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    series: [
      {
        type: "bar",
        data: [400, 430, 448, 470, 540],
        barMaxWidth: 18,
        itemStyle: { borderRadius: [0, 4, 4, 0] },
      },
    ],
  },
};

const chartLabels: Record<string, string> = {
  chart_bar: "Bar Chart",
  histogram: "Histogram",
  "ring-chart": "Ring Chart",
  "pie-chart": "Pie Chart",
  "radar-chart": "Radar Chart",
  "trend-chart": "Trend Chart",
  "line-chart": "Line Chart",
  horizontal: "Horizontal Bar",
};

export const ApexChartWidget = memo(function ApexChartWidget({
  data,
  type,
}: NodeProps) {
  const widgetData = data as Record<string, unknown>;
  const chartType = (type || "chart_bar") as string;
  const config = chartConfigs[chartType] || chartConfigs.chart_bar;
  const label =
    (widgetData.label as string) || chartLabels[chartType] || "Chart";

  return (
    <div className="w-[280px] rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[9px] font-medium text-indigo-600">
          LIVE
        </span>
      </div>
      <EChart option={config} height={180} />
    </div>
  );
});
