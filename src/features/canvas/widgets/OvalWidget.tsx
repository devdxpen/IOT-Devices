"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";

interface OvalData extends Record<string, unknown> {
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
  width?: number;
  height?: number;
  label?: string;
}

export const OvalWidget = memo(function OvalWidget({ data }: NodeProps) {
  const d = data as OvalData;
  const fillColor = d.fillColor || "#ffffff";
  const borderColor = d.borderColor || "#9ca3af";
  const borderWidth = d.borderWidth ?? 2;
  const opacity = (d.opacity ?? 100) / 100;
  const width = d.width || 160;
  const height = d.height || 100;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width, height }}
    >
      <div
        className="w-full h-full rounded-[50%] shadow-sm flex items-center justify-center"
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
