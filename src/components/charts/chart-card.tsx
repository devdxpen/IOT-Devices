"use client";

import type { ApexOptions } from "apexcharts";
import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type ApexAxisChartSeries,
  ApexChart,
  type ApexNonAxisChartSeries,
  type DataPointSelection,
} from "./apex-chart";

interface AnalyticsChartCardProps {
  title: string;
  description?: string;
  type: "line" | "area" | "bar" | "donut" | "pie";
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  options?: ApexOptions;
  height?: number;
  actions?: React.ReactNode;
  className?: string;
}

function hasData(series: ApexAxisChartSeries | ApexNonAxisChartSeries) {
  if (!Array.isArray(series) || !series.length) {
    return false;
  }

  if (typeof series[0] === "number") {
    return (series as ApexNonAxisChartSeries).some((value) => value > 0);
  }

  return (series as ApexAxisChartSeries).some((item) =>
    item.data.some((value) => Number(value) > 0),
  );
}

export function AnalyticsChartCard({
  title,
  description,
  type,
  series,
  options,
  height = 320,
  actions,
  className,
}: AnalyticsChartCardProps) {
  const [selection, setSelection] = useState<DataPointSelection | null>(null);

  const isEmpty = useMemo(() => !hasData(series), [series]);

  return (
    <>
      <Card className={className}>
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-foreground">
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="rounded-md border border-border p-1.5 text-muted-foreground transition hover:bg-muted"
                  aria-label="Chart help"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={8}>
                Click a data point to drill down into details.
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {isEmpty ? (
            <div className="flex h-[220px] items-center justify-center rounded-md border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
              No chart data available for current filters.
            </div>
          ) : (
            <ApexChart
              type={type}
              series={series}
              options={options}
              height={height}
              onDataPointSelect={setSelection}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selection)} onOpenChange={() => setSelection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title} Drill-down</DialogTitle>
            <DialogDescription>
              Detailed value from the selected data point.
            </DialogDescription>
          </DialogHeader>

          {selection && (
            <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Series</span>
                <span className="font-medium text-foreground">
                  {selection.seriesName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Label</span>
                <span className="font-medium text-foreground">
                  {selection.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Value</span>
                <span className="font-medium text-foreground">
                  {selection.value}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
