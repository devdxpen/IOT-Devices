"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { Monitor, Cpu, MemoryStick, Wifi } from "lucide-react";

export const DeviceMonitorWidget = memo(function DeviceMonitorWidget({
  data,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  const metrics = [
    { label: "CPU", value: 45, color: "bg-blue-500", icon: Cpu },
    { label: "RAM", value: 62, color: "bg-purple-500", icon: MemoryStick },
    { label: "Signal", value: 85, color: "bg-green-500", icon: Wifi },
  ];
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-[220px]">
      <div className="flex items-center gap-2 mb-3">
        <Monitor size={14} className="text-violet-500" />
        <span className="text-xs font-semibold text-gray-800">
          {(d.label as string) || "Device Monitor"}
        </span>
      </div>
      <div className="space-y-2">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-500 flex items-center gap-1">
                <m.icon size={10} />
                {m.label}
              </span>
              <span className="font-bold text-gray-700">{m.value}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${m.color} rounded-full transition-all`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
