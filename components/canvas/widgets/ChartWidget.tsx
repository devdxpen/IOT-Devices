"use client";

import React, { useState, useEffect, useRef } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { TrendingUp, MoreHorizontal, ArrowUp } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import gsap from "gsap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Generate initial data
const generateData = () => {
  const data = [];
  for (let i = 0; i <= 70; i += 7) {
    data.push({
      day: i,
      primary: Math.random() * 80 + 20,
      secondary: Math.random() * 60 + 10,
    });
  }
  return data;
};

export function ChartWidget({ id }: NodeProps) {
  const [data, setData] = useState(generateData);
  const [currentValue, setCurrentValue] = useState(1.2);
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  // Animate on mount
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
      );
    }
  }, []);

  // Live data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData());
      const newValue = (Math.random() * 2 + 0.5).toFixed(1);
      setCurrentValue(parseFloat(newValue));

      // Animate value change
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
          className="w-72 p-4 shadow-lg border border-gray-200 bg-gradient-to-br from-green-900 to-green-950 text-white"
        >

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-400" />
              <span className="font-semibold text-sm">Growth analytics</span>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Live value indicator */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <ArrowUp size={12} className="text-white" />
              <span ref={valueRef} className="text-sm font-bold text-green-900">
                {currentValue} cm/day
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-32 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient
                    id="primaryGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="secondaryGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  tickFormatter={(v) => `${v} days`}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="primary"
                  stroke="#4ade80"
                  strokeWidth={2}
                  fill="url(#primaryGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="secondary"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  fill="url(#secondaryGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-gray-400 mt-2">ID: {id.slice(0, 8)}</div>
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
