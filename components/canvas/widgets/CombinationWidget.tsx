"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { Combine, Thermometer, Droplets, Wind } from "lucide-react";

export const CombinationWidget = memo(function CombinationWidget({
  data,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  const items = [
    {
      icon: Thermometer,
      label: "Temp",
      value: "24.5°C",
      color: "text-red-500",
    },
    { icon: Droplets, label: "Humidity", value: "62%", color: "text-blue-500" },
    { icon: Wind, label: "Wind", value: "12 km/h", color: "text-emerald-500" },
  ];
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-[200px]">
      <div className="flex items-center gap-1.5 mb-2">
        <Combine size={12} className="text-indigo-500" />
        <span className="text-[10px] text-gray-500 font-medium">
          {(d.label as string) || "Combination"}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-1.5">
              <item.icon size={12} className={item.color} />
              <span className="text-[10px] text-gray-600">{item.label}</span>
            </div>
            <span className="text-xs font-bold text-gray-800">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
