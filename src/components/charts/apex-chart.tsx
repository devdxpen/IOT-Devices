"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { analyticsAppConfig } from "@/config/appConfig";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export type ApexAxisChartSeries = Array<{
  name: string;
  data: Array<number | null>;
}>;

export type ApexNonAxisChartSeries = number[];

export interface DataPointSelection {
  dataPointIndex: number;
  seriesIndex: number;
  value: number;
  label: string;
  seriesName: string;
}

interface ApexChartProps {
  type: "line" | "area" | "bar" | "donut" | "pie";
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  options?: ApexOptions;
  height?: number;
  onDataPointSelect?: (selection: DataPointSelection) => void;
}

export function ApexChart({
  type,
  series,
  options,
  height = 320,
  onDataPointSelect,
}: ApexChartProps) {
  const fallbackOptions: ApexOptions = {
    chart: {
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
      },
      animations: {
        speed: 380,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2.4,
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
    colors: [...analyticsAppConfig.chartPalette],
    tooltip: {
      theme: "light",
      shared: true,
      intersect: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${Math.round(value)}`,
      },
    },
  };

  const mergedOptions: ApexOptions = {
    ...fallbackOptions,
    ...options,
    chart: {
      ...fallbackOptions.chart,
      ...options?.chart,
      events: {
        ...options?.chart?.events,
        dataPointSelection: (event, chartContext, config) => {
          options?.chart?.events?.dataPointSelection?.(
            event,
            chartContext,
            config,
          );

          if (!onDataPointSelect) {
            return;
          }

          const labels = options?.labels ?? options?.xaxis?.categories ?? [];
          const selectedLabel =
            labels[config.dataPointIndex] ??
            `Point ${config.dataPointIndex + 1}`;

          if (Array.isArray(series)) {
            if (typeof series[0] === "number") {
              onDataPointSelect({
                dataPointIndex: config.dataPointIndex,
                seriesIndex: config.seriesIndex,
                value: Number(series[config.dataPointIndex] ?? 0),
                label: String(selectedLabel),
                seriesName:
                  options?.labels?.[config.dataPointIndex] ?? "Series",
              });
              return;
            }

            const axisSeries = series as ApexAxisChartSeries;
            const selectedSeries = axisSeries[config.seriesIndex];
            const selectedValue = Number(
              selectedSeries?.data?.[config.dataPointIndex] ?? 0,
            );
            onDataPointSelect({
              dataPointIndex: config.dataPointIndex,
              seriesIndex: config.seriesIndex,
              value: selectedValue,
              label: String(selectedLabel),
              seriesName: selectedSeries?.name ?? "Series",
            });
          }
        },
      },
    },
  };

  return (
    <ReactApexChart
      type={type}
      series={series}
      options={mergedOptions}
      height={height}
    />
  );
}
