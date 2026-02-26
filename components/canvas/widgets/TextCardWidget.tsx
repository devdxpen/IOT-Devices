"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { FileText, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TextCardWidget({ data, id }: NodeProps) {
  const title = "Welcome Card";
  const description =
    "This is a customizable text card widget. You can use it to display important information, notes, or descriptions on your canvas.";

  return (
    <Card className="w-64 p-4 shadow-lg border-2 border-amber-500 bg-white">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="text-amber-600" size={20} />
          <span className="font-semibold text-sm">Text Card</span>
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

      <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
        <h3 className="text-lg font-bold text-amber-900 mb-2">{title}</h3>
        <p className="text-sm text-amber-800 leading-relaxed">{description}</p>
      </div>

      <div className="mt-3 pt-3 border-t">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Characters:</span>
          <span className="font-medium text-amber-600">
            {description.length}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">ID: {id.slice(0, 8)}</div>
      </div>
    </Card>
  );
}
