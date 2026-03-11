"use client";

import { useState, useMemo } from "react";
import { Search, LayoutGrid, List, Plus, Trash2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GroupStatsCards } from "./components/group-stats-cards";
import { GroupsTable } from "./components/groups-table";
import { mockGroupSummaries } from "@/data/mockGroupSummaries";
import { PaginationControls } from "./components/pagination-controls";

export function GroupsManagement() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const processedGroups = useMemo(() => {
    let processed = [...mockGroupSummaries].filter(
      (g) => !deletedIds.includes(g.id),
    );

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      processed = processed.filter(
        (group) =>
          group.name.toLowerCase().includes(searchLower) ||
          group.tags.toLowerCase().includes(searchLower),
      );
    }

    return processed;
  }, [filters.search, deletedIds]);

  // Pagination bounds
  const totalItems = processedGroups.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedGroups = processedGroups.slice(startIndex, startIndex + pageSize);

  // Derived stats
  const totalGroupsStats = processedGroups.length;
  const activeGroupsStats = totalGroupsStats;
  const inactiveGroupsStats = 0;
  const totalDevicesStats = processedGroups.reduce(
    (acc, curr) => acc + curr.deviceCount,
    0,
  );

  const handleDelete = () => {
    if (selectedIds.length > 0) {
      setDeletedIds([...deletedIds, ...selectedIds]);
      setSelectedIds([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Stats Cards */}
      <GroupStatsCards
        totalGroups={totalGroupsStats}
        activeGroups={activeGroupsStats}
        inactiveGroups={inactiveGroupsStats}
        totalDevices={totalDevicesStats}
      />

      {/* Main Content Card */}
      <div className="flex-1 bg-white rounded-xl shadow-xs border border-neutral-200 p-6 flex flex-col min-h-0 relative">
        {/* Header & Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">
              Group Monitoring
            </h1>
            <p className="text-sm text-neutral-500 mt-1">List View</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                placeholder="Search"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="pl-9 h-9 w-[250px] border-neutral-200 bg-neutral-50 focus-visible:bg-white text-sm"
              />
            </div>

            {/* Create Group Button */}
            <Button className="h-9 px-4 bg-green-500 hover:bg-green-600 text-white font-medium text-sm shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Groups
            </Button>

            {/* Delete Button */}
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                className="h-9 px-3 bg-red-100 hover:bg-red-200 text-red-600 border-0"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                <span className="ml-2 text-xs font-semibold">
                  {selectedIds.length}
                </span>
              </Button>
            )}

            {/* Filter Toggle */}
            <Button
              variant="outline"
              className="h-9 px-3 border-neutral-200 font-medium text-sm bg-white text-neutral-700 hover:bg-neutral-50"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>

            {/* View Mode Toggle */}
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) =>
                value && setViewMode(value as "list" | "grid")
              }
              className="bg-neutral-100 p-1 rounded-md border border-neutral-200"
            >
              <ToggleGroupItem
                value="list"
                aria-label="List view"
                className="h-7 w-8 px-0 data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:shadow-sm rounded transition-all"
              >
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="grid"
                aria-label="Grid view"
                className="h-7 w-8 px-0 data-[state=on]:bg-white data-[state=on]:text-neutral-900 data-[state=on]:shadow-sm rounded transition-all"
              >
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === "list" ? (
          <GroupsTable
            groups={paginatedGroups}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500">
            Grid View Configuration Pending...
          </div>
        )}

        {/* Reusable Pagination */}
        {totalItems > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}
