import React from "react";
import {
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RightSidebar() {
  return (
    <aside className="w-72 bg-white border-l border-gray-200 flex flex-col h-full shrink-0 z-10">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Sliders size={16} />
          Properties
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="style" className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="style" className="p-4 space-y-6">
            {/* Alignment */}
            {/* <div className="space-y-3">
              <Label className="text-xs text-gray-500">Alignment</Label>
              <div className="flex bg-gray-100 rounded-md p-1 gap-1">
                <Button variant="ghost" size="sm" className="flex-1 h-8">
                  <AlignLeft size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 bg-white shadow-sm"
                >
                  <AlignCenter size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 h-8">
                  <AlignRight size={16} />
                </Button>
              </div>
            </div> */}

            <Separator />

            {/* Dimensions */}
            <div className="space-y-3">
              <Label className="text-xs text-gray-500">Dimensions</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400">Width</span>
                  <Input type="number" defaultValue={240} className="h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400">Height</span>
                  <Input type="number" defaultValue={120} className="h-8" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Colors */}
            <div className="space-y-3">
              <Label className="text-xs text-gray-500">Appearance</Label>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-gray-200 bg-red-500 cursor-pointer ring-2 ring-offset-1 ring-blue-500"></div>
                <Input defaultValue="#EF4444" className="h-8 flex-1" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="p-4">
            <div className="text-sm text-gray-500 text-center py-8">
              Select a widget to configure data sources.
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 size={16} /> Delete
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <Copy size={16} /> Clone
        </Button>
      </div>
    </aside>
  );
}
