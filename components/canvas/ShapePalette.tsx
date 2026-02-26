"use client";

import React, { useState } from "react";
import {
  Square,
  Circle,
  Minus,
  Triangle,
  Type,
  Image,
  Table,
  Thermometer,
  MapPin,
  Bell,
  ToggleLeft,
  CircleDot,
  SlidersHorizontal,
  Gauge,
  MousePointer2,
  FileText,
  Loader2,
  TrendingUp,
  Zap,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ShapePaletteProps {
  onDragStart: (type: string) => void;
  onNodeAdd: (type: string) => void;
}

export function ShapePalette({ onDragStart, onNodeAdd }: ShapePaletteProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const basicShapes = [
    { id: "line", icon: Minus, label: "Line" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "picture", icon: Image, label: "Picture" },
    { id: "table", icon: Table, label: "Table" },
  ];

  const controlWidgets = [
    {
      id: "switch",
      icon: ToggleLeft,
      label: "Toggle Switch",
      color: "text-purple-600",
    },
    {
      id: "radio",
      icon: CircleDot,
      label: "Radio Buttons",
      color: "text-indigo-600",
    },
    {
      id: "slider",
      icon: SlidersHorizontal,
      label: "Slider",
      color: "text-cyan-600",
    },
    {
      id: "button",
      icon: MousePointer2,
      label: "Button",
      color: "text-pink-600",
    },
  ];

  const displayWidgets = [
    {
      id: "gauge",
      icon: Gauge,
      label: "Gauge Meter",
      color: "text-emerald-600",
    },
    {
      id: "progress",
      icon: Loader2,
      label: "Progress Bar",
      color: "text-violet-600",
    },
    {
      id: "textcard",
      icon: FileText,
      label: "Text Card",
      color: "text-amber-600",
    },
    {
      id: "image",
      icon: Image,
      label: "Image Display",
      color: "text-teal-600",
    },
  ];

  const chartsWidgets = [
    {
      id: "chart",
      icon: TrendingUp,
      label: "Line Chart",
      color: "text-green-600",
    },
    {
      id: "climate",
      icon: Thermometer,
      label: "Climate Control",
      color: "text-purple-600",
    },
    {
      id: "voltage",
      icon: Zap,
      label: "Voltage/Motor",
      color: "text-blue-600",
    },
    {
      id: "alerts",
      icon: AlertTriangle,
      label: "Alerts Panel",
      color: "text-orange-600",
    },
    {
      id: "health",
      icon: Activity,
      label: "Health Status",
      color: "text-cyan-600",
    },
  ];

  const iotWidgets = [
    {
      id: "temperature",
      icon: Thermometer,
      label: "Temperature",
      color: "text-red-600",
    },
    {
      id: "location",
      icon: MapPin,
      label: "Location",
      color: "text-green-600",
    },
    { id: "alarm", icon: Bell, label: "Alarm Alert", color: "text-orange-600" },
  ];

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    onDragStart(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const renderWidgetGrid = (
    widgets: typeof controlWidgets,
    borderColor: string,
    hoverBg: string,
  ) => (
    <div className="grid grid-cols-4 gap-3 max-w-lg">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          draggable
          onDragStart={(e) => handleDragStart(e, widget.id)}
          onClick={() => onNodeAdd(widget.id)}
          className={`flex flex-col items-center justify-center p-3 border-2 border-gray-200 rounded-lg cursor-move hover:${borderColor} hover:${hoverBg} transition-all hover:scale-105 hover:shadow-md bg-white`}
        >
          <widget.icon size={28} className={`mb-2 ${widget.color || ""}`} />
          <span className="text-xs font-medium text-center leading-tight">
            {widget.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-4">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs"
          >
            Basic
          </TabsTrigger>
          <TabsTrigger
            value="controls"
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-xs"
          >
            Controls
          </TabsTrigger>
          <TabsTrigger
            value="charts"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-xs"
          >
            Charts
          </TabsTrigger>
          <TabsTrigger
            value="display"
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-xs"
          >
            Display
          </TabsTrigger>
          <TabsTrigger
            value="iot"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs"
          >
            IoT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-2">
          <div className="grid grid-cols-4 gap-3 max-w-lg">
            {basicShapes.map((shape) => (
              <div
                key={shape.id}
                draggable
                onDragStart={(e) => handleDragStart(e, shape.id)}
                onClick={() => onNodeAdd(shape.id)}
                className="flex flex-col items-center justify-center p-3 border-2 border-gray-200 rounded-lg cursor-move hover:border-orange-500 hover:bg-orange-50 transition-all hover:scale-105 hover:shadow-md bg-white"
              >
                <shape.icon size={28} className="mb-2 text-gray-700" />
                <span className="text-xs font-medium text-center">
                  {shape.label}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="controls" className="mt-2">
          {renderWidgetGrid(
            controlWidgets,
            "border-purple-500",
            "bg-purple-50",
          )}
        </TabsContent>

        <TabsContent value="charts" className="mt-2">
          {renderWidgetGrid(chartsWidgets, "border-green-500", "bg-green-50")}
        </TabsContent>

        <TabsContent value="display" className="mt-2">
          {renderWidgetGrid(
            displayWidgets,
            "border-emerald-500",
            "bg-emerald-50",
          )}
        </TabsContent>

        <TabsContent value="iot" className="mt-2">
          {renderWidgetGrid(iotWidgets, "border-blue-500", "bg-blue-50")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
