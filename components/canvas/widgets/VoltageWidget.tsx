"use client";

import React, { useState, useEffect, useRef } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Zap, Activity, MoreHorizontal } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import gsap from "gsap";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Generate wave data for motor display
const generateWaveData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      x: i,
      value: Math.sin(i * 0.3) * 30 + 50,
    });
  }
  return data;
};

export function VoltageWidget({ id }: NodeProps) {
  const [voltage, setVoltage] = useState(375);
  const [motorRpm, setMotorRpm] = useState(7200);
  const [waveData, setWaveData] = useState(generateWaveData);
  const cardRef = useRef<HTMLDivElement>(null);
  const voltageRef = useRef<HTMLSpanElement>(null);
  const rpmRef = useRef<HTMLSpanElement>(null);

  // Animate on mount
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
      );
    }
  }, []);

  // Live data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Update voltage
      setVoltage((prev) => {
        const newValue = prev + (Math.random() - 0.5) * 10;
        return Math.round(Math.max(350, Math.min(400, newValue)));
      });

      // Update motor RPM
      setMotorRpm((prev) => {
        const newValue = prev + (Math.random() - 0.5) * 200;
        return Math.round(Math.max(6800, Math.min(7600, newValue)));
      });

      // Update wave data
      setWaveData(generateWaveData());

      // Animate values
      if (voltageRef.current) {
        gsap.fromTo(
          voltageRef.current,
          { color: "#3b82f6" },
          { color: "#1f2937", duration: 0.3 },
        );
      }
      if (rpmRef.current) {
        gsap.fromTo(
          rpmRef.current,
          { color: "#3b82f6" },
          { color: "#1f2937", duration: 0.3 },
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          ref={cardRef}
          className="w-64 shadow-lg border border-gray-100 bg-white overflow-hidden"
        >

          <div className="flex">
            {/* Voltage Section */}
            <div className="flex-1 p-4 border-r border-gray-100">
              <div className="text-center">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Voltage
                </span>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Zap size={20} className="text-blue-500" />
                </div>
                <div className="mt-3">
                  <span
                    ref={voltageRef}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {voltage}
                  </span>
                </div>
                <span className="text-xs text-gray-500">Volts</span>
              </div>
            </div>

            {/* Motor Section */}
            <div className="flex-1 p-4">
              <div className="text-center">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Motor
                </span>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Activity size={20} className="text-blue-500" />
                </div>
                <div className="mt-1">
                  <span className="text-[10px] text-gray-400">Rpm</span>
                </div>
                <div>
                  <span
                    ref={rpmRef}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {motorRpm}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Wave Chart */}
          <div className="h-12 bg-gray-50 border-t border-gray-100">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waveData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-gray-400 p-2 text-center">
            ID: {id.slice(0, 8)}
          </div>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>View Details</ContextMenuItem>
        <ContextMenuItem>Set Thresholds</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuItem className="text-red-600">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
