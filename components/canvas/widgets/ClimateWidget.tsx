"use client";

import React, { useState, useEffect, useRef } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Thermometer, MoreHorizontal } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import gsap from "gsap";

export function ClimateWidget({ id }: NodeProps) {
  const [temperature, setTemperature] = useState(22);
  const [isOn, setIsOn] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const tempRef = useRef<HTMLSpanElement>(null);
  const gaugeRef = useRef<SVGPathElement>(null);

  // Animate on mount
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
      );
    }
  }, []);

  // Animate temperature changes
  useEffect(() => {
    if (tempRef.current) {
      gsap.fromTo(
        tempRef.current,
        { scale: 1.1 },
        { scale: 1, duration: 0.3, ease: "power2.out" },
      );
    }
    if (gaugeRef.current) {
      gsap.to(gaugeRef.current, {
        strokeDasharray: `${((temperature - 10) / 30) * 180} 360`,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [temperature]);

  // Simulate temperature changes
  useEffect(() => {
    if (!isOn) return;

    const interval = setInterval(() => {
      setTemperature((prev) => {
        const change = (Math.random() - 0.5) * 2;
        return Math.max(
          10,
          Math.min(40, Math.round((prev + change) * 10) / 10),
        );
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isOn]);

  // SVG arc calculation
  const arcRadius = 60;
  const arcLength = (temperature - 10) / 30; // 10-40 range

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          ref={cardRef}
          className="w-56 p-5 shadow-lg border border-gray-100 bg-white"
        >

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Thermometer size={16} className="text-purple-600" />
                <span className="font-semibold text-gray-900">
                  Climate control
                </span>
              </div>
              <span className="text-xs text-gray-500">Hall</span>
            </div>
            <Switch checked={isOn} onCheckedChange={setIsOn} />
          </div>

          {/* Temperature Gauge */}
          <div className="flex justify-center items-center py-4">
            <div className="relative">
              <svg width="140" height="100" viewBox="0 0 140 100">
                {/* Background arc */}
                <path
                  d="M 20 90 A 60 60 0 0 1 120 90"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Value arc */}
                <path
                  ref={gaugeRef}
                  d="M 20 90 A 60 60 0 0 1 120 90"
                  fill="none"
                  stroke="url(#climateGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${arcLength * 180} 360`}
                />
                <defs>
                  <linearGradient
                    id="climateGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                {/* Temperature markers */}
                <text x="15" y="95" className="text-[10px]" fill="#9ca3af">
                  10°
                </text>
                <text x="65" y="30" className="text-[10px]" fill="#9ca3af">
                  30°
                </text>
                <text x="115" y="95" className="text-[10px]" fill="#9ca3af">
                  40°
                </text>
              </svg>

              {/* Temperature display */}
              <div className="absolute inset-0 flex items-center justify-center pt-4">
                <span
                  ref={tempRef}
                  className="text-4xl font-bold text-gray-900"
                >
                  {Math.round(temperature)}°C
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            3 Air conditioners
          </div>

          <div className="text-xs text-gray-400 mt-2 text-center">
            ID: {id.slice(0, 8)}
          </div>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>Settings</ContextMenuItem>
        <ContextMenuItem>Set Target Temperature</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuItem className="text-red-600">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
