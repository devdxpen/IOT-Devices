"use client";

import React, { useState, useEffect } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Gauge, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GaugeWidget({ data, id }: NodeProps) {
  const [value, setValue] = useState(65);
  const [status, setStatus] = useState<"low" | "normal" | "high">("normal");

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * 100);
      setValue(newValue);

      if (newValue < 30) setStatus("low");
      else if (newValue > 70) setStatus("high");
      else setStatus("normal");
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    low: "text-blue-500",
    normal: "text-green-500",
    high: "text-red-500",
  };

  const arcColor = {
    low: "#3b82f6",
    normal: "#22c55e",
    high: "#ef4444",
  };

  // Calculate rotation for gauge needle (from -90 to 90 degrees)
  const rotation = (value / 100) * 180 - 90;

  return (
    <Card className="w-52 p-4 shadow-lg border-2 border-emerald-500 bg-white">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="text-emerald-600" size={20} />
          <span className="font-semibold text-sm">Gauge Meter</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Copy size={12} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
        {/* Gauge SVG */}
        <svg width="120" height="70" viewBox="0 0 120 70">
          {/* Background arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke={arcColor[status]}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 157} 157`}
          />
          {/* Needle */}
          <line
            x1="60"
            y1="60"
            x2="60"
            y2="20"
            stroke="#374151"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${rotation} 60 60)`}
          />
          {/* Center circle */}
          <circle cx="60" cy="60" r="6" fill="#374151" />
        </svg>

        <div className={`text-2xl font-bold mt-2 ${statusColors[status]}`}>
          {value}%
        </div>
      </div>

      <div className="mt-3 pt-3 border-t space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${statusColors[status]}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <div className="text-xs text-gray-400">ID: {id.slice(0, 8)}</div>
      </div>
    </Card>
  );
}
