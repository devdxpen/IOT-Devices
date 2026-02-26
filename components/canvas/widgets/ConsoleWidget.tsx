"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { Terminal } from "lucide-react";

const logLines = [
  { time: "10:32:01", msg: "[INFO] Sensor connected", color: "text-green-400" },
  { time: "10:32:05", msg: "[DATA] Temp: 24.5°C", color: "text-cyan-400" },
  { time: "10:32:08", msg: "[WARN] High humidity", color: "text-yellow-400" },
  {
    time: "10:32:12",
    msg: "[DATA] Pressure: 1013 hPa",
    color: "text-cyan-400",
  },
  { time: "10:32:15", msg: "[INFO] Data synced", color: "text-green-400" },
  { time: "10:32:18", msg: "[ERR] Timeout on ch3", color: "text-red-400" },
];

export const ConsoleWidget = memo(function ConsoleWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 w-[260px] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border-b border-gray-700">
        <Terminal size={12} className="text-green-400" />
        <span className="text-[10px] text-gray-400 font-medium">
          {(d.label as string) || "Console"}
        </span>
        <div className="ml-auto flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="p-2 font-mono text-[10px] space-y-0.5 max-h-[140px] overflow-hidden">
        {logLines.map((l, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-gray-600">{l.time}</span>
            <span className={l.color}>{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
