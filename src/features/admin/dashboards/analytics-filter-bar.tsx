"use client";

import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilters;
  options: AnalyticsFilterOptions;
  onChange: (nextFilters: AnalyticsFilters) => void;
  onReset: () => void;
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
      <SelectTrigger className="h-9 border-slate-200 bg-white text-sm">
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

export function AnalyticsFilterBar({
  filters,
  options,
  onChange,
  onReset,
}: AnalyticsFilterBarProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <Filter className="h-4 w-4 text-slate-600" />
            Analytics Filters
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
        <FilterSelect
          value={filters.year}
          placeholder="Year"
          options={[
            { value: "2024", label: "Year 2024" },
            { value: "2025", label: "Year 2025" },
            { value: "2026", label: "Year 2026" },
          ]}
          onChange={(value) =>
            onChange({
              ...filters,
              year: value as AnalyticsFilters["year"],
            })
          }
        />

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
          onChange={(value) => onChange({ ...filters, company: value })}
        />

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
          onChange={(value) => onChange({ ...filters, location: value })}
        />

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
          onChange={(value) => onChange({ ...filters, deviceType: value })}
        />

        <FilterSelect
          value={filters.status}
          placeholder="Status"
          options={[
            { value: "all", label: "All Status" },
            { value: "online", label: "Online" },
            { value: "offline", label: "Offline" },
          ]}
          onChange={(value) =>
            onChange({
              ...filters,
              status: value as AnalyticsFilters["status"],
            })
          }
        />

        <FilterSelect
          value={filters.ownership}
          placeholder="Ownership"
          options={[
            { value: "all", label: "All Ownership" },
            { value: "own", label: "Owned" },
            { value: "shared", label: "Shared" },
          ]}
          onChange={(value) =>
            onChange({
              ...filters,
              ownership: value as AnalyticsFilters["ownership"],
            })
          }
        />

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
            onChange({
              ...filters,
              functionality: value as AnalyticsFilters["functionality"],
            })
          }
        />
      </CardContent>
    </Card>
  );
}
