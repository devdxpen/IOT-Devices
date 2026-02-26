"use client";

import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chartConfigs: Record<
  string,
  {
    type: "bar" | "line" | "pie" | "donut" | "radar" | "area" | "radialBar";
    options: ApexCharts.ApexOptions;
    series: ApexAxisChartSeries | number[];
  }
> = {
  chart_bar: {
    type: "bar",
    options: {
      chart: { toolbar: { show: false }, background: "transparent" },
      plotOptions: { bar: { borderRadius: 4, columnWidth: "60%" } },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        labels: { style: { fontSize: "10px" } },
      },
      yaxis: { labels: { style: { fontSize: "10px" } } },
      colors: ["#6366f1"],
      grid: { borderColor: "#f1f5f9" },
      dataLabels: { enabled: false },
    },
    series: [{ name: "Value", data: [44, 55, 41, 67, 22] }],
  },
  histogram: {
    type: "bar",
    options: {
      chart: { toolbar: { show: false } },
      plotOptions: { bar: { columnWidth: "95%", borderRadius: 2 } },
      xaxis: {
        categories: ["0-10", "10-20", "20-30", "30-40", "40-50"],
        labels: { style: { fontSize: "9px" } },
      },
      yaxis: { labels: { style: { fontSize: "10px" } } },
      colors: ["#8b5cf6"],
      grid: { borderColor: "#f1f5f9" },
      dataLabels: { enabled: false },
    },
    series: [{ name: "Frequency", data: [12, 28, 45, 32, 18] }],
  },
  "ring-chart": {
    type: "donut",
    options: {
      chart: { toolbar: { show: false } },
      labels: ["Active", "Idle", "Error", "Offline"],
      colors: ["#22c55e", "#f59e0b", "#ef4444", "#94a3b8"],
      legend: { position: "bottom", fontSize: "10px" },
      plotOptions: { pie: { donut: { size: "55%" } } },
      dataLabels: { enabled: false },
    },
    series: [44, 25, 13, 18],
  },
  "pie-chart": {
    type: "pie",
    options: {
      chart: { toolbar: { show: false } },
      labels: ["Sensors", "Actuators", "Gateway", "Edge"],
      colors: ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"],
      legend: { position: "bottom", fontSize: "10px" },
      dataLabels: { enabled: false },
    },
    series: [35, 25, 20, 20],
  },
  "radar-chart": {
    type: "radar",
    options: {
      chart: { toolbar: { show: false } },
      xaxis: { categories: ["Temp", "Humidity", "Pressure", "Wind", "Light"] },
      yaxis: { show: false },
      colors: ["#6366f1"],
      markers: { size: 3 },
      dataLabels: { enabled: false },
    },
    series: [{ name: "Sensor", data: [80, 50, 70, 40, 90] }],
  },
  "trend-chart": {
    type: "area",
    options: {
      chart: { toolbar: { show: false }, sparkline: { enabled: false } },
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 },
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        labels: { style: { fontSize: "9px" } },
      },
      yaxis: { labels: { style: { fontSize: "10px" } } },
      colors: ["#22c55e"],
      grid: { borderColor: "#f1f5f9" },
      dataLabels: { enabled: false },
    },
    series: [{ name: "Trend", data: [30, 40, 35, 50, 49, 60] }],
  },
  "line-chart": {
    type: "line",
    options: {
      chart: { toolbar: { show: false } },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        categories: ["1h", "2h", "3h", "4h", "5h", "6h"],
        labels: { style: { fontSize: "9px" } },
      },
      yaxis: { labels: { style: { fontSize: "10px" } } },
      colors: ["#3b82f6", "#ef4444"],
      grid: { borderColor: "#f1f5f9" },
      dataLabels: { enabled: false },
    },
    series: [
      { name: "Sensor A", data: [10, 41, 35, 51, 49, 62] },
      { name: "Sensor B", data: [23, 32, 27, 43, 38, 55] },
    ],
  },
  horizontal: {
    type: "bar",
    options: {
      chart: { toolbar: { show: false } },
      plotOptions: {
        bar: { horizontal: true, borderRadius: 4, barHeight: "60%" },
      },
      xaxis: { labels: { style: { fontSize: "10px" } } },
      yaxis: { labels: { style: { fontSize: "10px" } } },
      colors: ["#f59e0b"],
      grid: { borderColor: "#f1f5f9" },
      dataLabels: { enabled: false },
    },
    series: [{ name: "Usage", data: [400, 430, 448, 470, 540] }],
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
  const config = chartConfigs[chartType] || chartConfigs["chart_bar"];
  const label =
    (widgetData.label as string) || chartLabels[chartType] || "Chart";

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-[280px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        <span className="text-[9px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-medium">
          LIVE
        </span>
      </div>
      <div className="w-full">
        <Chart
          options={config.options}
          series={config.series as ApexAxisChartSeries}
          type={config.type}
          height={180}
          width="100%"
        />
      </div>
    </div>
  );
});
