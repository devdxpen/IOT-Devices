"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  List,
  Grid,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  mockIoTUsers,
  LOCATIONS,
  DEVICE_TYPES,
  INDUSTRIES,
  SUBSCRIPTION_PLANS,
  type IoTUser,
} from "@/data/mock-iot-users";

// ─── Types ───────────────────────────────────────────────────────────────────

type SortField = keyof IoTUser;
type SortDir = "asc" | "desc" | null;

interface SortState {
  field: SortField | null;
  dir: SortDir;
}

interface Filters {
  industry: string;
  region: string;
  subscription: string;
  storageGreaterThan: string;
  storageLessThan: string;
  deviceRangeTo: string;
  smsGreaterThan: string;
  smsLessThan: string;
  emailGreaterThan: string;
  emailLessThan: string;
  lastLogins: string;
  systemUsage: string;
  status: string;
}

const defaultFilters: Filters = {
  industry: "all",
  region: "all",
  subscription: "all",
  storageGreaterThan: "all",
  storageLessThan: "all",
  deviceRangeTo: "all",
  smsGreaterThan: "all",
  smsLessThan: "all",
  emailGreaterThan: "all",
  emailLessThan: "all",
  lastLogins: "all",
  systemUsage: "all",
  status: "all",
};

// ─── Progress Bar Sub-component ──────────────────────────────────────────────

function MiniProgress({
  used,
  total,
  suffix = "",
}: {
  used: number;
  total: number;
  suffix?: string;
}) {
  const pct = Math.min((used / total) * 100, 100);
  return (
    <div className="flex flex-col gap-0.5 w-[90px]">
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
        <span>
          {used}
          {suffix}
        </span>
        <span>
          {total}
          {suffix}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-sky-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Sortable Header Button ─────────────────────────────────────────────────

function SortableHeader({
  label,
  field,
  sort,
  onSort,
}: {
  label: string;
  field: SortField;
  sort: SortState;
  onSort: (f: SortField) => void;
}) {
  return (
    <button
      className="flex items-center gap-1 text-sm font-normal text-neutral-500 hover:text-neutral-800 transition-colors whitespace-nowrap"
      onClick={() => onSort(field)}
    >
      {label}
      <ArrowUpDown
        className={cn(
          "h-3.5 w-3.5",
          sort.field === field ? "text-sky-500" : "text-neutral-400",
        )}
      />
    </button>
  );
}

// ─── Filter Drawer ──────────────────────────────────────────────────────────

function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onReset,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onApply: () => void;
  onReset: () => void;
}) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[420px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <h3 className="text-xl font-semibold text-neutral-900">Filters</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Fields — Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Industry */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Industry
            </label>
            <Select
              value={filters.industry}
              onValueChange={(v) => onFilterChange("industry", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select industry</SelectItem>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Region
            </label>
            <Select
              value={filters.region}
              onValueChange={(v) => onFilterChange("region", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select region</SelectItem>
                {LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subscriptions */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Subscriptions
            </label>
            <Select
              value={filters.subscription}
              onValueChange={(v) => onFilterChange("subscription", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select plan</SelectItem>
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Storage Greater than */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Storage Greater than
            </label>
            <Select
              value={filters.storageGreaterThan}
              onValueChange={(v) => onFilterChange("storageGreaterThan", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Enter storage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Enter storage</SelectItem>
                <SelectItem value="25">25 MB</SelectItem>
                <SelectItem value="50">50 MB</SelectItem>
                <SelectItem value="75">75 MB</SelectItem>
                <SelectItem value="100">100 MB</SelectItem>
                <SelectItem value="125">125 MB</SelectItem>
                <SelectItem value="150">150 MB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Storage Less than */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Storage Less than
            </label>
            <Select
              value={filters.storageLessThan}
              onValueChange={(v) => onFilterChange("storageLessThan", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Enter storage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Enter storage</SelectItem>
                <SelectItem value="50">50 MB</SelectItem>
                <SelectItem value="75">75 MB</SelectItem>
                <SelectItem value="100">100 MB</SelectItem>
                <SelectItem value="125">125 MB</SelectItem>
                <SelectItem value="150">150 MB</SelectItem>
                <SelectItem value="200">200 MB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Device range form to */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Device rage form to
            </label>
            <Select
              value={filters.deviceRangeTo}
              onValueChange={(v) => onFilterChange("deviceRangeTo", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select status</SelectItem>
                {DEVICE_TYPES.map((dt) => (
                  <SelectItem key={dt} value={dt}>
                    {dt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SMS Greater than */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              SMS Greater than
            </label>
            <Select
              value={filters.smsGreaterThan}
              onValueChange={(v) => onFilterChange("smsGreaterThan", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Enter SMS count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Enter SMS count</SelectItem>
                <SelectItem value="15">15k</SelectItem>
                <SelectItem value="20">20k</SelectItem>
                <SelectItem value="40">40k</SelectItem>
                <SelectItem value="60">60k</SelectItem>
                <SelectItem value="80">80k</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SMS Less than */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              SMS Less than
            </label>
            <Select
              value={filters.smsLessThan}
              onValueChange={(v) => onFilterChange("smsLessThan", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Enter SMS count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Enter SMS count</SelectItem>
                <SelectItem value="20">20k</SelectItem>
                <SelectItem value="30">30k</SelectItem>
                <SelectItem value="40">40k</SelectItem>
                <SelectItem value="60">60k</SelectItem>
                <SelectItem value="80">80k</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email Greater than */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Email Greater than
            </label>
            <Select
              value={filters.emailGreaterThan}
              onValueChange={(v) => onFilterChange("emailGreaterThan", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Enter email count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Enter email count</SelectItem>
                <SelectItem value="15">15k</SelectItem>
                <SelectItem value="20">20k</SelectItem>
                <SelectItem value="40">40k</SelectItem>
                <SelectItem value="60">60k</SelectItem>
                <SelectItem value="80">80k</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email Less than */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Email Less than
            </label>
            <Select
              value={filters.emailLessThan}
              onValueChange={(v) => onFilterChange("emailLessThan", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Enter email count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Enter email count</SelectItem>
                <SelectItem value="20">20k</SelectItem>
                <SelectItem value="30">30k</SelectItem>
                <SelectItem value="40">40k</SelectItem>
                <SelectItem value="60">60k</SelectItem>
                <SelectItem value="80">80k</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Last logins */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Last logins
            </label>
            <Select
              value={filters.lastLogins}
              onValueChange={(v) => onFilterChange("lastLogins", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select status</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* System Usage */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              System Usage
            </label>
            <Select
              value={filters.systemUsage}
              onValueChange={(v) => onFilterChange("systemUsage", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select status</SelectItem>
                <SelectItem value="low">Low (&lt;500 hrs)</SelectItem>
                <SelectItem value="medium">Medium (500–1000 hrs)</SelectItem>
                <SelectItem value="high">High (&gt;1000 hrs)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(v) => onFilterChange("status", v)}
            >
              <SelectTrigger className="h-11 w-full border-neutral-200 bg-neutral-50 text-sm rounded-lg">
                <SelectValue placeholder="Select account status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select account status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-white">
          <Button
            variant="outline"
            className="h-10 px-6 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium"
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            className="h-10 px-6 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg font-medium"
            onClick={onApply}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function AdminHelpDashboard() {
  // View state
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters });
  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    ...defaultFilters,
  });

  // Sorting
  const [sort, setSort] = useState<SortState>({ field: null, dir: null });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sort handler
  const handleSort = useCallback((field: SortField) => {
    setSort((prev) => {
      if (prev.field === field) {
        if (prev.dir === "asc") return { field, dir: "desc" as SortDir };
        if (prev.dir === "desc")
          return { field: null, dir: null as SortDir } as SortState;
      }
      return { field, dir: "asc" as SortDir };
    });
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback(
    (key: keyof Filters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
    setShowFilters(false);
  }, [filters]);

  const handleResetFilters = useCallback(() => {
    setFilters({ ...defaultFilters });
    setAppliedFilters({ ...defaultFilters });
    setCurrentPage(1);
  }, []);

  // Derived data
  const filteredAndSorted = useMemo(() => {
    let data = [...mockIoTUsers];

    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.toLowerCase().includes(q),
      );
    }

    // Drawer Filters
    if (appliedFilters.industry !== "all") {
      data = data.filter((u) => u.industry === appliedFilters.industry);
    }
    if (appliedFilters.region !== "all") {
      data = data.filter((u) => u.location === appliedFilters.region);
    }
    if (appliedFilters.subscription !== "all") {
      data = data.filter(
        (u) => u.subscriptionPlan === appliedFilters.subscription,
      );
    }
    if (appliedFilters.storageGreaterThan !== "all") {
      const threshold = Number(appliedFilters.storageGreaterThan);
      data = data.filter((u) => u.storageUsedMB > threshold);
    }
    if (appliedFilters.storageLessThan !== "all") {
      const threshold = Number(appliedFilters.storageLessThan);
      data = data.filter((u) => u.storageUsedMB < threshold);
    }
    if (appliedFilters.deviceRangeTo !== "all") {
      data = data.filter((u) => u.deviceType === appliedFilters.deviceRangeTo);
    }
    if (appliedFilters.smsGreaterThan !== "all") {
      const threshold = Number(appliedFilters.smsGreaterThan);
      data = data.filter((u) => u.smsUsedK > threshold);
    }
    if (appliedFilters.smsLessThan !== "all") {
      const threshold = Number(appliedFilters.smsLessThan);
      data = data.filter((u) => u.smsUsedK < threshold);
    }
    if (appliedFilters.emailGreaterThan !== "all") {
      const threshold = Number(appliedFilters.emailGreaterThan);
      data = data.filter((u) => u.emailUsedK > threshold);
    }
    if (appliedFilters.emailLessThan !== "all") {
      const threshold = Number(appliedFilters.emailLessThan);
      data = data.filter((u) => u.emailUsedK < threshold);
    }
    if (appliedFilters.systemUsage !== "all") {
      if (appliedFilters.systemUsage === "low") {
        data = data.filter((u) => u.systemUsageHrs < 500);
      } else if (appliedFilters.systemUsage === "medium") {
        data = data.filter(
          (u) => u.systemUsageHrs >= 500 && u.systemUsageHrs <= 1000,
        );
      } else if (appliedFilters.systemUsage === "high") {
        data = data.filter((u) => u.systemUsageHrs > 1000);
      }
    }
    if (appliedFilters.status !== "all") {
      data = data.filter((u) => u.status === appliedFilters.status);
    }

    // Sort
    if (sort.field && sort.dir) {
      const { field, dir } = sort;
      data.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return dir === "asc" ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return dir === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return data;
  }, [searchTerm, appliedFilters, sort]);

  // Pagination calculations
  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Reset page when search or page size changes
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (val: string) => {
    setPageSize(Number(val));
    setCurrentPage(1);
  };

  // Page numbers to render
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage, "...", totalPages);
    }
    return pages;
  };

  // Active filter count for badge
  const activeFilterCount = Object.values(appliedFilters).filter(
    (v) => v !== "all",
  ).length;

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        {/* ─── Card Heading ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b border-neutral-200 gap-3">
          {/* Title */}
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-neutral-800">
              IoT User Management
            </h2>
            <p className="text-xs text-neutral-500">List View</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial sm:w-[237px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-10 bg-neutral-50 border-neutral-200 rounded"
              />
            </div>

            {/* Filters toggle */}
            <Button
              variant="outline"
              className={cn(
                "h-10 px-3 border-neutral-200 rounded gap-1.5 relative",
                showFilters && "bg-sky-50 border-sky-200 text-sky-700",
              )}
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* List / Grid toggle */}
            <div className="flex items-center p-0.5 bg-white border border-neutral-200 rounded">
              <button
                className={cn(
                  "flex items-center justify-center rounded size-9 transition-all",
                  viewMode === "list"
                    ? "bg-sky-500 text-white"
                    : "text-neutral-500 hover:text-neutral-700",
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                className={cn(
                  "flex items-center justify-center rounded size-9 transition-all",
                  viewMode === "grid"
                    ? "bg-sky-500 text-white"
                    : "text-neutral-500 hover:text-neutral-700",
                )}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Table ────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200">
                <th className="px-3 py-2">
                  <SortableHeader
                    label="Username"
                    field="name"
                    sort={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-2">
                  <SortableHeader
                    label="Contact"
                    field="email"
                    sort={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-2">
                  <SortableHeader
                    label="Subscription Plan"
                    field="subscriptionPlan"
                    sort={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-2">
                  <SortableHeader
                    label="Devices"
                    field="devicesUsed"
                    sort={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-2">
                  <SortableHeader
                    label="Storage"
                    field="storageUsedMB"
                    sort={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-2">
                  <SortableHeader
                    label="SMS"
                    field="smsUsedK"
                    sort={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-2">
                  <SortableHeader
                    label="Email"
                    field="emailUsedK"
                    sort={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-2">
                  <SortableHeader
                    label="Last Login Date"
                    field="lastLoginDate"
                    sort={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-2">
                  <SortableHeader
                    label="System Usage"
                    field="systemUsageHrs"
                    sort={sort}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-3 py-2 text-sm font-normal text-neutral-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-12 text-neutral-400 text-sm"
                  >
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
              {paginatedData.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-neutral-100 hover:bg-neutral-50/60 transition-colors"
                >
                  {/* Username */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-9 w-9 border border-white ring-1 ring-neutral-200">
                        <AvatarFallback className="text-xs font-medium bg-neutral-100 text-neutral-600">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-900">
                          {user.name}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col text-sm text-neutral-800 font-medium">
                      <span className="truncate max-w-[160px]">
                        {user.email}
                      </span>
                      <span>{user.phone}</span>
                    </div>
                  </td>

                  {/* Subscription */}
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col text-sm text-neutral-800 font-medium">
                      <span>{user.subscriptionPlan}</span>
                      <span className="text-neutral-500">
                        Expires: {user.subscriptionExpiry}
                      </span>
                    </div>
                  </td>

                  {/* Devices */}
                  <td className="px-3 py-2.5">
                    <MiniProgress
                      used={user.devicesUsed}
                      total={user.devicesTotal}
                    />
                  </td>

                  {/* Storage */}
                  <td className="px-3 py-2.5">
                    <MiniProgress
                      used={user.storageUsedMB}
                      total={user.storageTotalMB}
                      suffix="MB"
                    />
                  </td>

                  {/* SMS */}
                  <td className="px-3 py-2.5">
                    <MiniProgress
                      used={user.smsUsedK}
                      total={user.smsTotalK}
                      suffix="k"
                    />
                  </td>

                  {/* Email */}
                  <td className="px-3 py-2.5">
                    <MiniProgress
                      used={user.emailUsedK}
                      total={user.emailTotalK}
                      suffix="k"
                    />
                  </td>

                  {/* Last Login */}
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col text-sm font-medium text-neutral-900">
                      <span>{user.lastLoginDate}</span>
                      <span>{user.lastLoginTime}</span>
                    </div>
                  </td>

                  {/* System Usage */}
                  <td className="px-3 py-2.5 text-sm font-medium text-neutral-900">
                    {user.systemUsageHrs} hrs
                  </td>

                  {/* Action */}
                  <td className="px-3 py-2.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-neutral-200 text-neutral-500 hover:text-sky-600 hover:border-sky-200"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-3 py-3 bg-neutral-50 border-t border-neutral-200">
          {/* Show count */}
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <span>Show</span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[65px] border-neutral-200 bg-white text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((s) => (
                  <SelectItem key={s} value={s.toString()}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-neutral-500">of {totalItems}</span>
          </div>

          {/* Page buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 pl-2 border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span
                  key={`dot-${idx}`}
                  className="h-8 w-8 flex items-center justify-center text-neutral-400 text-xs"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={`p-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    currentPage === page
                      ? "bg-sky-500 hover:bg-sky-600 text-white border-sky-500"
                      : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
                  )}
                  onClick={() => setCurrentPage(page as number)}
                >
                  {page}
                </Button>
              ),
            )}

            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 pr-2 border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Filter Drawer (slides from right) ────────────────────────── */}
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
}
