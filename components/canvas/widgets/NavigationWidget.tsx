"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import {
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export const NavigationWidget = memo(function NavigationWidget({
  data,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-[150px] text-center">
      <div className="flex items-center justify-center gap-1 mb-2">
        <Compass size={12} className="text-orange-500" />
        <span className="text-[10px] text-gray-500 font-medium">
          {(d.label as string) || "Navigation"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
        <div />
        <button className="w-8 h-8 rounded-md bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition-colors">
          <ArrowUp size={12} className="text-gray-600" />
        </button>
        <div />
        <button className="w-8 h-8 rounded-md bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition-colors">
          <ArrowLeft size={12} className="text-gray-600" />
        </button>
        <button className="w-8 h-8 rounded-md bg-orange-500 text-white flex items-center justify-center text-[8px] font-bold">
          OK
        </button>
        <button className="w-8 h-8 rounded-md bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition-colors">
          <ArrowRight size={12} className="text-gray-600" />
        </button>
        <div />
        <button className="w-8 h-8 rounded-md bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition-colors">
          <ArrowDown size={12} className="text-gray-600" />
        </button>
        <div />
      </div>
    </div>
  );
});
