"use client";

import type { ApexOptions } from "@/components/charts/apex-chart";
import { AnalyticsChartCard } from "@/components/charts/chart-card";

export function HomeAnalyticsSection() {
  // Mock data for Device Growth
  const deviceGrowthSeries = [
    {
      name: "Active Devices",
      data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
    },
    {
      name: "Inactive Devices",
      data: [12, 11, 14, 18, 17, 13, 13, 11, 15, 12, 14, 16],
    },
  ];

  const deviceGrowthOptions: ApexOptions = {
    chart: {
      id: "device-growth-chart",
      toolbar: { show: false },
    },
    colors: ["#3b82f6", "#94a3b8"],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100],
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  // Mock data for User Retention
  const userRetentionSeries = [
    {
      name: "Retention Rate (%)",
      data: [82, 78, 85, 91, 88, 76, 81, 84, 87, 85, 89, 92],
    },
  ];

  const userRetentionOptions: ApexOptions = {
    chart: {
      id: "user-retention-chart",
      toolbar: { show: false },
    },
    colors: ["#0ea5e9"],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    dataLabels: { enabled: false },
  };

  // Mock data for Company Distribution
  const companyDistributionSeries = [45, 25, 15, 15];
  const companyDistributionOptions: ApexOptions = {
    labels: ["Enterprise", "Professional", "Standard", "Free"],
    colors: ["#2563eb", "#38bdf8", "#7dd3fc", "#cbd5e1"],
    legend: {
      position: "bottom",
      fontSize: "13px",
    },
    dataLabels: { enabled: true },
    stroke: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Tier Split",
              formatter: () => "100%",
            },
          },
        },
      },
    },
  };

  return (
    <div className="mt-16 space-y-8 px-1">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Platform Analytics Overview
        </h2>
        <p className="text-lg text-slate-500">
          Real-time insights across devices, users, and companies.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnalyticsChartCard
          title="Device Growth"
          description="Monthly trend of active vs inactive devices"
          type="area"
          series={deviceGrowthSeries}
          options={deviceGrowthOptions}
        />
        <AnalyticsChartCard
          title="User Retention Rate"
          description="Percentage of recurring users per month"
          type="bar"
          series={userRetentionSeries}
          options={userRetentionOptions}
        />
        <AnalyticsChartCard
          title="Company Tier Split"
          description="Distribution of companies by plan type"
          type="donut"
          series={companyDistributionSeries}
          options={companyDistributionOptions}
        />
      </div>
    </div>
  );
}
