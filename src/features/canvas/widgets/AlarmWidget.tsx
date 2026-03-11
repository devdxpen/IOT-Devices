"use client";

import React, { useState, useEffect } from "react";
import { NodeProps, Node } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Bell, AlertTriangle, Trash2, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AlarmStatus = "active" | "warning" | "normal";

type WidgetData = {
  label?: string;
  value?: number;
  location?: string;
  status?: AlarmStatus;
  onDelete?: (id: string) => void;
  onDuplicate?: (node: Node) => void;
};

export function AlarmWidget({ data, id }: NodeProps) {
  const widgetData = data as WidgetData;
  const [status, setStatus] = useState<AlarmStatus>(
    widgetData.status || "normal",
  );
  const [triggerTime, setTriggerTime] = useState("5 min ago");
  const [alertCount, setAlertCount] = useState(0);

  // Simulate alarm status changes
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      let newStatus: AlarmStatus;

      if (random > 0.9) {
        newStatus = "active";
        setAlertCount((prev) => prev + 1);
      } else if (random > 0.7) {
        newStatus = "warning";
      } else {
        newStatus = "normal";
      }

      setStatus(newStatus);
      setTriggerTime("Just now");
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    active: {
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-500",
      icon: AlertTriangle,
      label: "⚠️ CRITICAL ALERT",
      message: "Temperature threshold exceeded",
      priority: "High",
    },
    warning: {
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-500",
      icon: Bell,
      label: "⚡ WARNING",
      message: "Device connection unstable",
      priority: "Medium",
    },
    normal: {
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-500",
      icon: CheckCircle2,
      label: "✓ NORMAL",
      message: "All systems operational",
      priority: "Low",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className={cn("w-52 p-4 shadow-lg border-2 bg-white", config.border)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon
            className={cn(config.color, status === "active" && "animate-pulse")}
            size={20}
          />
          <span className="font-semibold text-sm">Alarm Alert</span>
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

      <div
        className={cn(
          "p-3 rounded-lg mb-3",
          config.bg,
          status === "active" && "animate-pulse",
        )}
      >
        <div className={cn("text-base font-bold", config.color)}>
          {config.label}
        </div>
        <div className="text-xs text-gray-600 mt-1">{config.message}</div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Priority:</span>
          <span className={cn("font-medium", config.color)}>
            {config.priority}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Device:</span>
          <span className="font-medium">Sensor-{id.slice(-3)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Triggered:</span>
          <span className="font-medium">{triggerTime}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Total Alerts:</span>
          <span className="font-medium">{alertCount}</span>
        </div>
      </div>
    </Card>
  );
}
