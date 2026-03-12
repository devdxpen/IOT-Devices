import { AlertTriangle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsLoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["kpi-a", "kpi-b", "kpi-c", "kpi-d"].map((itemKey) => (
          <Skeleton key={itemKey} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-[320px] rounded-xl" />
        <Skeleton className="h-[320px] rounded-xl" />
      </div>
      <Skeleton className="h-[320px] rounded-xl" />
    </div>
  );
}

export function AnalyticsEmptyState({
  title,
  description,
  onReset,
}: {
  title: string;
  description: string;
  onReset: () => void;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/25 px-6 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      <Button className="mt-4" variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}

export function AnalyticsErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-error/30 bg-error/5 px-6 text-center">
      <div className="mb-4 rounded-full bg-error/10 p-3">
        <AlertTriangle className="h-6 w-6 text-error" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      <Button className="mt-4" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
