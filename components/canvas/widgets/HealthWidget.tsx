"use client";

import React, { useState, useEffect, useRef } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Activity, MoreHorizontal } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import gsap from "gsap";

export function HealthWidget({ id }: NodeProps) {
  const [percentage, setPercentage] = useState(72);
  const cardRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barsRef = useRef<(SVGRectElement | null)[]>([]);

  // Animate on mount
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
      );
    }

    // Animate bars sequentially
    barsRef.current.forEach((bar, i) => {
      if (bar) {
        gsap.fromTo(
          bar,
          { scaleY: 0, transformOrigin: "bottom" },
          {
            scaleY: 1,
            duration: 0.3,
            delay: i * 0.05,
            ease: "power2.out",
          },
        );
      }
    });
  }, []);

  // Simulate percentage changes
  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage((prev) => {
        const newVal = prev + (Math.random() - 0.5) * 6;
        return Math.round(Math.max(50, Math.min(100, newVal)));
      });

      // Animate percentage change
      if (percentRef.current) {
        gsap.fromTo(
          percentRef.current,
          { scale: 1.1, color: "#22c55e" },
          { scale: 1, color: "#3b82f6", duration: 0.3, ease: "power2.out" },
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Generate bars for the semi-circle
  const totalBars = 12;
  const activeBars = Math.round((percentage / 100) * totalBars);

  const getBarColor = (index: number, isActive: boolean) => {
    if (!isActive) return "#e5e7eb";
    // Gradient from light blue to dark blue
    const intensity = (index + 1) / totalBars;
    return `hsl(210, 90%, ${70 - intensity * 30}%)`;
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          ref={cardRef}
          className="w-56 p-4 shadow-lg border border-gray-100 bg-white"
        >

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-green-600" />
              <span className="font-semibold text-gray-900 text-sm">
                Healthy Environment
              </span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Semi-circular progress */}
          <div className="flex justify-center py-4">
            <svg width="160" height="100" viewBox="0 0 160 100">
              {/* Generate bars in a semi-circle */}
              {Array.from({ length: totalBars }).map((_, i) => {
                const angle = (Math.PI * (i + 1)) / (totalBars + 1);
                const x = 80 - Math.cos(angle) * 55;
                const y = 90 - Math.sin(angle) * 55;
                const rotation = ((i + 1) / (totalBars + 1)) * 180 - 90;
                const isActive = i < activeBars;

                return (
                  <rect
                    key={i}
                    ref={(el) => {
                      barsRef.current[i] = el;
                    }}
                    x={x - 4}
                    y={y - 18}
                    width="8"
                    height="18"
                    rx="4"
                    fill={getBarColor(i, isActive)}
                    transform={`rotate(${rotation} ${x} ${y})`}
                  />
                );
              })}
            </svg>
          </div>

          {/* Percentage display */}
          <div className="text-center -mt-2">
            <span ref={percentRef} className="text-3xl font-bold text-blue-600">
              {percentage}%
            </span>
            <p className="text-xs text-green-600 font-medium mt-1">On track</p>
          </div>

          <div className="text-xs text-gray-400 mt-3 text-center">
            ID: {id.slice(0, 8)}
          </div>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>View Details</ContextMenuItem>
        <ContextMenuItem>Set Target</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuItem className="text-red-600">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
