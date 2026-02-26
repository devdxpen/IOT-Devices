"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";

export const PipeWidget = memo(function PipeWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  const flow = (d.value as number) || 65;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-[220px]">
      <span className="text-[10px] text-gray-400 font-medium block mb-2">
        {(d.label as string) || "Pipe"}
      </span>
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all"
          style={{ width: `${flow}%` }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.2)_10px,rgba(255,255,255,0.2)_20px)] animate-[flowAnim_1s_linear_infinite]" />
        </div>
      </div>
      <div className="flex justify-between mt-1.5 text-[9px] text-gray-400">
        <span>Flow: {flow}%</span>
        <span>Pressure: 2.4 bar</span>
      </div>
    </div>
  );
});
