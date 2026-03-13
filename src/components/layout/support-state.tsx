import { FiAlertTriangle, FiInbox } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function SupportLoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["kpi-1", "kpi-2", "kpi-3", "kpi-4"].map((item) => (
          <Skeleton key={item} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-[320px] rounded-xl xl:col-span-2" />
        <Skeleton className="h-[320px] rounded-xl" />
      </div>
      <Skeleton className="h-[420px] rounded-xl" />
    </div>
  );
}

export function SupportEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <FiInbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction ? (
        <Button className="mt-4" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function SupportErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-error/30 bg-error/5 px-6 text-center">
      <div className="mb-4 rounded-full bg-error/10 p-3">
        <FiAlertTriangle className="h-6 w-6 text-error" />
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
