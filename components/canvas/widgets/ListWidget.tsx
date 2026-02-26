"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { List, Clock, AlertTriangle, Server, ScrollText } from "lucide-react";

const listData: Record<
  string,
  {
    icon: React.ElementType;
    color: string;
    items: { title: string; sub: string }[];
  }
> = {
  "scroll-list": {
    icon: ScrollText,
    color: "text-blue-500",
    items: [
      { title: "Sensor #001", sub: "Active — 24.5°C" },
      { title: "Sensor #002", sub: "Active — 31.2°C" },
      { title: "Sensor #003", sub: "Idle — N/A" },
      { title: "Actuator #001", sub: "Running" },
      { title: "Gateway #001", sub: "Online" },
    ],
  },
  "history-record": {
    icon: Clock,
    color: "text-emerald-500",
    items: [
      { title: "10:32:01 — Temp updated", sub: "24.5°C → 24.8°C" },
      { title: "10:31:45 — Sensor synced", sub: "All OK" },
      { title: "10:31:12 — Alert cleared", sub: "Zone B" },
      { title: "10:30:58 — Valve opened", sub: "V-003" },
      { title: "10:30:30 — System check", sub: "Passed" },
    ],
  },
  "alarm-record": {
    icon: AlertTriangle,
    color: "text-red-500",
    items: [
      { title: "HIGH TEMP — Zone A", sub: "Critical • 10:32" },
      { title: "LOW PRESSURE — Tank 3", sub: "Warning • 10:28" },
      { title: "COMM FAIL — PLC 02", sub: "Error • 10:25" },
      { title: "VIBRATION — Motor M1", sub: "Warning • 10:20" },
      { title: "LEAK DETECT — Pipe P5", sub: "Critical • 10:15" },
    ],
  },
  "alarm-card-list": {
    icon: AlertTriangle,
    color: "text-orange-500",
    items: [
      { title: "Overheating Alert", sub: "Sensor 5 — Active" },
      { title: "Communication Loss", sub: "PLC 3 — Resolved" },
      { title: "Pressure Drop", sub: "Tank A — Active" },
      { title: "Motor Overload", sub: "Motor 2 — Warning" },
    ],
  },
  "devices-list": {
    icon: Server,
    color: "text-violet-500",
    items: [
      { title: "ESP32-Gateway", sub: "192.168.1.10 • Online" },
      { title: "Arduino-Sensor", sub: "192.168.1.20 • Online" },
      { title: "PLC-Siemens", sub: "192.168.1.30 • Offline" },
      { title: "Raspberry-Pi", sub: "192.168.1.40 • Online" },
    ],
  },
};

export const ListWidget = memo(function ListWidget({ data, type }: NodeProps) {
  const d = data as Record<string, unknown>;
  const listType = (type || "scroll-list") as string;
  const config = listData[listType] || listData["scroll-list"];
  const Icon = config.icon;
  const label =
    (d.label as string) ||
    listType
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-[240px] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50/50">
        <Icon size={12} className={config.color} />
        <span className="text-[11px] font-semibold text-gray-700">{label}</span>
        <span className="ml-auto text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
          {config.items.length}
        </span>
      </div>
      <div className="max-h-[160px] overflow-y-auto divide-y divide-gray-50">
        {config.items.map((item, i) => (
          <div key={i} className="px-3 py-2 hover:bg-gray-50 transition-colors">
            <div className="text-[11px] font-medium text-gray-800">
              {item.title}
            </div>
            <div className="text-[9px] text-gray-400">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
});
