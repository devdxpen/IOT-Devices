"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";

export const BoxWidget = memo(function BoxWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300 p-6 w-[200px] h-[120px] flex items-center justify-center">
      <span className="text-sm text-gray-500 font-medium">
        {(d.label as string) || "Box"}
      </span>
    </div>
  );
});
