"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";

interface RectangleData extends Record<string, unknown> {
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
  borderRadius?: number;
  width?: number;
  height?: number;
  label?: string;
}

export const RectangleWidget = memo(function RectangleWidget({
  data,
}: NodeProps) {
  const d = data as RectangleData;
  const fillColor = d.fillColor || "#ffffff";
  const borderColor = d.borderColor || "#9ca3af";
  const borderWidth = d.borderWidth ?? 2;
  const opacity = (d.opacity ?? 100) / 100;
  const borderRadius = d.borderRadius ?? 4;
  const width = d.width || 160;
  const height = d.height || 100;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width, height }}
    >
      <div
        className="w-full h-full shadow-sm flex items-center justify-center"
        style={{
          backgroundColor: fillColor,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: `${borderRadius}px`,
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
