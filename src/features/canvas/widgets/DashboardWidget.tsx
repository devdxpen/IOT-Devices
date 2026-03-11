"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { LayoutDashboard, TrendingUp, TrendingDown } from "lucide-react";

const kpis = [
  { label: "Active Devices", value: "142", change: "+12%", positive: true },
  { label: "Alerts", value: "3", change: "-5%", positive: true },
  { label: "Uptime", value: "99.7%", change: "+0.2%", positive: true },
  { label: "Data Rate", value: "1.2K/s", change: "-3%", positive: false },
];

export const DashboardWidget = memo(function DashboardWidget({
  data,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-[260px]">
      <div className="flex items-center gap-2 mb-3">
        <LayoutDashboard size={14} className="text-indigo-500" />
        <span className="text-xs font-semibold text-gray-800">
          {(d.label as string) || "Dashboard"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="p-2 bg-gray-50 rounded-lg">
            <span className="text-[9px] text-gray-400 block">{kpi.label}</span>
            <div className="flex items-end gap-1.5 mt-1">
              <span className="text-sm font-bold text-gray-900">
                {kpi.value}
              </span>
              <span
                className={`text-[9px] font-medium flex items-center ${kpi.positive ? "text-green-500" : "text-red-500"}`}
              >
                {kpi.positive ? (
                  <TrendingUp size={8} />
                ) : (
                  <TrendingDown size={8} />
                )}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
