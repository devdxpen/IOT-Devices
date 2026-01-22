"use client";

import { useState } from "react";
import {
  IoSearchOutline,
  IoGridOutline,
  IoListOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeviceCard } from "./device-card";
import { Device } from "@/types";

interface DevicesManagementProps {
  devices: Device[];
}

export function DevicesManagement({ devices }: DevicesManagementProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterCount] = useState(3);
  const [location, setLocation] = useState("ahmedabad");

  return (
    <div className="h-full flex flex-col bg-white rounded-sm shadow-md overflow-hidden">
      {/* Sticky Header Row */}
      <div className="z-10 p-4 border-b border-neutral-200 ">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Devices Management
            </h2>
            <p className="text-xs text-neutral-500">
              {viewMode === "grid" ? "Grid View" : "List View"}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search"
                className="pl-10 w-64 h-10 bg-white border-neutral-200 rounded-lg focus-visible:ring-blue-500"
              />
            </div>

            {/* View Mode Toggle - Radix UI ToggleGroup */}
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) =>
                value && setViewMode(value as "grid" | "list")
              }
              className="border border-neutral-200 rounded-lg p-1 bg-white"
            >
              <ToggleGroupItem
                value="list"
                aria-label="List view"
                className="p-2 rounded-md data-[state=on]:bg-neutral-100 hover:bg-neutral-50"
              >
                <IoListOutline className="w-4 h-4 text-neutral-600" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="grid"
                aria-label="Grid view"
                className="p-2 rounded-md data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-neutral-50"
              >
                <IoGridOutline className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Filters Button */}
            <Button
              variant="outline"
              className="h-10 border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-normal bg-white"
            >
              <HiOutlineAdjustmentsHorizontal className="w-4 h-4" />
              <span>Filters</span>
              <Badge className="bg-neutral-900 hover:bg-neutral-900 text-white text-[10px] h-5 min-w-5 px-1.5 flex items-center justify-center rounded-md">
                {filterCount}
              </Badge>
              <span className="text-blue-500 font-medium">×</span>
            </Button>

            {/* Location Select - Radix UI Select */}
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-10 w-auto min-w-[120px] border-neutral-200 bg-white text-neutral-700 font-normal">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ahmedabad">Ahmedaba...</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="p-5 grid grid-cols-4 gap-5 overflow-y-auto">
        {devices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
}
