"use client";

import { useMemo } from "react";
import { IoSearchOutline, IoGridOutline, IoListOutline } from "react-icons/io5";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deviceLocations } from "@/constants/deviceLocations";
import { DeviceSummary } from "@/types";
import { DeviceCard } from "./device-card";
import { DeviceListItem } from "./device-list-item";
import { useDeviceFilters } from "./hooks/useDeviceFilters";
import { useDeviceSummaries } from "./hooks/useDeviceSummaries";

export function DevicesManagement() {
  const { filters, setSearch, setLocation, setView } = useDeviceFilters();
  const { data, isLoading } = useDeviceSummaries();

  const filteredDevices = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();
    return data.filter((device) => {
      const matchesSearch =
        !normalizedSearch ||
        device.name.toLowerCase().includes(normalizedSearch) ||
        device.type.toLowerCase().includes(normalizedSearch) ||
        device.serialNumber.toLowerCase().includes(normalizedSearch);
      const matchesLocation =
        filters.location === "all" || device.location === filters.location;
      return matchesSearch && matchesLocation;
    });
  }, [data, filters.location, filters.search]);

  const contentClassName =
    filters.view === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
      : "flex flex-col gap-4";

  return (
    <div className="h-full flex flex-col bg-white rounded-sm shadow-md overflow-hidden">
      <div className="z-10 p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Devices Management
            </h2>
            <p className="text-xs text-neutral-500">
              {filters.view === "grid" ? "Grid View" : "List View"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search"
                value={filters.search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10 w-64 h-10 bg-white border-neutral-200 rounded-lg focus-visible:ring-blue-500"
              />
            </div>

            <ToggleGroup
              type="single"
              value={filters.view}
              onValueChange={(value) => {
                if (value === "grid" || value === "list") {
                  setView(value);
                }
              }}
              className="border border-neutral-200 rounded-lg p-1 bg-white"
            >
              <ToggleGroupItem
                value="list"
                aria-label="List view"
                className="p-2 rounded-md data-[state=on]:bg-primary-500 data-[state=on]:text-white hover:bg-neutral-50"
              >
                <IoListOutline className="w-4 h-4 text-neutral-600" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="grid"
                aria-label="Grid view"
                className="p-2 rounded-md data-[state=on]:bg-primary-500 data-[state=on]:text-white hover:bg-neutral-50"
              >
                <IoGridOutline className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <Button
              variant="outline"
              className="h-10 border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-normal bg-white"
            >
              <HiOutlineAdjustmentsHorizontal className="w-4 h-4" />
              <span>Filters</span>
              <span className="text-blue-500 font-medium">Clear</span>
            </Button>

            <Select value={filters.location} onValueChange={setLocation}>
              <SelectTrigger className="h-10 w-auto min-w-[160px] border-neutral-200 bg-white text-neutral-700 font-normal">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {deviceLocations.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className={`p-5 overflow-y-auto ${contentClassName}`}>
        {isLoading ? (
          <div className="text-sm text-neutral-500">Loading devices...</div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-sm text-neutral-500">No devices found.</div>
        ) : filters.view === "grid" ? (
          filteredDevices.map((device: DeviceSummary) => (
            <DeviceCard key={device.id} device={device} />
          ))
        ) : (
          filteredDevices.map((device: DeviceSummary) => (
            <DeviceListItem key={device.id} device={device} />
          ))
        )}
      </div>
    </div>
  );
}
