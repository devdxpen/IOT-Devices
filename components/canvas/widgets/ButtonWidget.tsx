"use client";

import React, { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MousePointer2, Trash2, Copy, Zap } from "lucide-react";

export function ButtonWidget({ data, id }: NodeProps) {
  const [clickCount, setClickCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <Card className="w-48 p-4 shadow-lg border-2 border-pink-500 bg-white">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MousePointer2 className="text-pink-600" size={20} />
          <span className="font-semibold text-sm">Action Button</span>
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

      <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
        <Button
          onClick={handleClick}
          className={`w-full h-12 text-lg font-semibold transition-all ${
            isPressed ? "bg-pink-700 scale-95" : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          <Zap className="mr-2" size={20} />
          Click Me
        </Button>
        <div className="mt-2 text-xs text-gray-500">
          Clicked {clickCount} {clickCount === 1 ? "time" : "times"}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Total Clicks:</span>
          <span className="font-medium text-pink-600">{clickCount}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">ID: {id.slice(0, 8)}</div>
      </div>
    </Card>
  );
}
