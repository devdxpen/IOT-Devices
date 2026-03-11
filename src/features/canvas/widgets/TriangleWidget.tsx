"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";

interface TriangleData extends Record<string, unknown> {
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
  width?: number;
  height?: number;
  label?: string;
}

export const TriangleWidget = memo(function TriangleWidget({
  data,
}: NodeProps) {
  const d = data as TriangleData;
  const fillColor = d.fillColor || "#ffffff";
  const borderColor = d.borderColor || "#9ca3af";
  const borderWidth = d.borderWidth ?? 2;
  const opacity = (d.opacity ?? 100) / 100;
  const width = d.width || 140;
  const height = d.height || 120;

  const points = `${width / 2},${borderWidth} ${width - borderWidth},${height - borderWidth} ${borderWidth},${height - borderWidth}`;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width, height, opacity }}
    >
      <svg width={width} height={height} className="overflow-visible">
        <polygon
          points={points}
          fill={fillColor}
          stroke={borderColor}
          strokeWidth={borderWidth}
          strokeLinejoin="round"
        />
      </svg>
      {d.label && (
        <span
          className="absolute text-xs text-gray-600 font-medium select-none"
          style={{ top: "60%", transform: "translateY(-50%)" }}
        >
          {d.label}
        </span>
      )}
    </div>
  );
});
