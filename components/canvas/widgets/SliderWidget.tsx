"use client";

import React, { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SliderWidget({ data, id }: NodeProps) {
  const [value, setValue] = useState([50]);

  return (
    <Card className="w-56 p-4 shadow-lg border-2 border-cyan-500 bg-white">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-cyan-600" size={20} />
          <span className="font-semibold text-sm">Range Slider</span>
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

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <div className="text-center">
          <span className="text-3xl font-bold text-cyan-600">{value[0]}</span>
          <span className="text-lg text-gray-500">%</span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Current Value:</span>
          <span className="font-medium text-cyan-600">{value[0]}%</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">ID: {id.slice(0, 8)}</div>
      </div>
    </Card>
  );
}
