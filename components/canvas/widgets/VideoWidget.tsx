"use client";
import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { Video, Play } from "lucide-react";

export const VideoWidget = memo(function VideoWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 w-[280px] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
        <Video size={12} className="text-red-500" />
        <span className="text-[10px] text-gray-400 font-medium">
          {(d.label as string) || "Video Feed"}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] text-red-400">LIVE</span>
        </div>
      </div>
      <div className="h-[160px] bg-gray-800 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        <button className="relative w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors">
          <Play size={20} className="text-white ml-1" fill="white" />
        </button>
        <div className="absolute bottom-2 left-2 text-[9px] text-gray-500 font-mono">
          CAM-001
        </div>
        <div className="absolute bottom-2 right-2 text-[9px] text-gray-500 font-mono">
          1920×1080
        </div>
      </div>
    </div>
  );
});
