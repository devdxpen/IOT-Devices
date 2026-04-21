"use client";

import { analyticsAppConfig } from "@/config/appConfig";
import { EChart, type EChartsOption } from "@/components/charts/echart";

export type ApexAxisChartSeries = Array<{
  name: string;
  data: Array<number | null>;
}>;

export type ApexNonAxisChartSeries = number[];

export type ApexOptions = {
  chart?: {
    type?: "line" | "area" | "bar" | "donut" | "pie";
    stacked?: boolean;
    toolbar?: { show?: boolean };
    [key: string]: unknown;
  };
  colors?: string[];
  labels?: string[];
  legend?: {
    show?: boolean;
    position?: "top" | "bottom" | "left" | "right";
    horizontalAlign?: "left" | "center" | "right";
    [key: string]: unknown;
  };
  dataLabels?: {
    enabled?: boolean;
    formatter?: (value: number) => string;
    [key: string]: unknown;
  };
  stroke?: {
    curve?: "smooth" | "straight";
    width?: number;
    show?: boolean;
    [key: string]: unknown;
  };
  grid?: {
    borderColor?: string;
    strokeDashArray?: number;
    [key: string]: unknown;
  };
  xaxis?: {
    categories?: string[];
    axisBorder?: { show?: boolean };
    axisTicks?: { show?: boolean };
    [key: string]: unknown;
  };
  yaxis?:
    | {
        labels?: {
          formatter?: (value: number) => string;
        };
        [key: string]: unknown;
      }
    | Array<{
        labels?: {
          formatter?: (value: number) => string;
        };
        [key: string]: unknown;
      }>;
  fill?: {
    type?: string;
    gradient?: {
      opacityFrom?: number;
      opacityTo?: number;
      [key: string]: unknown;
    };
  };
  plotOptions?: {
    bar?: {
      borderRadius?: number;
      columnWidth?: string;
      horizontal?: boolean;
      barHeight?: string;
      [key: string]: unknown;
    };
    pie?: {
      donut?: {
        size?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  tooltip?: {
    theme?: "light" | "dark";
    shared?: boolean;
    intersect?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

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

function buildAxisChartOption(
  type: "line" | "area" | "bar",
  series: ApexAxisChartSeries,
  options: ApexOptions,
): EChartsOption {
  const categories = options.xaxis?.categories ?? [];
  const colors = options.colors ?? [...analyticsAppConfig.chartPalette];
  const yAxisConfig = Array.isArray(options.yaxis)
    ? options.yaxis[0]
    : options.yaxis;
  const yAxisFormatter = yAxisConfig?.labels?.formatter;
  const dataLabelFormatter = options.dataLabels?.formatter;
  const horizontal = options.plotOptions?.bar?.horizontal;
  const stacked = Boolean(options.chart?.stacked);
  const chartSeries =
    type === "bar"
      ? series.map((entry) => ({
          name: entry.name,
          type: "bar" as const,
          data: entry.data,
          stack: stacked ? "total" : undefined,
          barMaxWidth:
            options.plotOptions?.bar?.columnWidth &&
            !Number.isNaN(
              Number.parseInt(options.plotOptions.bar.columnWidth, 10),
            )
              ? Number.parseInt(options.plotOptions.bar.columnWidth, 10)
              : undefined,
          itemStyle: {
            borderRadius: options.plotOptions?.bar?.borderRadius ?? 4,
          },
          label: options.dataLabels?.enabled
            ? {
                show: true,
                position: "top" as const,
                formatter: dataLabelFormatter
                  ? (params: { value?: unknown }) =>
                      dataLabelFormatter(
                        typeof params.value === "number" ? params.value : 0,
                      )
                  : undefined,
              }
            : { show: false },
          emphasis: {
            focus: "series" as const,
          },
        }))
      : series.map((entry) => ({
          name: entry.name,
          type: "line" as const,
          data: entry.data,
          stack: stacked ? "total" : undefined,
          smooth: options.stroke?.curve === "smooth",
          showSymbol: true,
          symbolSize: 6,
          lineStyle: {
            width: options.stroke?.width ?? 2,
          },
          areaStyle:
            type === "area"
              ? {
                  opacity: options.fill?.gradient?.opacityFrom ?? 0.22,
                }
              : undefined,
          label: options.dataLabels?.enabled
            ? {
                show: true,
                position: "top" as const,
                formatter: dataLabelFormatter
                  ? (params: { value?: unknown }) =>
                      dataLabelFormatter(
                        typeof params.value === "number" ? params.value : 0,
                      )
                  : undefined,
              }
            : { show: false },
          emphasis: {
            focus: "series" as const,
          },
        }));

  return {
    color: colors,
    animationDuration: 380,
    legend: {
      show: options.legend?.show ?? true,
      top: options.legend?.position === "bottom" ? "bottom" : 8,
      left:
        options.legend?.horizontalAlign === "right"
          ? "right"
          : options.legend?.horizontalAlign === "center"
            ? "center"
            : "left",
      textStyle: { color: "#475569", fontSize: 12 },
    },
    tooltip: {
      trigger: horizontal ? "axis" : "axis",
      axisPointer: {
        type: type === "bar" ? "shadow" : "line",
      },
      backgroundColor: options.tooltip?.theme === "dark" ? "#0f172a" : "#ffffff",
      borderColor: "#e2e8f0",
      textStyle: {
        color: options.tooltip?.theme === "dark" ? "#f8fafc" : "#0f172a",
      },
    },
    grid: {
      left: horizontal ? 16 : 12,
      right: 16,
      top: 48,
      bottom: 24,
      containLabel: true,
      borderColor: options.grid?.borderColor ?? "#e2e8f0",
    },
    xAxis: horizontal
      ? {
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            show: true,
            lineStyle: {
              color: options.grid?.borderColor ?? "#e2e8f0",
              type: options.grid?.strokeDashArray ? "dashed" : "solid",
            },
          },
          axisLabel: {
            color: "#64748b",
            formatter: yAxisFormatter as ((value: number) => string) | undefined,
          },
        }
      : {
          type: "category",
          data: categories,
          axisLine: { show: options.xaxis?.axisBorder?.show ?? false },
          axisTick: { show: options.xaxis?.axisTicks?.show ?? false },
          splitLine: { show: false },
          axisLabel: {
            color: "#64748b",
          },
        },
    yAxis: horizontal
      ? {
          type: "category",
          data: categories,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: "#64748b",
          },
        }
      : {
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            show: true,
            lineStyle: {
              color: options.grid?.borderColor ?? "#e2e8f0",
              type: options.grid?.strokeDashArray ? "dashed" : "solid",
            },
          },
          axisLabel: {
            color: "#64748b",
            formatter: yAxisFormatter as ((value: number) => string) | undefined,
          },
        },
    series: chartSeries,
  };
}

function buildCircularChartOption(
  type: "donut" | "pie",
  series: ApexNonAxisChartSeries,
  options: ApexOptions,
): EChartsOption {
  const labels =
    options.labels ?? series.map((_, index) => `Series ${index + 1}`);
  const colors = options.colors ?? [...analyticsAppConfig.chartPalette];
  const donutSize = options.plotOptions?.pie?.donut?.size ?? "62%";

  return {
    color: colors,
    animationDuration: 380,
    tooltip: {
      trigger: "item",
      backgroundColor: options.tooltip?.theme === "dark" ? "#0f172a" : "#ffffff",
      borderColor: "#e2e8f0",
      textStyle: {
        color: options.tooltip?.theme === "dark" ? "#f8fafc" : "#0f172a",
      },
    },
    legend: {
      show: options.legend?.show ?? true,
      orient:
        options.legend?.position === "left" || options.legend?.position === "right"
          ? "vertical"
          : "horizontal",
      left:
        options.legend?.position === "right"
          ? "right"
          : options.legend?.position === "left"
            ? "left"
            : "center",
      top: options.legend?.position === "top" ? "top" : "bottom",
      textStyle: { color: "#475569", fontSize: 12 },
    },
    series: [
      {
        name: "Distribution",
        type: "pie",
        radius: type === "donut" ? [donutSize, "82%"] : ["0%", "78%"],
        center: ["50%", "46%"],
        avoidLabelOverlap: true,
        label: {
          show: options.dataLabels?.enabled ?? false,
          formatter: (params: { percent?: unknown }) =>
            options.dataLabels?.formatter
              ? options.dataLabels.formatter(
                  typeof params.percent === "number" ? params.percent : 0,
                )
              : `${Math.round(
                  typeof params.percent === "number" ? params.percent : 0,
                )}%`,
          color: "#0f172a",
          fontSize: 11,
          fontWeight: 600,
        },
        labelLine: {
          show: options.dataLabels?.enabled ?? false,
        },
        itemStyle: {
          borderColor: "#ffffff",
          borderWidth: options.stroke?.show === false || options.stroke?.width === 0 ? 0 : 2,
        },
        data: series.map((value, index) => ({
          value,
          name: labels[index] ?? `Series ${index + 1}`,
        })),
      },
    ],
  };
}

function toEChartOption(
  type: ApexChartProps["type"],
  series: ApexAxisChartSeries | ApexNonAxisChartSeries,
  options: ApexOptions = {},
) {
  if (type === "donut" || type === "pie") {
    return buildCircularChartOption(type, series as ApexNonAxisChartSeries, options);
  }

  return buildAxisChartOption(type, series as ApexAxisChartSeries, options);
}

export function ApexChart({
  type,
  series,
  options,
  height = 320,
  onDataPointSelect,
}: ApexChartProps) {
  const chartOption = toEChartOption(type, series, options);

  return (
    <EChart
      option={chartOption}
      height={height}
      onEvents={
        onDataPointSelect
          ? {
              click: (params: unknown) => {
                const event =
                  typeof params === "object" && params !== null
                    ? (params as {
                        dataIndex?: number;
                        seriesIndex?: number;
                        value?: number;
                        name?: string;
                        seriesName?: string;
                      })
                    : {};
                onDataPointSelect({
                  dataPointIndex: event.dataIndex ?? 0,
                  seriesIndex: event.seriesIndex ?? 0,
                  value: Number(event.value ?? 0),
                  label: String(event.name ?? ""),
                  seriesName: String(event.seriesName ?? "Series"),
                });
              },
            }
          : undefined
      }
    />
  );
}
