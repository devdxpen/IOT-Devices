"use client";
import React, { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";

export const LampWidget = memo(function LampWidget({ data, type }: NodeProps) {
  const d = data as Record<string, unknown>;
  const [isOn, setIsOn] = useState((d.value as boolean) ?? true);
  const isBit = type === "bit-lamp";
  const label = (d.label as string) || (isBit ? "Bit Lamp" : "Word Lamp");

  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-[150px] text-center"
      onClick={() => setIsOn(!isOn)}
    >
      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
      <div
        className={`w-12 h-12 rounded-full mx-auto mt-2 mb-2 transition-all duration-300 ${isOn ? "bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]" : "bg-gray-300"}`}
      />
      <span
        className={`text-xs font-bold ${isOn ? "text-green-600" : "text-gray-400"}`}
      >
        {isBit ? (isOn ? "1" : "0") : isOn ? "ON" : "OFF"}
      </span>
    </div>
  );
});
