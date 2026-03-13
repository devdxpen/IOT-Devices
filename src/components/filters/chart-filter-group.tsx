"use client";

import { RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { analyticsAppConfig } from "@/config/appConfig";
import { toPlanLabel } from "@/data/mockData";
import type { AnalyticsFilterOptions, AnalyticsFilters } from "@/types/models";

type FilterField =
  | "dateRange"
  | "companyId"
  | "deviceType"
  | "location"
  | "subscriptionPlan";

interface ChartFilterGroupProps {
  filters: AnalyticsFilters;
  fields: FilterField[];
  options?: AnalyticsFilterOptions;
  onChange: (next: AnalyticsFilters) => void;
  onReset?: () => void;
  className?: string;
}

const formatLabel = (value: string) =>
  value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

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
      <SelectTrigger className="h-8 min-w-[140px] bg-card text-sm">
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

export function ChartFilterGroup({
  filters,
  fields,
  options,
  onChange,
  onReset,
  className,
}: ChartFilterGroupProps) {
  const fieldSet = useMemo(() => new Set(fields), [fields]);

  const updateFilter = <K extends keyof AnalyticsFilters>(
    key: K,
    value: AnalyticsFilters[K],
  ) => {
    const nextFilters: AnalyticsFilters = {
      ...filters,
      [key]: value,
    };

    if (key === "dateRange" && value !== "custom") {
      nextFilters.customStartDate = null;
      nextFilters.customEndDate = null;
    }

    onChange(nextFilters);
  };

  return (
    <div className={`flex flex-wrap items-center justify-end gap-2 ${className ?? ""}`}>
      {fieldSet.has("dateRange") && (
        <FilterSelect
          value={filters.dateRange}
          placeholder="Date Range"
          options={analyticsAppConfig.dateRangeOptions.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          onChange={(value) =>
            updateFilter("dateRange", value as AnalyticsFilters["dateRange"])
          }
        />
      )}

      {filters.dateRange === "custom" && fieldSet.has("dateRange") && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Custom dates
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 space-y-2 text-sm">
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">Start date</span>
              <input
                type="date"
                value={filters.customStartDate ?? ""}
                onChange={(event) =>
                  updateFilter("customStartDate", event.target.value)
                }
                className="h-8 w-full rounded-md border border-input bg-card px-2 text-sm outline-none ring-offset-background transition focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">End date</span>
              <input
                type="date"
                value={filters.customEndDate ?? ""}
                onChange={(event) =>
                  updateFilter("customEndDate", event.target.value)
                }
                className="h-8 w-full rounded-md border border-input bg-card px-2 text-sm outline-none ring-offset-background transition focus:ring-2 focus:ring-ring"
              />
            </label>
          </PopoverContent>
        </Popover>
      )}

      {fieldSet.has("companyId") && (
        <FilterSelect
          value={filters.companyId}
          placeholder="Company"
          options={[
            { value: "all", label: "All Companies" },
            ...(options?.companies ?? []).map((company) => ({
              value: company.id,
              label: company.name,
            })),
          ]}
          onChange={(value) => updateFilter("companyId", value)}
        />
      )}

      {fieldSet.has("deviceType") && (
        <FilterSelect
          value={filters.deviceType}
          placeholder="Device Type"
          options={[
            { value: "all", label: "All Device Types" },
            ...(options?.deviceTypes ?? []).map((type) => ({
              value: type,
              label: formatLabel(type),
            })),
          ]}
          onChange={(value) =>
            updateFilter("deviceType", value as AnalyticsFilters["deviceType"])
          }
        />
      )}

      {fieldSet.has("location") && (
        <FilterSelect
          value={filters.location}
          placeholder="Location"
          options={[
            { value: "all", label: "All Locations" },
            ...(options?.locations ?? []).map((location) => ({
              value: location,
              label: location,
            })),
          ]}
          onChange={(value) => updateFilter("location", value)}
        />
      )}

      {fieldSet.has("subscriptionPlan") && (
        <FilterSelect
          value={filters.subscriptionPlan}
          placeholder="Plan"
          options={[
            { value: "all", label: "All Plans" },
            ...(options?.subscriptionPlans ?? []).map((plan) => ({
              value: plan,
              label: toPlanLabel(plan),
            })),
          ]}
          onChange={(value) =>
            updateFilter(
              "subscriptionPlan",
              value as AnalyticsFilters["subscriptionPlan"],
            )
          }
        />
      )}

      {onReset && (
        <Button variant="ghost" size="sm" className="h-8" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
