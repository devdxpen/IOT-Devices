"use client";

import type { EChartsOption } from "echarts";
import dynamic from "next/dynamic";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
});

interface EChartProps {
  option: EChartsOption | Record<string, unknown>;
  height?: number | string;
  width?: number | string;
  className?: string;
  onEvents?: Record<string, (params: unknown) => void>;
}

export function EChart({
  option,
  height = 320,
  width = "100%",
  className,
  onEvents,
}: EChartProps) {
  return (
    <ReactECharts
      option={option}
      style={{ height, width }}
      className={className}
      onEvents={onEvents}
      opts={{ renderer: "svg" }}
    />
  );
}

export type { EChartsOption };
