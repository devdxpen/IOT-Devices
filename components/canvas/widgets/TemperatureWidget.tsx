"use client";

import React, { useState, useEffect } from "react";
import { NodeProps, Node } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Thermometer, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type WidgetData = {
  label?: string;
  value?: number;
  location?: string;
  status?: "active" | "warning" | "normal";
  onDelete?: (id: string) => void;
  onDuplicate?: (node: Node) => void;
};

export function TemperatureWidget({ data, id }: NodeProps) {
  const widgetData = data as WidgetData;
  const [temperature, setTemperature] = useState(widgetData.value || 25);
  const [status, setStatus] = useState<"normal" | "warning" | "critical">(
    "normal",
  );
  const [lastUpdate, setLastUpdate] = useState("Just now");

  // Simulate real-time temperature updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newTemp = temperature + (Math.random() - 0.5) * 2;
      const clampedTemp = Math.max(15, Math.min(40, newTemp));
      setTemperature(parseFloat(clampedTemp.toFixed(1)));

      // Update status based on temperature
      if (clampedTemp > 35) {
        setStatus("critical");
      } else if (clampedTemp > 30) {
        setStatus("warning");
      } else {
        setStatus("normal");
      }

      setLastUpdate("Just now");
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [temperature]);

  const statusColors = {
    normal: "text-green-600",
    warning: "text-orange-600",
    critical: "text-red-600",
  };

  return (
    <Card className="w-52 p-4 shadow-lg border-2 border-blue-500 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Thermometer className="text-red-500" size={20} />
          <span className="font-semibold text-sm">Temperature</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => widgetData.onDuplicate?.({ id, data } as Node)}
          >
            <Copy size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => widgetData.onDelete?.(id)}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      <div className="text-center mb-3">
        <div className="text-4xl font-bold text-red-600">{temperature}°C</div>
        <div className="text-xs text-gray-500 mt-1">Current Reading</div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${statusColors[status]}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">Ahmedabad</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Last Update:</span>
          <span className="font-medium">{lastUpdate}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t">
        <div className="text-xs text-gray-500">Sensor ID: {id.slice(0, 8)}</div>
      </div>
    </Card>
  );
}
