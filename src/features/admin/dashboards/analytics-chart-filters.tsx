"use client";

import { Filter, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AnalyticsFilterOptions,
  AnalyticsFilters,
} from "@/features/admin/dashboards/analytics-derived-data";

type FilterField =
  | "year"
  | "company"
  | "location"
  | "deviceType"
  | "status"
  | "ownership"
  | "functionality";

interface AnalyticsChartFiltersProps {
  filters: AnalyticsFilters;
  fields: FilterField[];
  options: AnalyticsFilterOptions;
  onChange: (nextFilters: AnalyticsFilters) => void;
  onReset?: () => void;
  className?: string;
}

function FilterSelect({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 min-w-[130px] border-slate-200 bg-white text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AnalyticsChartFilters({
  filters,
  fields,
  options,
  onChange,
  onReset,
  className,
}: AnalyticsChartFiltersProps) {
  const [open, setOpen] = useState(false);

  const updateFilter = <K extends keyof AnalyticsFilters>(
    key: K,
    value: AnalyticsFilters[K],
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const activeFields = useMemo(() => fields, [fields]);

  return (
    <div className={`flex flex-wrap items-center justify-end gap-2 ${className ?? ""}`}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </DialogTrigger>
        <DialogContent className="left-auto right-0 top-0 h-full w-full max-w-[360px] translate-x-0 translate-y-0 rounded-none border-l border-slate-200 bg-white p-0 data-[state=open]:slide-in-from-right-1/2 data-[state=closed]:slide-out-to-right-1/2">
          <div className="flex h-full flex-col">
            <DialogHeader className="border-b border-slate-200 px-5 py-4 text-left">
              <DialogTitle className="text-lg text-slate-900">
                Chart Filters
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 space-y-4 overflow-auto px-5 py-4">
              {activeFields.includes("year") && (
                <FilterSelect
                  value={filters.year}
                  placeholder="Year"
                  options={[
                    { value: "2024", label: "Year 2024" },
                    { value: "2025", label: "Year 2025" },
                    { value: "2026", label: "Year 2026" },
                  ]}
                  onChange={(value) =>
                    updateFilter("year", value as AnalyticsFilters["year"])
                  }
                />
              )}

              {activeFields.includes("company") && (
                <FilterSelect
                  value={filters.company}
                  placeholder="Company"
                  options={[
                    { value: "all", label: "All Companies" },
                    ...options.companies.map((company) => ({
                      value: company,
                      label: company,
                    })),
                  ]}
                  onChange={(value) => updateFilter("company", value)}
                />
              )}

              {activeFields.includes("location") && (
                <FilterSelect
                  value={filters.location}
                  placeholder="Location"
                  options={[
                    { value: "all", label: "All Locations" },
                    ...options.locations.map((location) => ({
                      value: location,
                      label: location,
                    })),
                  ]}
                  onChange={(value) => updateFilter("location", value)}
                />
              )}

              {activeFields.includes("deviceType") && (
                <FilterSelect
                  value={filters.deviceType}
                  placeholder="Device Type"
                  options={[
                    { value: "all", label: "All Device Types" },
                    ...options.deviceTypes.map((deviceType) => ({
                      value: deviceType,
                      label: deviceType,
                    })),
                  ]}
                  onChange={(value) => updateFilter("deviceType", value)}
                />
              )}

              {activeFields.includes("status") && (
                <FilterSelect
                  value={filters.status}
                  placeholder="Status"
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "online", label: "Online" },
                    { value: "offline", label: "Offline" },
                  ]}
                  onChange={(value) =>
                    updateFilter("status", value as AnalyticsFilters["status"])
                  }
                />
              )}

              {activeFields.includes("ownership") && (
                <FilterSelect
                  value={filters.ownership}
                  placeholder="Ownership"
                  options={[
                    { value: "all", label: "All Ownership" },
                    { value: "own", label: "Owned" },
                    { value: "shared", label: "Shared" },
                  ]}
                  onChange={(value) =>
                    updateFilter("ownership", value as AnalyticsFilters["ownership"])
                  }
                />
              )}

              {activeFields.includes("functionality") && (
                <FilterSelect
                  value={filters.functionality}
                  placeholder="Functionality"
                  options={[
                    { value: "all", label: "All Functionality" },
                    ...options.functionalities.map((item) => ({
                      value: item,
                      label: item,
                    })),
                  ]}
                  onChange={(value) =>
                    updateFilter(
                      "functionality",
                      value as AnalyticsFilters["functionality"],
                    )
                  }
                />
              )}
            </div>

            <DialogFooter className="border-t border-slate-200 px-5 py-4">
              <div className="flex w-full items-center justify-between gap-2">
                {onReset && (
                  <Button variant="ghost" onClick={onReset}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                )}
                <Button onClick={() => setOpen(false)}>Done</Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
