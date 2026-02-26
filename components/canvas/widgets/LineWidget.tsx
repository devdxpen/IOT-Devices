"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";

export const LineWidget = memo(function LineWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  const strokeColor = (d.strokeColor as string) || "#374151";
  const strokeWidth = (d.strokeWidth as number) || 2;
  const dashStyle = (d.dashStyle as string) || "solid";
  const width = (d.width as number) || 200;
  const height = Math.max((d.height as number) || 4, strokeWidth + 8);
  const opacity = ((d.opacity as number) ?? 100) / 100;

  const dashArray =
    dashStyle === "dashed"
      ? `${strokeWidth * 4} ${strokeWidth * 3}`
      : dashStyle === "dotted"
        ? `${strokeWidth} ${strokeWidth * 2}`
        : "none";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width, height, opacity }}
    >
      <svg width={width} height={height} className="overflow-visible">
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
});
