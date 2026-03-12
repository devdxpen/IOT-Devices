"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApexOptions } from "apexcharts";
import Link from "next/link";
import {
  IoBusinessOutline,
  IoPeopleOutline,
  IoPulseOutline,
  IoServerOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { KpiGrid } from "@/components/cards/kpi-grid";
import { AnalyticsChartCard } from "@/components/charts/chart-card";
import { AnalyticsShell } from "@/components/layout/analytics-shell";
import {
  AnalyticsErrorState,
  AnalyticsLoadingState,
} from "@/components/layout/analytics-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsFilters } from "@/hooks/use-analytics-filters";
import { fetchOverviewAnalytics } from "@/lib/api";

const iconMap = {
  "overview-companies": IoBusinessOutline,
  "overview-users": IoPeopleOutline,
  "overview-devices": IoServerOutline,
  "overview-revenue": IoTrendingUpOutline,
  "overview-alerts": IoPulseOutline,
};

export function DashboardOverviewView() {
  const { filters, resetFilters } = useAnalyticsFilters((state) => ({
    filters: state.filters,
    resetFilters: state.resetFilters,
  }));

  const query = useQuery({
    queryKey: ["analytics", "overview", filters],
    queryFn: () => fetchOverviewAnalytics(filters),
  });

  const trendOptions: ApexOptions = {
    chart: {
      type: "area",
    },
    xaxis: {
      categories: query.data?.platformActivityTrend.categories,
    },
    yaxis: {
      labels: {
        formatter: (value) => `${Math.round(value)}`,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.2,
        opacityFrom: 0.4,
        opacityTo: 0.05,
      },
    },
  };

  const usageSplitOptions: ApexOptions = {
    labels: query.data?.platformUsageSplit.labels,
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: (value) => `${Number(value).toFixed(0)}%`,
    },
    stroke: {
      width: 0,
    },
  };

  return (
    <AnalyticsShell
      title="Platform Analytics Overview"
      description="A single command center for IoT platform performance across companies, devices, and users."
    >
      {query.isLoading ? (
        <AnalyticsLoadingState />
      ) : query.isError ? (
        <AnalyticsErrorState
          title="Unable to load overview analytics"
          description={
            query.error instanceof Error ? query.error.message : "Unknown error"
          }
          onRetry={() => query.refetch()}
        />
      ) : query.data ? (
        <>
          <KpiGrid
            metrics={query.data.kpis}
            iconMap={iconMap}
            columnsClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-5"
          />

          <section className="grid gap-4 xl:grid-cols-12">
            <AnalyticsChartCard
              className="xl:col-span-8"
              title="Platform Activity Trend"
              description="Active devices and users over the selected time window"
              type="area"
              options={trendOptions}
              series={query.data.platformActivityTrend.series}
              height={320}
            />

            <AnalyticsChartCard
              className="xl:col-span-4"
              title="Feature Usage Split"
              description="Core platform feature adoption"
              type="donut"
              options={usageSplitOptions}
              series={query.data.platformUsageSplit.series}
              height={320}
            />
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Device Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Monitor data usage, bandwidth trends, growth, and top device
                consumers.
                <Link
                  href="/device-analytics"
                  className="mt-3 inline-block font-medium text-primary hover:underline"
                >
                  Open Device Analytics
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">User Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Track user registrations, retention, uptime, feature adoption,
                and revenue.
                <Link
                  href="/user-analytics"
                  className="mt-3 inline-block font-medium text-primary hover:underline"
                >
                  Open User Analytics
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Company Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Compare growth, plan distribution, industry breakdown, and top
                active companies.
                <Link
                  href="/company-analytics"
                  className="mt-3 inline-block font-medium text-primary hover:underline"
                >
                  Open Company Analytics
                </Link>
              </CardContent>
            </Card>
          </section>
        </>
      ) : (
        <AnalyticsErrorState
          title="No overview data found"
          description="Try broadening filters to load analytics insights."
          onRetry={resetFilters}
        />
      )}
    </AnalyticsShell>
  );
}
