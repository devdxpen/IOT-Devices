"use client";
import React, { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { Zap } from "lucide-react";

const funcs = [
  { label: "Start", color: "bg-green-500" },
  { label: "Stop", color: "bg-red-500" },
  { label: "Reset", color: "bg-amber-500" },
];

export const FunctionSwitchWidget = memo(function FunctionSwitchWidget({
  data,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-[180px]">
      <div className="flex items-center gap-1.5 mb-2">
        <Zap size={12} className="text-emerald-500" />
        <span className="text-[10px] text-gray-500 font-medium">
          {(d.label as string) || "Function Switch"}
        </span>
      </div>
      <div className="flex gap-1.5">
        {funcs.map((f, i) => (
          <button
            key={f.label}
            onClick={() => setActive(active === i ? null : i)}
            className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all text-white ${active === i ? f.color + " shadow-md scale-105" : "bg-gray-300 hover:bg-gray-400"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
});
