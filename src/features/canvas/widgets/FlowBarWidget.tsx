"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { ArrowRight } from "lucide-react";

export const FlowBarWidget = memo(function FlowBarWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  const steps = [
    { label: "Input", active: true },
    { label: "Process", active: true },
    { label: "Filter", active: true },
    { label: "Output", active: false },
  ];
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-[260px]">
      <span className="text-[10px] text-gray-400 font-medium block mb-2">
        {(d.label as string) || "Flow Bar"}
      </span>
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <div
              className={`flex-1 py-1.5 text-center text-[9px] font-semibold rounded-md ${s.active ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"}`}
            >
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <ArrowRight size={10} className="text-gray-300 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});
