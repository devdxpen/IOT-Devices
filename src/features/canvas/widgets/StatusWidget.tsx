"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const statusConfig: Record<
  string,
  { color: string; bg: string; icon: React.ElementType; text: string }
> = {
  normal: {
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    icon: CheckCircle,
    text: "Normal",
  },
  warning: {
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: AlertTriangle,
    text: "Warning",
  },
  error: {
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
    text: "Error",
  },
};

export const StatusWidget = memo(function StatusWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  const status = (d.status as string) || "normal";
  const cfg = statusConfig[status] || statusConfig.normal;
  const Icon = cfg.icon;

  return (
    <div className={`rounded-xl shadow-lg border-2 p-4 w-[170px] ${cfg.bg}`}>
      <span className="text-[10px] text-gray-500 font-medium">
        {(d.label as string) || "Status"}
      </span>
      <div className="flex items-center gap-2 mt-2">
        <Icon size={24} className={cfg.color} />
        <span className={`text-sm font-bold ${cfg.color}`}>{cfg.text}</span>
      </div>
      <div className="text-[10px] text-gray-400 mt-2">Updated: just now</div>
    </div>
  );
});
