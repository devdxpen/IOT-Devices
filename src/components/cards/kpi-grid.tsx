import type { IconType } from "react-icons/lib";
import type { KpiMetric } from "@/types/models";
import { KpiCard } from "./kpi-card";

interface KpiGridProps {
  metrics: KpiMetric[];
  iconMap: Record<string, IconType>;
  columnsClassName?: string;
}

export function KpiGrid({
  metrics,
  iconMap,
  columnsClassName = "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
}: KpiGridProps) {
  return (
    <section className={`grid gap-4 ${columnsClassName}`}>
      {metrics.map((metric) => {
        const Icon = iconMap[metric.id];
        if (!Icon) {
          return null;
        }

        return <KpiCard key={metric.id} metric={metric} icon={Icon} />;
      })}
    </section>
  );
}
