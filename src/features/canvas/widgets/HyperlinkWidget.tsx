"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { ExternalLink } from "lucide-react";

export const HyperlinkWidget = memo(function HyperlinkWidget({
  data,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  const url = (d.url as string) || "https://example.com";
  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-3 w-[200px]">
      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
        <ExternalLink size={16} className="text-blue-500 shrink-0" />
        <div className="overflow-hidden">
          <span className="text-xs font-semibold text-blue-700 block">
            {(d.label as string) || "Hyperlink"}
          </span>
          <span className="text-[9px] text-blue-400 truncate block font-mono">
            {url}
          </span>
        </div>
      </div>
    </div>
  );
});
