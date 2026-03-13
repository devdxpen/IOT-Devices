"use client";

import { useQuery } from "@tanstack/react-query";
import { useDemoSession } from "@/hooks/use-demo-session";
import { fetchAnalyticsFilterOptions } from "@/lib/api";

export function useAnalyticsFilterOptions() {
  const session = useDemoSession();

  return useQuery({
    queryKey: [
      "analytics",
      "filter-options",
      session?.role,
      session?.companyId,
      session?.userId,
    ],
    queryFn: fetchAnalyticsFilterOptions,
    enabled: Boolean(session),
  });
}
