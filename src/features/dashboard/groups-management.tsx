"use client";

import { useState, useMemo } from "react";
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"all" | "own" | "shared">("all");
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

    // Tab-based ownership filter
    if (activeTab === "own") {
      processed = processed.filter((g) => g.ownership === "own");
    } else if (activeTab === "shared") {
      processed = processed.filter((g) => g.ownership === "shared");
    }

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
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-neutral-900">
                Group Monitoring
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                {activeTab === "all"
                  ? "All groups you can see"
                  : activeTab === "own"
                    ? "Groups created/owned by you"
                    : "Groups shared with you (membership groups)"}
              </p>
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

          {/* Ownership Tabs */}
          <div className="flex gap-6 border-b border-neutral-200 text-sm font-medium">
            {[
              { id: "all", label: "All Groups" },
              { id: "own", label: "My Created Groups" },
              { id: "shared", label: "Shared With Me" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                }`}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setSelectedIds([]);
                }}
              >
                {tab.label}
              </button>
            ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedGroups.map((group) => (
              <div
                key={group.id}
                className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 hover:bg-neutral-100/60 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-bold uppercase">
                      {group.name.substring(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">
                        {group.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {group.deviceCount} devices •{" "}
                        {group.ownership === "own" ? "My group" : "Shared"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-neutral-600 mb-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tags</span>
                    <span className="font-medium">{group.tags}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Valid</span>
                    <span className="font-medium">
                      {group.validatePeriodStart} → {group.validatePeriodEnd}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Alarms</span>
                    <span className="font-semibold">{group.alarms}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex -space-x-2">
                    {group.users.slice(0, 3).map((user, idx) => (
                      <img
                        key={idx}
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                      />
                    ))}
                    {group.users.length > 3 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-neutral-200 text-[10px] flex items-center justify-center text-neutral-700 font-medium">
                        +{group.users.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-2"
                    >
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-2"
                      onClick={() =>
                        window.open(
                          `/dashboard/groups/${group.id}/canvas`,
                          "_blank",
                        )
                      }
                    >
                      Canvas
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
