"use client";
import React, { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { ToggleLeft, ToggleRight } from "lucide-react";

export const BitSwitchWidget = memo(function BitSwitchWidget({
  data,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  const [isOn, setIsOn] = useState(false);
  return (
    <div
      className={`rounded-xl shadow-lg border-2 p-4 w-[160px] text-center transition-all ${isOn ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"}`}
    >
      <span className="text-[10px] text-gray-500 font-medium">
        {(d.label as string) || "Bit Switch"}
      </span>
      <button
        onClick={() => setIsOn(!isOn)}
        className="block mx-auto mt-2 mb-1"
      >
        {isOn ? (
          <ToggleRight size={40} className="text-blue-500" />
        ) : (
          <ToggleLeft size={40} className="text-gray-400" />
        )}
      </button>
      <span
        className={`text-xs font-bold ${isOn ? "text-blue-600" : "text-gray-400"}`}
      >
        {isOn ? "ON (1)" : "OFF (0)"}
      </span>
    </div>
  );
});
