"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";

export const BarrageWidget = memo(function BarrageWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  const text =
    (d.content as string) ||
    "⚠ System Alert: Temperature threshold exceeded in Zone B — check sensor readings";
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg border border-amber-400 p-3 w-[280px] overflow-hidden">
      <span className="text-[10px] text-white/80 font-medium block mb-1">
        {(d.label as string) || "Barrage"}
      </span>
      <div className="overflow-hidden">
        <div className="whitespace-nowrap animate-[marquee_10s_linear_infinite] text-xs font-bold text-white">
          {text} &nbsp;&nbsp;&nbsp; {text}
        </div>
      </div>
    </div>
  );
});
