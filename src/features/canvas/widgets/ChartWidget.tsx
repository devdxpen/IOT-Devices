"use client";

import React, { useEffect, useRef, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { ArrowUp, MoreHorizontal, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { EChart, type EChartsOption } from "@/components/charts/echart";
import { Card } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const generateData = () =>
  Array.from({ length: 11 }, (_, index) => {
    const day = index * 7;
    return {
      day,
      primary: Math.random() * 80 + 20,
      secondary: Math.random() * 60 + 10,
    };
  });

function buildOption(data: Array<{ day: number; primary: number; secondary: number }>): EChartsOption {
  return {
    color: ["#4ade80", "#fbbf24"],
    grid: { left: 8, right: 8, top: 10, bottom: 20, containLabel: true },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#1f2937",
      borderColor: "#1f2937",
      textStyle: { color: "#ffffff" },
    },
    xAxis: {
      type: "category",
      data: data.map((item) => `${item.day} days`),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#9ca3af", fontSize: 10 },
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        name: "Primary",
        type: "line",
        smooth: true,
        showSymbol: false,
        data: data.map((item) => item.primary),
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.18 },
      },
      {
        name: "Secondary",
        type: "line",
        smooth: true,
        showSymbol: false,
        data: data.map((item) => item.secondary),
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.12 },
      },
    ],
  };
}

export function ChartWidget({ id }: NodeProps) {
  const [data, setData] = useState(generateData);
  const [currentValue, setCurrentValue] = useState(1.2);
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
      );
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData());
      const newValue = (Math.random() * 2 + 0.5).toFixed(1);
      setCurrentValue(Number.parseFloat(newValue));

      if (valueRef.current) {
        gsap.fromTo(
          valueRef.current,
          { scale: 1.2, color: "#22c55e" },
          { scale: 1, color: "#166534", duration: 0.3, ease: "power2.out" },
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          ref={cardRef}
          className="w-72 border border-gray-200 bg-gradient-to-br from-green-900 to-green-950 p-4 text-white shadow-lg"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-400" />
              <span className="text-sm font-semibold">Growth analytics</span>
            </div>
            <button type="button" className="text-gray-400 transition-colors hover:text-white">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="absolute top-16 left-1/2 z-10 -translate-x-1/2 transform">
            <div className="flex items-center gap-1 rounded-full bg-green-500/90 px-3 py-1 shadow-lg backdrop-blur-sm">
              <ArrowUp size={12} className="text-white" />
              <span ref={valueRef} className="text-sm font-bold text-green-900">
                {currentValue} cm/day
              </span>
            </div>
          </div>

          <div className="-mx-2 h-32">
            <EChart option={buildOption(data)} height="100%" />
          </div>

          <div className="mt-2 text-xs text-gray-400">ID: {id.slice(0, 8)}</div>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>Edit Chart</ContextMenuItem>
        <ContextMenuItem>Export Data</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuItem className="text-red-600">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
