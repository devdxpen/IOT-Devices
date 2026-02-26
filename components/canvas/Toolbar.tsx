"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  AlignCenter,
  AlignEndVertical,
  AlignLeft,
  AlignRight,
  AlignStartVertical,
  AlignVerticalJustifyCenter,
  Circle,
  Eraser,
  Image as ImageIcon,
  Maximize,
  Minus,
  MousePointer2,
  Redo,
  Save,
  Settings,
  Square,
  Trash2,
  Triangle,
  Type,
  Undo,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface ToolbarProps {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  onDeleteNode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onAlignTop: () => void;
  onAlignMiddle: () => void;
  onAlignBottom: () => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  hasSelection: boolean;
  hasMultipleSelection: boolean;
  canvasSize: { width: number; height: number };
  setCanvasSize: (size: { width: number; height: number }) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  backgroundImage: string;
  setBackgroundImage: (image: string) => void;
}

export function Toolbar({
  selectedTool,
  setSelectedTool,
  onDeleteNode,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
  onSave,
  onLoad,
  onClear,
  templateName,
  setTemplateName,
  canUndo,
  canRedo,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onAlignTop,
  onAlignMiddle,
  onAlignBottom,
  showGrid,
  setShowGrid,
  snapToGrid,
  setSnapToGrid,
  hasSelection,
  hasMultipleSelection,
  canvasSize,
  setCanvasSize,
  backgroundColor,
  setBackgroundColor,
  backgroundImage,
  setBackgroundImage,
}: ToolbarProps) {
  const tools = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "image", icon: ImageIcon, label: "Image" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackgroundImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border-b h-14 px-4 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-1 h-full py-2">
        {/* Tools */}
        <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8",
                selectedTool === tool.id && "bg-blue-100 text-blue-600",
              )}
              onClick={() => setSelectedTool(tool.id)}
              title={tool.label}
            >
              <tool.icon size={16} />
            </Button>
          ))}
        </div>

        {/* View Controls & Settings */}
        <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={showGrid || snapToGrid ? "secondary" : "ghost"}
                size="icon"
                className={cn(
                  "h-8 w-8",
                  (showGrid || snapToGrid) && "text-blue-600",
                )}
                title="Canvas Settings"
              >
                <Settings size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Canvas Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Canvas Size (px)</Label>
                  <div className="flex items-center gap-2">
                    <div className="grid gap-1">
                      <Label
                        htmlFor="width"
                        className="text-[10px] text-gray-500"
                      >
                        W
                      </Label>
                      <Input
                        id="width"
                        type="number"
                        value={canvasSize?.width || 800}
                        onChange={(e) =>
                          setCanvasSize?.({
                            ...canvasSize,
                            width: parseInt(e.target.value) || 0,
                          })
                        }
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label
                        htmlFor="height"
                        className="text-[10px] text-gray-500"
                      >
                        H
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        value={canvasSize?.height || 600}
                        onChange={(e) =>
                          setCanvasSize?.({
                            ...canvasSize,
                            height: parseInt(e.target.value) || 0,
                          })
                        }
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <Label className="text-xs">Background</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="bg-color"
                        className="text-[10px] text-gray-500"
                      >
                        Color
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="bg-color"
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="h-6 w-12 p-0 border-0"
                        />
                      </div>
                    </div>
                    <div className="grid gap-1">
                      <Label
                        htmlFor="bg-image"
                        className="text-[10px] text-gray-500"
                      >
                        Image
                      </Label>
                      <Input
                        id="bg-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="h-7 text-[10px] file:text-[10px] file:h-full file:mr-2"
                      />
                      {backgroundImage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] text-red-500 justify-start px-0"
                          onClick={() => setBackgroundImage("")}
                        >
                          Remove Image
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-grid" className="text-xs">
                    Show Grid
                  </Label>
                  <Switch
                    id="show-grid"
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                    className="scale-75"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="snap-grid" className="text-xs">
                    Snap to Grid
                  </Label>
                  <Switch
                    id="snap-grid"
                    checked={snapToGrid}
                    onCheckedChange={setSnapToGrid}
                    className="scale-75"
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Alignment */}
        <div
          className={cn(
            "flex items-center gap-0.5 border-r pr-2 mr-2 transition-opacity",
            !hasMultipleSelection && "opacity-40 pointer-events-none",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignLeft}
          >
            <AlignLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignCenter}
          >
            <AlignCenter size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignRight}
          >
            <AlignRight size={16} />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignTop}
          >
            <AlignStartVertical size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignMiddle}
          >
            <AlignVerticalJustifyCenter size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignBottom}
          >
            <AlignEndVertical size={16} />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            disabled={!hasSelection}
            onClick={onDeleteNode}
            title="Delete"
          >
            <Trash2 size={16} />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!canUndo}
            onClick={onUndo}
          >
            <Undo size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!canRedo}
            onClick={onRedo}
          >
            <Redo size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClear}
          >
            <Eraser size={16} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-100 rounded-md px-1 p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onZoomOut}
          >
            <ZoomOut size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onFitView}
          >
            <Maximize size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onZoomIn}
          >
            <ZoomIn size={14} />
          </Button>
        </div>

        <div className="flex items-center gap-2 border-l pl-3">
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="h-8 w-40 text-sm bg-gray-50"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={onLoad}
            title="Import JSON"
          >
            <Upload size={14} />
          </Button>
          <Button size="sm" className="h-8 px-3 gap-1" onClick={onSave}>
            <Save size={14} /> Save
          </Button>
        </div>
      </div>
    </div>
  );
}
