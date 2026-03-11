"use client";

import React from "react";
import { NodeProps, Node } from "@xyflow/react";
import { Card } from "@/components/ui/card";

type WidgetData = {
  label?: string;
  value?: number;
  location?: string;
  status?: "active" | "warning" | "normal";
  onDelete?: (id: string) => void;
  onDuplicate?: (node: Node) => void;
};

export function CustomNode({ data, type }: NodeProps) {
  const widgetData = data as WidgetData;
  return (
    <Card className="p-4 shadow-md border-2 border-gray-300">
      <div className="text-sm font-medium">{widgetData.label || type}</div>
    </Card>
  );
}
