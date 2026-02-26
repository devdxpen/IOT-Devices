"use client";
import React, { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";

const options = ["AUTO", "MANUAL", "OFF", "STANDBY"];

export const WordSwitchWidget = memo(function WordSwitchWidget({
  data,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  const [selected, setSelected] = useState(0);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-[170px]">
      <span className="text-[10px] text-gray-400 font-medium block mb-2">
        {(d.label as string) || "Word Switch"}
      </span>
      <div className="space-y-1">
        {options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => setSelected(i)}
            className={`w-full py-1.5 text-[10px] font-semibold rounded-md transition-all ${selected === i ? "bg-purple-500 text-white shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
});
