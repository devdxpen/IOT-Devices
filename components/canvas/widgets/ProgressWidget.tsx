"use client";

import React, { useState, useEffect } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Loader2, Trash2, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProgressWidget({ data, id }: NodeProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Simulate progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          return 0;
        }
        setIsComplete(false);
        return prev + Math.random() * 5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const displayProgress = Math.min(100, Math.floor(progress));

  return (
    <Card className="w-56 p-4 shadow-lg border-2 border-violet-500 bg-white">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="text-green-500" size={20} />
          ) : (
            <Loader2 className="text-violet-600 animate-spin" size={20} />
          )}
          <span className="font-semibold text-sm">Progress Bar</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Copy size={12} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Loading...</span>
          <span
            className={`text-lg font-bold ${isComplete ? "text-green-600" : "text-violet-600"}`}
          >
            {displayProgress}%
          </span>
        </div>

        {/* Progress bar container */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isComplete
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : "bg-gradient-to-r from-violet-400 to-violet-600"
            }`}
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Animated stripes for loading effect */}
        {!isComplete && displayProgress > 0 && (
          <div className="h-1 mt-2 bg-violet-100 rounded overflow-hidden">
            <div className="h-full w-1/3 bg-violet-400 animate-pulse rounded" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Status:</span>
          <span
            className={`font-medium ${isComplete ? "text-green-600" : "text-violet-600"}`}
          >
            {isComplete ? "Complete" : "In Progress"}
          </span>
        </div>
        <div className="text-xs text-gray-400">ID: {id.slice(0, 8)}</div>
      </div>
    </Card>
  );
}
