"use client";

import { Filter, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { analyticsFilterOptions, toPlanLabel } from "@/data/mockData";
import { useAnalyticsFilters } from "@/hooks/use-analytics-filters";

const formatLabel = (value: string) =>
  value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-full bg-card">
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

export function GlobalFilterBar() {
  const { filters, setFilter, resetFilters } = useAnalyticsFilters((state) => ({
    filters: state.filters,
    setFilter: state.setFilter,
    resetFilters: state.resetFilters,
  }));

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.dateRange !== "month") count += 1;
    if (filters.companyId !== "all") count += 1;
    if (filters.deviceType !== "all") count += 1;
    if (filters.location !== "all") count += 1;
    if (filters.subscriptionPlan !== "all") count += 1;
    if (
      filters.dateRange === "custom" &&
      filters.customStartDate &&
      filters.customEndDate
    ) {
      count += 1;
    }
    return count;
  }, [filters]);

  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-md bg-primary/10 px-2.5 py-1 text-sm text-primary">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Global Filters</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {activeFilterCount} active
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground transition hover:text-foreground"
                  aria-label="Filter guidance"
                >
                  <IoInformationCircleOutline className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="max-w-xs text-sm">
                These filters are shared across all analytics routes, so charts
                and tables stay in sync while you switch between sections.
              </PopoverContent>
            </Popover>
          </div>

          <Button variant="outline" size="sm" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <FilterSelect
            value={filters.dateRange}
            onChange={(value) =>
              setFilter("dateRange", value as typeof filters.dateRange)
            }
            placeholder="Date Range"
            options={analyticsAppConfig.dateRangeOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />

          <FilterSelect
            value={filters.companyId}
            onChange={(value) => setFilter("companyId", value)}
            placeholder="Company"
            options={[
              { value: "all", label: "All Companies" },
              ...analyticsFilterOptions.companies.map((company) => ({
                value: company.id,
                label: company.name,
              })),
            ]}
          />

          <FilterSelect
            value={filters.deviceType}
            onChange={(value) =>
              setFilter("deviceType", value as typeof filters.deviceType)
            }
            placeholder="Device Type"
            options={[
              { value: "all", label: "All Device Types" },
              ...analyticsFilterOptions.deviceTypes.map((type) => ({
                value: type,
                label: formatLabel(type),
              })),
            ]}
          />

          <FilterSelect
            value={filters.location}
            onChange={(value) => setFilter("location", value)}
            placeholder="Location"
            options={[
              { value: "all", label: "All Locations" },
              ...analyticsFilterOptions.locations.map((location) => ({
                value: location,
                label: location,
              })),
            ]}
          />

          <FilterSelect
            value={filters.subscriptionPlan}
            onChange={(value) =>
              setFilter(
                "subscriptionPlan",
                value as typeof filters.subscriptionPlan,
              )
            }
            placeholder="Subscription"
            options={[
              { value: "all", label: "All Plans" },
              ...analyticsFilterOptions.subscriptionPlans.map((plan) => ({
                value: plan,
                label: toPlanLabel(plan),
              })),
            ]}
          />
        </div>

        {filters.dateRange === "custom" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Custom start date</span>
              <input
                type="date"
                value={filters.customStartDate ?? ""}
                onChange={(event) =>
                  setFilter("customStartDate", event.target.value)
                }
                className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm outline-none ring-offset-background transition focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Custom end date</span>
              <input
                type="date"
                value={filters.customEndDate ?? ""}
                onChange={(event) =>
                  setFilter("customEndDate", event.target.value)
                }
                className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm outline-none ring-offset-background transition focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
