"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { Cpu, Wifi, HardDrive, Thermometer } from "lucide-react";

export const DeviceInfoWidget = memo(function DeviceInfoWidget({
  data,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-[220px]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
          <Cpu size={16} className="text-teal-600" />
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-800 block">
            {(d.label as string) || "Device Info"}
          </span>
          <span className="text-[9px] text-green-500 font-medium">
            ● Online
          </span>
        </div>
      </div>
      <div className="space-y-1.5 text-[10px]">
        <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded">
          <span className="text-gray-500 flex items-center gap-1">
            <Cpu size={10} />
            Model
          </span>
          <span className="font-medium text-gray-700">ESP32-S3</span>
        </div>
        <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded">
          <span className="text-gray-500 flex items-center gap-1">
            <Wifi size={10} />
            IP
          </span>
          <span className="font-mono text-gray-700">192.168.1.42</span>
        </div>
        <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded">
          <span className="text-gray-500 flex items-center gap-1">
            <HardDrive size={10} />
            Firmware
          </span>
          <span className="font-medium text-gray-700">v2.1.3</span>
        </div>
        <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded">
          <span className="text-gray-500 flex items-center gap-1">
            <Thermometer size={10} />
            Uptime
          </span>
          <span className="font-medium text-gray-700">4d 12h</span>
        </div>
      </div>
    </div>
  );
});
