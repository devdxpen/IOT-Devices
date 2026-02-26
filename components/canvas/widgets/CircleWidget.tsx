"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";

interface CircleData extends Record<string, unknown> {
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
  width?: number;
  label?: string;
}

export const CircleWidget = memo(function CircleWidget({ data }: NodeProps) {
  const d = data as CircleData;
  const fillColor = d.fillColor || "#ffffff";
  const borderColor = d.borderColor || "#9ca3af";
  const borderWidth = d.borderWidth ?? 2;
  const opacity = (d.opacity ?? 100) / 100;
  const size = d.width || 120;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full rounded-full shadow-sm flex items-center justify-center"
        style={{
          backgroundColor: fillColor,
          border: `${borderWidth}px solid ${borderColor}`,
          opacity,
        }}
      >
        {d.label && (
          <span className="text-xs text-gray-600 font-medium select-none">
            {d.label}
          </span>
        )}
      </div>
    </div>
  );
});
