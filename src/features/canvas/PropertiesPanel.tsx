"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Node } from "@xyflow/react";
import {
  AlignCenter,
  AlignEndVertical,
  AlignHorizontalSpaceAround,
  AlignLeft,
  AlignRight,
  AlignStartVertical,
  AlignVerticalJustifyCenter,
  AlignVerticalSpaceAround,
  Layers,
  Minus,
  MousePointer2,
  Move,
  Network,
  Paintbrush,
  Plus,
  Settings,
  SlidersHorizontal,
  Table2,
  Tag,
} from "lucide-react";
import { useState } from "react";

interface PropertiesPanelProps {
  selectedNode: Node | null;
  selectedNodes: string[];
  nodes: Node[];
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
  onAlign: (
    type: "left" | "center" | "right" | "top" | "middle" | "bottom",
  ) => void;
  onDistribute: (type: "horizontal" | "vertical") => void;
}

const colorPresets = [
  { name: "Blue", value: "#3b82f6", bg: "bg-blue-500" },
  { name: "Green", value: "#22c55e", bg: "bg-green-500" },
  { name: "Purple", value: "#8b5cf6", bg: "bg-purple-500" },
  { name: "Orange", value: "#f97316", bg: "bg-orange-500" },
  { name: "Red", value: "#ef4444", bg: "bg-red-500" },
  { name: "Cyan", value: "#06b6d4", bg: "bg-cyan-500" },
  { name: "Pink", value: "#ec4899", bg: "bg-pink-500" },
  { name: "Gray", value: "#64748b", bg: "bg-gray-500" },
];

// IoT device tag types for Replace Address tab
const iotTagTypes = [
  { value: "bool", label: "Boolean" },
  { value: "int16", label: "Int16" },
  { value: "int32", label: "Int32" },
  { value: "float", label: "Float" },
  { value: "double", label: "Double" },
  { value: "string", label: "String" },
];

export function PropertiesPanel({
  selectedNode,
  selectedNodes,
  nodes,
  onUpdateNode,
  onSelectNode,
  onAlign,
  onDistribute,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState("attribute");

  const nodeData = (selectedNode?.data as Record<string, unknown>) || {};
  const nodeType = selectedNode?.type || "unknown";

  const isMultiSelect = selectedNodes.length > 1;
  const hasSelection = selectedNodes.length > 0;

  const updateField = (field: string, value: unknown) => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { ...nodeData, [field]: value });
    }
  };

  const getWidgetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      temperature: "Temperature Sensor",
      location: "Location Tracker",
      alarm: "Alarm Alert",
      switch: "Toggle Switch",
      radio: "Radio Buttons",
      slider: "Slider Control",
      button: "Action Button",
      gauge: "Gauge Meter",
      progress: "Progress Bar",
      textcard: "Text Card",
      image: "Image Display",
      chart: "Line Chart",
      climate: "Climate Control",
      voltage: "Voltage Monitor",
      alerts: "Alerts Panel",
      health: "Health Status",
      rectangle: "Rectangle",
      circle: "Circle",
      line: "Line",
      triangle: "Triangle",
      text: "Text",
      picture: "Picture",
      table: "Table",
    };
    return labels[type] || type;
  };

  // Shape type helpers
  const isLineType = nodeType === "line";
  const isFilledShapeType = [
    "rectangle",
    "circle",
    "triangle",
    "oval",
  ].includes(nodeType);
  const isTableType = nodeType === "table";

  // Check if node type is an IoT widget (has device tags)
  const isIoTWidget = [
    "temperature",
    "location",
    "alarm",
    "switch",
    "radio",
    "slider",
    "button",
    "gauge",
    "progress",
    "climate",
    "voltage",
    "alerts",
    "health",
    "chart",
  ].includes(nodeType);

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-50 shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900 text-sm">Inspector</h3>
        </div>
      </div>

      {/* Top Level Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="px-3 pt-3 pb-3 bg-white border-b border-gray-100">
          <TabsList className="grid w-full grid-cols-3 h-9 bg-gray-100/80 p-0.5 rounded-lg">
            <TabsTrigger
              value="attribute"
              className="text-[11px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
            >
              <SlidersHorizontal size={12} className="mr-1" />
              Attribute
            </TabsTrigger>
            <TabsTrigger
              value="layer"
              className="text-[11px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
            >
              <Layers size={12} className="mr-1" />
              Layer
            </TabsTrigger>
            <TabsTrigger
              value="replace-address"
              className="text-[11px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
            >
              <Network size={12} className="mr-1" />
              Address
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <TabsContent value="attribute" className="p-0 m-0 h-full">
            {!hasSelection ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <MousePointer2 size={32} className="mb-2 opacity-20" />
                <p className="text-sm">Select an element</p>
              </div>
            ) : (
              <>
                {/* Selection Info Banner */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-transparent">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    {isMultiSelect
                      ? `${selectedNodes.length} Selected`
                      : getWidgetTypeLabel(nodeType)}
                  </span>
                  {!isMultiSelect && (
                    <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                      {selectedNode?.id.slice(0, 8)}
                    </span>
                  )}
                </div>

                {/* Multi-select alignment controls */}
                {isMultiSelect && (
                  <div className="px-4 py-3 border-b border-gray-100 space-y-3">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Alignment
                    </Label>
                    <div className="flex items-center justify-between bg-gray-50 p-1 rounded-md border border-gray-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("left")}
                        title="Align Left"
                      >
                        <AlignLeft size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("center")}
                        title="Align Center"
                      >
                        <AlignCenter size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("right")}
                        title="Align Right"
                      >
                        <AlignRight size={14} />
                      </Button>
                      <div className="w-px h-4 bg-gray-200 mx-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("top")}
                        title="Align Top"
                      >
                        <AlignStartVertical size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("middle")}
                        title="Align Middle"
                      >
                        <AlignVerticalJustifyCenter size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("bottom")}
                        title="Align Bottom"
                      >
                        <AlignEndVertical size={14} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs gap-2"
                        onClick={() => onDistribute("horizontal")}
                      >
                        <AlignHorizontalSpaceAround size={14} />
                        Distribute H
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs gap-2"
                        onClick={() => onDistribute("vertical")}
                      >
                        <AlignVerticalSpaceAround size={14} />
                        Distribute V
                      </Button>
                    </div>
                  </div>
                )}

                {/* Accordion Sections (Single Select) */}
                {!isMultiSelect && selectedNode && (
                  <Accordion
                    type="multiple"
                    defaultValue={[
                      "position",
                      "style",
                      "basic",
                      "line-props",
                      "shape-props",
                      "table-props",
                    ]}
                    className="w-full"
                  >
                    {/* ─── POSITION ACCORDION ─── */}
                    <AccordionItem
                      value="position"
                      className="border-b border-gray-100"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          <Move size={14} className="text-blue-500" />
                          Position
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-3">
                          {/* X, Y, W, H Grid */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                                X
                              </span>
                              <Input
                                type="number"
                                className="h-8 text-xs bg-gray-50 font-mono"
                                value={Math.round(selectedNode.position.x)}
                                readOnly
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                                Y
                              </span>
                              <Input
                                type="number"
                                className="h-8 text-xs bg-gray-50 font-mono"
                                value={Math.round(selectedNode.position.y)}
                                readOnly
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                                W
                              </span>
                              <Input
                                type="number"
                                className="h-8 text-xs bg-gray-50 font-mono"
                                value={
                                  selectedNode.measured?.width ||
                                  selectedNode.width ||
                                  "auto"
                                }
                                readOnly
                                disabled
                                placeholder="Auto"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                                H
                              </span>
                              <Input
                                type="number"
                                className="h-8 text-xs bg-gray-50 font-mono"
                                value={
                                  selectedNode.measured?.height ||
                                  selectedNode.height ||
                                  "auto"
                                }
                                readOnly
                                disabled
                                placeholder="Auto"
                              />
                            </div>
                          </div>

                          {/* Rotation */}
                          <div>
                            <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                              Rotation
                            </span>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                className="h-8 text-xs bg-gray-50 font-mono flex-1"
                                value={(nodeData.rotation as number) || 0}
                                onChange={(e) =>
                                  updateField(
                                    "rotation",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                min={0}
                                max={360}
                              />
                              <span className="text-[10px] text-gray-400">
                                deg
                              </span>
                            </div>
                          </div>

                          {/* Alignment Controls */}
                          <div className="pt-2">
                            <span className="text-[10px] text-gray-400 mb-1.5 block font-medium">
                              Alignment
                            </span>
                            <div className="flex items-center justify-between bg-gray-50 p-1 rounded-md border border-gray-100">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-sm"
                                onClick={() => onAlign("left")}
                                title="Align Left"
                              >
                                <AlignLeft size={12} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-sm"
                                onClick={() => onAlign("center")}
                                title="Align Center"
                              >
                                <AlignCenter size={12} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-sm"
                                onClick={() => onAlign("right")}
                                title="Align Right"
                              >
                                <AlignRight size={12} />
                              </Button>
                              <div className="w-px h-3 bg-gray-200 mx-0.5" />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-sm"
                                onClick={() => onAlign("top")}
                                title="Align Top"
                              >
                                <AlignStartVertical size={12} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-sm"
                                onClick={() => onAlign("middle")}
                                title="Align Middle"
                              >
                                <AlignVerticalJustifyCenter size={12} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-sm"
                                onClick={() => onAlign("bottom")}
                                title="Align Bottom"
                              >
                                <AlignEndVertical size={12} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* ─── STYLE ACCORDION ─── */}
                    <AccordionItem
                      value="style"
                      className="border-b border-gray-100"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          <Paintbrush size={14} className="text-purple-500" />
                          Style
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          {/* Color Presets */}
                          <div className="space-y-2">
                            <span className="text-[10px] text-gray-400 font-medium">
                              Theme Color
                            </span>
                            <div className="grid grid-cols-5 gap-2">
                              {colorPresets.map((color) => (
                                <button
                                  key={color.value}
                                  onClick={() =>
                                    updateField("color", color.value)
                                  }
                                  className={`aspect-square rounded-full transition-all ${color.bg} ${
                                    nodeData.color === color.value
                                      ? "ring-2 ring-offset-2 ring-gray-900 scale-90"
                                      : "hover:scale-110"
                                  }`}
                                  title={color.name}
                                />
                              ))}
                              {/* Custom Color Picker */}
                              <div className="relative aspect-square rounded-full overflow-hidden border border-gray-200 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-50" />
                                <input
                                  type="color"
                                  value={
                                    (nodeData.color as string) || "#ffffff"
                                  }
                                  onChange={(e) =>
                                    updateField("color", e.target.value)
                                  }
                                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                />
                                <span className="relative text-[10px] font-bold text-gray-600">
                                  +
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Opacity */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[10px] text-gray-400 font-medium">
                                Opacity
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {(nodeData.opacity as number) || 100}%
                              </span>
                            </div>
                            <Slider
                              value={[(nodeData.opacity as number) || 100]}
                              onValueChange={([v]) => updateField("opacity", v)}
                              min={10}
                              max={100}
                              step={5}
                            />
                          </div>

                          {/* Border Radius */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[10px] text-gray-400 font-medium">
                                Border Radius
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {(nodeData.borderRadius as number) || 0}px
                              </span>
                            </div>
                            <Slider
                              value={[(nodeData.borderRadius as number) || 0]}
                              onValueChange={([v]) =>
                                updateField("borderRadius", v)
                              }
                              min={0}
                              max={50}
                              step={1}
                            />
                          </div>

                          {/* Border Width */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[10px] text-gray-400 font-medium">
                                Border Width
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {(nodeData.borderWidth as number) || 0}px
                              </span>
                            </div>
                            <Slider
                              value={[(nodeData.borderWidth as number) || 0]}
                              onValueChange={([v]) =>
                                updateField("borderWidth", v)
                              }
                              min={0}
                              max={10}
                              step={1}
                            />
                          </div>

                          {/* Border Color */}
                          <div className="space-y-2">
                            <span className="text-[10px] text-gray-400 font-medium">
                              Border Color
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-8 rounded-md border border-gray-200 overflow-hidden shrink-0">
                                <input
                                  type="color"
                                  value={
                                    (nodeData.borderColor as string) ||
                                    "#000000"
                                  }
                                  onChange={(e) =>
                                    updateField("borderColor", e.target.value)
                                  }
                                  className="absolute inset-0 w-full h-full cursor-pointer"
                                />
                              </div>
                              <Input
                                value={
                                  (nodeData.borderColor as string) || "#000000"
                                }
                                onChange={(e) =>
                                  updateField("borderColor", e.target.value)
                                }
                                className="h-8 text-xs font-mono flex-1"
                                placeholder="#000000"
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* ─── BASIC ACCORDION ─── */}
                    <AccordionItem
                      value="basic"
                      className="border-b border-gray-100"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          <Tag size={14} className="text-emerald-500" />
                          Basic
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          {/* Label */}
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-medium text-gray-500">
                              Label Text
                            </Label>
                            <Input
                              value={(nodeData.label as string) || ""}
                              onChange={(e) =>
                                updateField("label", e.target.value)
                              }
                              className="text-xs bg-gray-50 h-8"
                            />
                          </div>

                          {/* Value (for sensor/gauge/progress etc.) */}
                          {[
                            "temperature",
                            "gauge",
                            "progress",
                            "slider",
                            "climate",
                            "health",
                            "voltage",
                          ].includes(nodeType) && (
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-medium text-gray-500">
                                Current Value
                              </Label>
                              <div className="flex items-center gap-3">
                                <Slider
                                  value={[(nodeData.value as number) || 50]}
                                  onValueChange={([v]) =>
                                    updateField("value", v)
                                  }
                                  min={0}
                                  max={100}
                                  step={1}
                                  className="flex-1"
                                />
                                <Input
                                  type="number"
                                  value={(nodeData.value as number) || 50}
                                  onChange={(e) =>
                                    updateField(
                                      "value",
                                      parseInt(e.target.value),
                                    )
                                  }
                                  className="w-14 h-8 text-xs font-mono"
                                />
                              </div>
                            </div>
                          )}

                          {/* Location */}
                          {nodeType === "location" && (
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-medium text-gray-500">
                                Location
                              </Label>
                              <Input
                                value={(nodeData.location as string) || ""}
                                onChange={(e) =>
                                  updateField("location", e.target.value)
                                }
                                placeholder="e.g. Zone A"
                                className="text-xs h-8"
                              />
                            </div>
                          )}

                          {/* Image URL */}
                          {nodeType === "image" && (
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-medium text-gray-500">
                                Image Source URL
                              </Label>
                              <Input
                                value={(nodeData.imageUrl as string) || ""}
                                onChange={(e) =>
                                  updateField("imageUrl", e.target.value)
                                }
                                placeholder="https://..."
                                className="text-xs font-mono h-8"
                              />
                            </div>
                          )}

                          {/* Content Text */}
                          {nodeType === "textcard" && (
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-medium text-gray-500">
                                Detailed Content
                              </Label>
                              <textarea
                                value={(nodeData.content as string) || ""}
                                onChange={(e) =>
                                  updateField("content", e.target.value)
                                }
                                rows={4}
                                className="w-full text-xs rounded-md border border-gray-200 p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
                              />
                            </div>
                          )}

                          {/* Alarm Status */}
                          {nodeType === "alarm" && (
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-medium text-gray-500">
                                Alarm Status
                              </Label>
                              <div className="flex gap-1.5 p-1 bg-gray-100 rounded-lg">
                                {["normal", "warning", "active"].map(
                                  (status) => (
                                    <button
                                      key={status}
                                      onClick={() =>
                                        updateField("status", status)
                                      }
                                      className={`flex-1 py-1.5 text-[10px] font-medium uppercase rounded-md transition-all ${
                                        nodeData.status === status
                                          ? status === "active"
                                            ? "bg-red-500 text-white shadow-sm"
                                            : status === "warning"
                                              ? "bg-orange-500 text-white shadow-sm"
                                              : "bg-green-500 text-white shadow-sm"
                                          : "text-gray-500 hover:bg-gray-200"
                                      }`}
                                    >
                                      {status}
                                    </button>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* ─── LINE PROPERTIES ACCORDION ─── */}
                    {isLineType && (
                      <AccordionItem
                        value="line-props"
                        className="border-b border-gray-100"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            <Minus size={14} className="text-orange-500" />
                            Line Properties
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {/* Stroke Color */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-gray-400 font-medium">
                                Stroke Color
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-md border border-gray-200 overflow-hidden shrink-0">
                                  <input
                                    type="color"
                                    value={
                                      (nodeData.strokeColor as string) ||
                                      "#374151"
                                    }
                                    onChange={(e) =>
                                      updateField("strokeColor", e.target.value)
                                    }
                                    className="absolute inset-0 w-full h-full cursor-pointer"
                                  />
                                </div>
                                <Input
                                  value={
                                    (nodeData.strokeColor as string) ||
                                    "#374151"
                                  }
                                  onChange={(e) =>
                                    updateField("strokeColor", e.target.value)
                                  }
                                  className="h-8 text-xs font-mono flex-1"
                                  placeholder="#374151"
                                />
                              </div>
                            </div>

                            {/* Stroke Width */}
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-[10px] text-gray-400 font-medium">
                                  Stroke Width
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {(nodeData.strokeWidth as number) || 2}px
                                </span>
                              </div>
                              <Slider
                                value={[(nodeData.strokeWidth as number) || 2]}
                                onValueChange={([v]) =>
                                  updateField("strokeWidth", v)
                                }
                                min={1}
                                max={10}
                                step={1}
                              />
                            </div>

                            {/* Dash Style */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-gray-400 font-medium">
                                Dash Style
                              </span>
                              <div className="flex gap-1.5 p-1 bg-gray-100 rounded-lg">
                                {["solid", "dashed", "dotted"].map((style) => (
                                  <button
                                    key={style}
                                    onClick={() =>
                                      updateField("dashStyle", style)
                                    }
                                    className={`flex-1 py-1.5 text-[10px] font-medium capitalize rounded-md transition-all ${
                                      (nodeData.dashStyle || "solid") === style
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:bg-gray-200"
                                    }`}
                                  >
                                    {style}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Line Length */}
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-[10px] text-gray-400 font-medium">
                                  Length
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {(nodeData.width as number) || 200}px
                                </span>
                              </div>
                              <Slider
                                value={[(nodeData.width as number) || 200]}
                                onValueChange={([v]) => updateField("width", v)}
                                min={50}
                                max={600}
                                step={10}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* ─── FILLED SHAPE PROPERTIES ACCORDION ─── */}
                    {isFilledShapeType && (
                      <AccordionItem
                        value="shape-props"
                        className="border-b border-gray-100"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            <Paintbrush size={14} className="text-cyan-500" />
                            Shape Properties
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {/* Fill Color */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-gray-400 font-medium">
                                Fill Color
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-md border border-gray-200 overflow-hidden shrink-0">
                                  <input
                                    type="color"
                                    value={
                                      (nodeData.fillColor as string) ||
                                      "#ffffff"
                                    }
                                    onChange={(e) =>
                                      updateField("fillColor", e.target.value)
                                    }
                                    className="absolute inset-0 w-full h-full cursor-pointer"
                                  />
                                </div>
                                <Input
                                  value={
                                    (nodeData.fillColor as string) || "#ffffff"
                                  }
                                  onChange={(e) =>
                                    updateField("fillColor", e.target.value)
                                  }
                                  className="h-8 text-xs font-mono flex-1"
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>

                            {/* Border Color */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-gray-400 font-medium">
                                Border Color
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-md border border-gray-200 overflow-hidden shrink-0">
                                  <input
                                    type="color"
                                    value={
                                      (nodeData.borderColor as string) ||
                                      "#9ca3af"
                                    }
                                    onChange={(e) =>
                                      updateField("borderColor", e.target.value)
                                    }
                                    className="absolute inset-0 w-full h-full cursor-pointer"
                                  />
                                </div>
                                <Input
                                  value={
                                    (nodeData.borderColor as string) ||
                                    "#9ca3af"
                                  }
                                  onChange={(e) =>
                                    updateField("borderColor", e.target.value)
                                  }
                                  className="h-8 text-xs font-mono flex-1"
                                  placeholder="#9ca3af"
                                />
                              </div>
                            </div>

                            {/* Border Width */}
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-[10px] text-gray-400 font-medium">
                                  Border Width
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {(nodeData.borderWidth as number) ?? 2}px
                                </span>
                              </div>
                              <Slider
                                value={[(nodeData.borderWidth as number) ?? 2]}
                                onValueChange={([v]) =>
                                  updateField("borderWidth", v)
                                }
                                min={0}
                                max={10}
                                step={1}
                              />
                            </div>

                            {/* Opacity */}
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-[10px] text-gray-400 font-medium">
                                  Opacity
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {(nodeData.opacity as number) ?? 100}%
                                </span>
                              </div>
                              <Slider
                                value={[(nodeData.opacity as number) ?? 100]}
                                onValueChange={([v]) =>
                                  updateField("opacity", v)
                                }
                                min={10}
                                max={100}
                                step={5}
                              />
                            </div>

                            {/* Border Radius (Rectangle only) */}
                            {nodeType === "rectangle" && (
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-[10px] text-gray-400 font-medium">
                                    Border Radius
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                    {(nodeData.borderRadius as number) ?? 4}px
                                  </span>
                                </div>
                                <Slider
                                  value={[
                                    (nodeData.borderRadius as number) ?? 4,
                                  ]}
                                  onValueChange={([v]) =>
                                    updateField("borderRadius", v)
                                  }
                                  min={0}
                                  max={50}
                                  step={1}
                                />
                              </div>
                            )}

                            {/* Size Controls */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-gray-400 font-medium">
                                Size
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-[10px] text-gray-400 mb-1 block">
                                    Width
                                  </span>
                                  <Input
                                    type="number"
                                    className="h-8 text-xs font-mono"
                                    value={(nodeData.width as number) || 160}
                                    onChange={(e) =>
                                      updateField(
                                        "width",
                                        parseInt(e.target.value) || 160,
                                      )
                                    }
                                    min={20}
                                  />
                                </div>
                                <div>
                                  <span className="text-[10px] text-gray-400 mb-1 block">
                                    Height
                                  </span>
                                  <Input
                                    type="number"
                                    className="h-8 text-xs font-mono"
                                    value={(nodeData.height as number) || 100}
                                    onChange={(e) =>
                                      updateField(
                                        "height",
                                        parseInt(e.target.value) || 100,
                                      )
                                    }
                                    min={20}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* ─── TABLE PROPERTIES ACCORDION ─── */}
                    {isTableType && (
                      <AccordionItem
                        value="table-props"
                        className="border-b border-gray-100"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            <Table2 size={14} className="text-blue-500" />
                            Table Properties
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {/* Rows & Columns */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <span className="text-[10px] text-gray-400 font-medium">
                                  Rows
                                </span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      const r = Math.max(
                                        2,
                                        ((nodeData.rows as number) || 4) - 1,
                                      );
                                      const cellData =
                                        (nodeData.cellData as string[][]) || [];
                                      updateField("rows", r);
                                      updateField(
                                        "cellData",
                                        cellData.slice(0, r),
                                      );
                                    }}
                                  >
                                    <Minus size={12} />
                                  </Button>
                                  <span className="text-xs font-mono w-8 text-center">
                                    {(nodeData.rows as number) || 4}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      const r =
                                        ((nodeData.rows as number) || 4) + 1;
                                      const cols =
                                        (nodeData.columns as number) || 3;
                                      const cellData =
                                        (nodeData.cellData as string[][]) || [];
                                      const newRow = Array.from(
                                        { length: cols },
                                        (_, c) => `Row ${r - 1} Col ${c + 1}`,
                                      );
                                      updateField("rows", r);
                                      updateField("cellData", [
                                        ...cellData,
                                        newRow,
                                      ]);
                                    }}
                                  >
                                    <Plus size={12} />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <span className="text-[10px] text-gray-400 font-medium">
                                  Columns
                                </span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      const c = Math.max(
                                        1,
                                        ((nodeData.columns as number) || 3) - 1,
                                      );
                                      const cellData =
                                        (nodeData.cellData as string[][]) || [];
                                      updateField("columns", c);
                                      updateField(
                                        "cellData",
                                        cellData.map((row) => row.slice(0, c)),
                                      );
                                    }}
                                  >
                                    <Minus size={12} />
                                  </Button>
                                  <span className="text-xs font-mono w-8 text-center">
                                    {(nodeData.columns as number) || 3}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      const c =
                                        ((nodeData.columns as number) || 3) + 1;
                                      const cellData =
                                        (nodeData.cellData as string[][]) || [];
                                      updateField("columns", c);
                                      updateField(
                                        "cellData",
                                        cellData.map((row, ri) => [
                                          ...row,
                                          ri === 0
                                            ? `Header ${c}`
                                            : `Row ${ri} Col ${c}`,
                                        ]),
                                      );
                                    }}
                                  >
                                    <Plus size={12} />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Header Background Color */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-gray-400 font-medium">
                                Header Background
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-md border border-gray-200 overflow-hidden shrink-0">
                                  <input
                                    type="color"
                                    value={
                                      (nodeData.headerBgColor as string) ||
                                      "#3b82f6"
                                    }
                                    onChange={(e) =>
                                      updateField(
                                        "headerBgColor",
                                        e.target.value,
                                      )
                                    }
                                    className="absolute inset-0 w-full h-full cursor-pointer"
                                  />
                                </div>
                                <Input
                                  value={
                                    (nodeData.headerBgColor as string) ||
                                    "#3b82f6"
                                  }
                                  onChange={(e) =>
                                    updateField("headerBgColor", e.target.value)
                                  }
                                  className="h-8 text-xs font-mono flex-1"
                                  placeholder="#3b82f6"
                                />
                              </div>
                            </div>

                            {/* Border Color */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-gray-400 font-medium">
                                Border Color
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-md border border-gray-200 overflow-hidden shrink-0">
                                  <input
                                    type="color"
                                    value={
                                      (nodeData.borderColor as string) ||
                                      "#e5e7eb"
                                    }
                                    onChange={(e) =>
                                      updateField("borderColor", e.target.value)
                                    }
                                    className="absolute inset-0 w-full h-full cursor-pointer"
                                  />
                                </div>
                                <Input
                                  value={
                                    (nodeData.borderColor as string) ||
                                    "#e5e7eb"
                                  }
                                  onChange={(e) =>
                                    updateField("borderColor", e.target.value)
                                  }
                                  className="h-8 text-xs font-mono flex-1"
                                  placeholder="#e5e7eb"
                                />
                              </div>
                            </div>

                            {/* Border Width */}
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-[10px] text-gray-400 font-medium">
                                  Border Width
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {(nodeData.borderWidth as number) ?? 1}px
                                </span>
                              </div>
                              <Slider
                                value={[(nodeData.borderWidth as number) ?? 1]}
                                onValueChange={([v]) =>
                                  updateField("borderWidth", v)
                                }
                                min={0}
                                max={5}
                                step={1}
                              />
                            </div>

                            {/* Font Color */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-gray-400 font-medium">
                                Font Color
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-md border border-gray-200 overflow-hidden shrink-0">
                                  <input
                                    type="color"
                                    value={
                                      (nodeData.fontColor as string) ||
                                      "#1f2937"
                                    }
                                    onChange={(e) =>
                                      updateField("fontColor", e.target.value)
                                    }
                                    className="absolute inset-0 w-full h-full cursor-pointer"
                                  />
                                </div>
                                <Input
                                  value={
                                    (nodeData.fontColor as string) || "#1f2937"
                                  }
                                  onChange={(e) =>
                                    updateField("fontColor", e.target.value)
                                  }
                                  className="h-8 text-xs font-mono flex-1"
                                  placeholder="#1f2937"
                                />
                              </div>
                            </div>

                            {/* Font Size */}
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-[10px] text-gray-400 font-medium">
                                  Font Size
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {(nodeData.fontSize as number) || 13}px
                                </span>
                              </div>
                              <Slider
                                value={[(nodeData.fontSize as number) || 13]}
                                onValueChange={([v]) =>
                                  updateField("fontSize", v)
                                }
                                min={10}
                                max={24}
                                step={1}
                              />
                            </div>

                            {/* Opacity */}
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-[10px] text-gray-400 font-medium">
                                  Opacity
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {(nodeData.opacity as number) ?? 100}%
                                </span>
                              </div>
                              <Slider
                                value={[(nodeData.opacity as number) ?? 100]}
                                onValueChange={([v]) =>
                                  updateField("opacity", v)
                                }
                                min={10}
                                max={100}
                                step={5}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                )}
              </>
            )}
          </TabsContent>

          {/* ═══════════════════════════════════════ */}
          {/* ═══  TAB 2 — LAYER  ═════════════════ */}
          {/* ═══════════════════════════════════════ */}
          <TabsContent value="layer" className="p-0 m-0 h-full relative">
            <div className="absolute inset-0 overflow-y-auto">
              {nodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <Layers size={32} className="mb-2 opacity-20" />
                  <p className="text-sm">No elements on canvas</p>
                </div>
              ) : (
                <>
                  {/* Layer count header */}
                  <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Elements
                    </span>
                    <span className="text-[10px] text-gray-400 bg-gray-200/80 px-1.5 py-0.5 rounded-full font-medium">
                      {nodes.length}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[...nodes].reverse().map((node) => {
                      const isSelected = selectedNodes.includes(node.id);
                      return (
                        <div
                          key={node.id}
                          onClick={() => onSelectNode(node.id)}
                          className={`flex items-center gap-3 p-3 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                            isSelected
                              ? "bg-indigo-50 border-l-[3px] border-indigo-500 pl-[9px]"
                              : "border-l-[3px] border-transparent"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-indigo-100 text-indigo-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <Layers size={12} />
                          </div>
                          <div className="flex flex-col overflow-hidden flex-1">
                            <span
                              className={`truncate text-xs font-medium ${
                                isSelected ? "text-indigo-700" : "text-gray-700"
                              }`}
                            >
                              {(node.data?.label as string) || node.type}
                            </span>
                            <span className="text-[10px] text-gray-400 capitalize">
                              {node.type}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* ═══════════════════════════════════════ */}
          {/* ═══  TAB 3 — REPLACE ADDRESS  ═══════ */}
          {/* ═══════════════════════════════════════ */}
          <TabsContent value="replace-address" className="p-0 m-0 h-full">
            {!selectedNode || isMultiSelect ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <Network size={32} className="mb-2 opacity-20" />
                <p className="text-sm">
                  {isMultiSelect
                    ? "Select single element"
                    : "Select an element"}
                </p>
                <p className="text-[10px] mt-1">to configure device tags</p>
              </div>
            ) : !isIoTWidget ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <Network size={32} className="mb-2 opacity-20" />
                <p className="text-sm">Not an IoT widget</p>
                <p className="text-[10px] mt-1">
                  Tags are only available for IoT elements
                </p>
              </div>
            ) : (
              <div className="p-0">
                {/* Widget info */}
                <div className="px-4 py-2.5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-transparent flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    {getWidgetTypeLabel(nodeType)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    {selectedNode?.id.slice(0, 8)}
                  </span>
                </div>

                {/* Tag Bindings */}
                <div className="p-4 space-y-4">
                  {/* Primary Tag */}
                  <div className="space-y-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-semibold text-gray-700">
                        Primary Tag
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                          Tag Name
                        </span>
                        <Input
                          value={(nodeData.tagName as string) || ""}
                          onChange={(e) =>
                            updateField("tagName", e.target.value)
                          }
                          placeholder="e.g. sensor_001"
                          className="h-7 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                          Tag Address
                        </span>
                        <Input
                          value={(nodeData.tagAddress as string) || ""}
                          onChange={(e) =>
                            updateField("tagAddress", e.target.value)
                          }
                          placeholder="e.g. DB1.DBW0"
                          className="h-7 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                          Data Type
                        </span>
                        <select
                          value={(nodeData.dataType as string) || "float"}
                          onChange={(e) =>
                            updateField("dataType", e.target.value)
                          }
                          className="w-full h-7 text-xs rounded-md border border-gray-200 bg-white px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {iotTagTypes.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Write Tag (for control widgets) */}
                  {["switch", "radio", "slider", "button", "climate"].includes(
                    nodeType,
                  ) && (
                    <div className="space-y-3 p-3 rounded-lg border border-orange-200 bg-orange-50/30">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[11px] font-semibold text-gray-700">
                          Write Tag
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                            Tag Name
                          </span>
                          <Input
                            value={(nodeData.writeTagName as string) || ""}
                            onChange={(e) =>
                              updateField("writeTagName", e.target.value)
                            }
                            placeholder="e.g. cmd_001"
                            className="h-7 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                            Tag Address
                          </span>
                          <Input
                            value={(nodeData.writeTagAddress as string) || ""}
                            onChange={(e) =>
                              updateField("writeTagAddress", e.target.value)
                            }
                            placeholder="e.g. DB1.DBX0.0"
                            className="h-7 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                            Data Type
                          </span>
                          <select
                            value={(nodeData.writeDataType as string) || "bool"}
                            onChange={(e) =>
                              updateField("writeDataType", e.target.value)
                            }
                            className="w-full h-7 text-xs rounded-md border border-gray-200 bg-white px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {iotTagTypes.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Protocol Info */}
                  <div className="p-3 rounded-lg border border-dashed border-gray-200 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Network size={12} className="text-gray-400" />
                      <span className="text-[10px] font-semibold text-gray-500 uppercase">
                        Connection
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                          Protocol
                        </span>
                        <select
                          value={(nodeData.protocol as string) || "mqtt"}
                          onChange={(e) =>
                            updateField("protocol", e.target.value)
                          }
                          className="w-full h-7 text-xs rounded-md border border-gray-200 bg-gray-50 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="mqtt">MQTT</option>
                          <option value="opcua">OPC-UA</option>
                          <option value="modbus">Modbus TCP</option>
                          <option value="http">HTTP REST</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 mb-1 block font-medium">
                          Update Interval (ms)
                        </span>
                        <Input
                          type="number"
                          value={(nodeData.updateInterval as number) || 1000}
                          onChange={(e) =>
                            updateField(
                              "updateInterval",
                              parseInt(e.target.value) || 1000,
                            )
                          }
                          className="h-7 text-xs font-mono"
                          min={100}
                          step={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
