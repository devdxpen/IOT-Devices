"use client";

import React, { useState, useEffect } from "react";
import { NodeProps, Node } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Trash2, Copy, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

type WidgetData = {
  label?: string;
  value?: number;
  location?: string;
  status?: "active" | "warning" | "normal";
  onDelete?: (id: string) => void;
  onDuplicate?: (node: Node) => void;
};

export function LocationWidget({ data, id }: NodeProps) {
  const widgetData = data as WidgetData;
  const [lat, setLat] = useState(23.0225);
  const [lng, setLng] = useState(72.5714);
  const [isMoving, setIsMoving] = useState(false);
  const [accuracy, setAccuracy] = useState(5.0);

  // Simulate GPS movement
  useEffect(() => {
    const interval = setInterval(() => {
      setLat((prev) => prev + (Math.random() - 0.5) * 0.0001);
      setLng((prev) => prev + (Math.random() - 0.5) * 0.0001);
      setIsMoving(Math.random() > 0.5);
      setAccuracy(Math.random() * 5 + 2);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-52 p-4 shadow-lg border-2 border-green-500 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="text-green-600" size={20} />
          <span className="font-semibold text-sm">Location</span>
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

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Navigation size={16} className="text-green-600" />
          <span className="text-sm font-medium">
            {widgetData.location || "Ahmedabad"}
          </span>
          {isMoving && (
            <Activity size={14} className="text-blue-500 animate-pulse" />
          )}
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <div className="font-mono">Lat: {lat.toFixed(6)}° N</div>
          <div className="font-mono">Long: {lng.toFixed(6)}° E</div>
        </div>

        <div className="mt-3 pt-3 border-t space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">GPS Status:</span>
            <span className="text-green-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Active
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Accuracy:</span>
            <span className="font-medium">±{accuracy.toFixed(1)}m</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Movement:</span>
            <span className="font-medium">
              {isMoving ? "Moving" : "Stationary"}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-2">
          Device: {id.slice(0, 8)}
        </div>
      </div>
    </Card>
  );
}
