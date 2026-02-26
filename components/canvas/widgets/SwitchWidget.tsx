"use client";

import React, { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Power, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SwitchWidget({ data, id }: NodeProps) {
  const [isOn, setIsOn] = useState(false);

  return (
    <Card className="w-48 p-4 shadow-lg border-2 border-purple-500 bg-white">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Power
            className={isOn ? "text-green-500" : "text-gray-400"}
            size={20}
          />
          <span className="font-semibold text-sm">Toggle Switch</span>
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

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium">{isOn ? "ON" : "OFF"}</span>
        <Switch checked={isOn} onCheckedChange={setIsOn} />
      </div>

      <div className="mt-3 pt-3 border-t">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Status:</span>
          <span
            className={`font-medium ${isOn ? "text-green-600" : "text-gray-500"}`}
          >
            {isOn ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">ID: {id.slice(0, 8)}</div>
      </div>
    </Card>
  );
}
