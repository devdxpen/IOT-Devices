"use client";
import React, { memo, useState, useEffect } from "react";
import { NodeProps } from "@xyflow/react";
import { Clock } from "lucide-react";

export const TimeWidget = memo(function TimeWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg border border-slate-700 p-4 w-[180px] text-center">
      <div className="flex items-center justify-center gap-1.5 mb-2">
        <Clock size={12} className="text-cyan-400" />
        <span className="text-[10px] text-slate-400 font-medium">
          {(d.label as string) || "Clock"}
        </span>
      </div>
      <div className="text-2xl font-bold text-white font-mono tracking-wider">
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </div>
      <div className="text-[10px] text-slate-500 mt-1">
        {time.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
  );
});
