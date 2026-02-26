"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
export const QRCodeWidget = memo(function QRCodeWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  // Simple SVG-based QR pattern (dummy)
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-[160px] text-center">
      <span className="text-[10px] text-gray-400 font-medium block mb-2">
        {(d.label as string) || "QR Code"}
      </span>
      <div className="w-24 h-24 mx-auto bg-white border-2 border-gray-200 rounded-lg p-2 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Dummy QR pattern */}
          <rect x="0" y="0" width="30" height="30" fill="#1f2937" />
          <rect x="5" y="5" width="20" height="20" fill="white" />
          <rect x="8" y="8" width="14" height="14" fill="#1f2937" />
          <rect x="70" y="0" width="30" height="30" fill="#1f2937" />
          <rect x="75" y="5" width="20" height="20" fill="white" />
          <rect x="78" y="8" width="14" height="14" fill="#1f2937" />
          <rect x="0" y="70" width="30" height="30" fill="#1f2937" />
          <rect x="5" y="75" width="20" height="20" fill="white" />
          <rect x="8" y="78" width="14" height="14" fill="#1f2937" />
          <rect x="35" y="0" width="8" height="8" fill="#1f2937" />
          <rect x="50" y="10" width="8" height="8" fill="#1f2937" />
          <rect x="35" y="20" width="8" height="8" fill="#1f2937" />
          <rect x="40" y="40" width="20" height="20" fill="#1f2937" />
          <rect x="45" y="45" width="10" height="10" fill="white" />
          <rect x="70" y="40" width="8" height="8" fill="#1f2937" />
          <rect x="80" y="50" width="8" height="8" fill="#1f2937" />
          <rect x="70" y="60" width="8" height="8" fill="#1f2937" />
          <rect x="35" y="70" width="8" height="8" fill="#1f2937" />
          <rect x="50" y="80" width="8" height="8" fill="#1f2937" />
          <rect x="70" y="80" width="8" height="8" fill="#1f2937" />
          <rect x="85" y="85" width="8" height="8" fill="#1f2937" />
        </svg>
      </div>
      <span className="text-[9px] text-gray-400 mt-2 block">
        Scan to connect
      </span>
    </div>
  );
});
