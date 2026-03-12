import { IoArrowDown, IoArrowUp, IoRemove } from "react-icons/io5";
import type { IconType } from "react-icons/lib";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { KpiMetric } from "@/types/models";

interface KpiCardProps {
  metric: KpiMetric;
  icon: IconType;
}

const toneClasses: Record<string, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-error/15 text-error",
  info: "bg-info/15 text-info",
};

export function KpiCard({ metric, icon: Icon }: KpiCardProps) {
  const trendIcon =
    metric.trend === "up" ? (
      <IoArrowUp className="h-3 w-3" />
    ) : metric.trend === "down" ? (
      <IoArrowDown className="h-3 w-3" />
    ) : (
      <IoRemove className="h-3 w-3" />
    );

  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {metric.value}
            </p>
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {trendIcon}
              {metric.delta}
            </p>
          </div>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              toneClasses[metric.tone ?? "default"],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
