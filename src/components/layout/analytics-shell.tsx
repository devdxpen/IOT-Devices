import { Activity } from "lucide-react";
import { analyticsAppConfig } from "@/config/appConfig";
import { AnalyticsSectionTabs } from "./analytics-section-tabs";

interface AnalyticsShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AnalyticsShell({
  title,
  description,
  children,
}: AnalyticsShellProps) {
  return (
    <div className="space-y-6 pb-2">
      <header className="space-y-3 rounded-xl border border-border/70 bg-card p-5 shadow-xs">
        <div className="flex items-center gap-2 text-sm text-primary">
          <Activity className="h-4 w-4" />
          <span className="font-medium">
            {analyticsAppConfig.dashboardName}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
      </header>

      <AnalyticsSectionTabs />

      <div className="space-y-6">{children}</div>
    </div>
  );
}
