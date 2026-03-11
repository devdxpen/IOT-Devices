"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, LayoutGrid, List, Plus, Trash2, SlidersHorizontal } from "lucide-react";
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
import { DevicesTable } from "./components/devices-table";
import { PaginationControls } from "./components/pagination-controls";
import { useDeviceFilters } from "./hooks/useDeviceFilters";
import { useDeviceSummaries } from "./hooks/useDeviceSummaries";
import { AddDeviceModal } from "./components/add-device-modal";
import { MoveToPositionModal } from "./components/move-to-position-modal";
import { updateDevicePriority } from "./api/deviceApi";

export function DevicesManagement() {
  const { filters, setSearch, setLocation, setView } = useDeviceFilters();
  const { data, isLoading, refetch } = useDeviceSummaries();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // States for new features
  const [activeTab, setActiveTab] = useState<
    "all" | "own" | "shared" | "online" | "offline"
  >("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>({ key: "colorFlag", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletedIds, setDeletedIds] = useState<string[]>([]); // Mock delete state

  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [deviceToMove, setDeviceToMove] = useState<DeviceSummary | null>(null);

  // Handle Sort
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Process data (Filter -> Delete -> Sort -> Paginate)
  const processedDevices = useMemo(() => {
    // 1. Filter out intentionally deleted items (mock)
    let processed = data.filter((device) => !deletedIds.includes(device.id));

    // 1.5 Tab filters
    processed = processed.filter((device) => {
      switch (activeTab) {
        case "own":
          return device.ownership === "own";
        case "shared":
          return device.ownership === "shared";
        case "online":
          return device.isOnline;
        case "offline":
          return !device.isOnline;
        default:
          return true;
      }
    });

    // 2. Search & Location filters
    const normalizedSearch = filters.search.trim().toLowerCase();
    processed = processed.filter((device) => {
      const matchesSearch =
        !normalizedSearch ||
        device.name.toLowerCase().includes(normalizedSearch) ||
        device.type.toLowerCase().includes(normalizedSearch) ||
        device.serialNumber.toLowerCase().includes(normalizedSearch) ||
        device.tags?.some((tag) =>
          tag.toLowerCase().includes(normalizedSearch),
        );
      const matchesLocation =
        filters.location === "all" || device.location === filters.location;
      return matchesSearch && matchesLocation;
    });

    // 3. Sort
    if (sortConfig) {
      processed.sort((a, b) => {
        // Deep value getter for sorting
        const getVal = (obj: any, path: string) =>
          path.split(".").reduce((acc, part) => acc && acc[part], obj);

        let aValue = getVal(a, sortConfig.key);
        let bValue = getVal(b, sortConfig.key);

        // Custom weight mapping for Color Flags
        if (sortConfig.key === "colorFlag") {
          const flagWeights: Record<string, number> = {
            red: 4,
            yellow: 3,
            green: 2,
            none: 1,
          };
          aValue = flagWeights[aValue] || 0;
          bValue = flagWeights[bValue] || 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

        // Secondary sort by position if primary keys match
        if (a.position !== undefined && b.position !== undefined) {
          return a.position - b.position;
        }
        return 0;
      });
    }

    return processed;
  }, [
    data,
    filters.location,
    filters.search,
    deletedIds,
    sortConfig,
    activeTab,
  ]);

  // Pagination bounds
  const totalItems = processedDevices.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedDevices.slice(startIndex, startIndex + pageSize);
  }, [processedDevices, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.location, pageSize]);

  // Handle Delete
  const handleDelete = () => {
    if (selectedIds.length > 0) {
      setDeletedIds([...deletedIds, ...selectedIds]);
      setSelectedIds([]); // Clear selection after delete
    }
  };

  const handleManualMoveRequest = (device: DeviceSummary) => {
    setDeviceToMove(device);
    setIsMoveModalOpen(true);
  };

  const submitManualPositionMove = async (
    deviceId: string,
    newPos: number,
    newFlag: "red" | "yellow" | "green" | "none",
  ) => {
    await updateDevicePriority(deviceId, newPos, newFlag);
    refetch(); // Recall data which retains natural sort structure

    // Jump to page representing new arrangement optimally
    const optimalPage = Math.ceil(newPos / pageSize);
    if (optimalPage !== currentPage && optimalPage > 0) {
      setCurrentPage(optimalPage);
    }
  };

  const contentClassName =
    filters.view === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
      : "flex flex-col gap-0"; // Table has its own styling

  return (
    <div className="h-full flex flex-col bg-white rounded-md shadow-sm border border-neutral-200 overflow-hidden">
      <div className="z-10 p-4 border-b border-neutral-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 mt-1">
              Devices Monitoring
            </h2>
            <div className="flex gap-6 border-b border-neutral-200">
              {[
                { id: "all", label: "All Devices" },
                { id: "own", label: "Own Devices" },
                { id: "shared", label: "Shared Devices" },
                { id: "online", label: "Online" },
                { id: "offline", label: "Offline" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`pb-2.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search"
                value={filters.search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9 w-[260px] h-9 bg-white border-neutral-200 rounded-md focus-visible:ring-blue-500 text-sm"
              />
            </div>

            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                className="h-9 w-9 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                title="Delete Selected"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            <Select value={filters.location} onValueChange={setLocation}>
              <SelectTrigger className="h-9 w-[160px] border-neutral-200 bg-white text-neutral-700 font-medium text-sm">
                <SelectValue placeholder="Select Filter" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Locations</SelectItem>
                {deviceLocations
                  .filter((l) => l.value !== "all")
                  .map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="h-9 px-3 border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-medium bg-white text-sm"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>

            <ToggleGroup
              type="single"
              value={filters.view}
              onValueChange={(value) => {
                if (value === "grid" || value === "list") {
                  setView(value);
                }
              }}
              className="border border-neutral-200 rounded-md p-1 bg-white h-9"
            >
              <ToggleGroupItem
                value="list"
                aria-label="List view"
                className="p-1.5 h-7 w-8 rounded data-[state=on]:bg-blue-500 data-[state=on]:text-white text-neutral-500 hover:bg-neutral-100"
              >
                <List className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="grid"
                aria-label="Grid view"
                className="p-1.5 h-7 w-8 rounded data-[state=on]:bg-blue-500 data-[state=on]:text-white text-neutral-500 hover:bg-neutral-100"
              >
                <LayoutGrid className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto bg-neutral-50/30 ${contentClassName}`}
      >
        {isLoading ? (
          <div className="text-sm text-neutral-500 py-10 text-center">
            Loading devices...
          </div>
        ) : processedDevices.length === 0 ? (
          <div className="text-sm text-neutral-500 py-10 text-center">
            No devices found matching your criteria.
          </div>
        ) : filters.view === "grid" ? (
          paginatedDevices.map((device: DeviceSummary) => (
            <DeviceCard
              key={device.id}
              device={device}
              isSelected={selectedIds.includes(device.id)}
              onSelect={(checked) => {
                if (checked) {
                  setSelectedIds([...selectedIds, device.id]);
                } else {
                  setSelectedIds(selectedIds.filter((id) => id !== device.id));
                }
              }}
            />
          ))
        ) : (
          <DevicesTable
            devices={paginatedDevices}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            sortConfig={sortConfig}
            onSort={handleSort}
            onRequestMove={handleManualMoveRequest}
          />
        )}
      </div>

      {!isLoading && processedDevices.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}

      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          refetch();
        }}
      />

      <MoveToPositionModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        device={deviceToMove}
        totalItems={totalItems}
        onMove={submitManualPositionMove}
      />
    </div>
  );
}
