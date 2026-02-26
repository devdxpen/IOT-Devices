"use client";

import React, { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CircleDot, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export function RadioWidget({ data, id }: NodeProps) {
  const [selected, setSelected] = useState("option1");

  return (
    <Card className="w-52 p-4 shadow-lg border-2 border-indigo-500 bg-white">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CircleDot className="text-indigo-600" size={20} />
          <span className="font-semibold text-sm">Radio Selection</span>
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

      <div className="p-3 bg-gray-50 rounded-lg">
        <RadioGroup value={selected} onValueChange={setSelected}>
          {defaultOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${id}-${option.value}`}
              />
              <label
                htmlFor={`${id}-${option.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="mt-3 pt-3 border-t">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Selected:</span>
          <span className="font-medium text-indigo-600">
            {defaultOptions.find((o) => o.value === selected)?.label}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">ID: {id.slice(0, 8)}</div>
      </div>
    </Card>
  );
}
