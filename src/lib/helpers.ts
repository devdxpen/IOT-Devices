import type { AnalyticsFilters, DateRangePreset } from "@/types/models";

export interface DateWindow {
  start: Date;
  end: Date;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function offsetDate(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

export function resolveDateWindow(filters: AnalyticsFilters): DateWindow {
  const now = new Date();
  const end = endOfDay(now);

  if (filters.dateRange === "custom") {
    if (!filters.customStartDate || !filters.customEndDate) {
      throw new Error("Custom date range needs both start and end dates.");
    }

    const start = startOfDay(new Date(filters.customStartDate));
    const customEnd = endOfDay(new Date(filters.customEndDate));

    if (Number.isNaN(start.valueOf()) || Number.isNaN(customEnd.valueOf())) {
      throw new Error("Custom date range contains invalid dates.");
    }

    if (start > customEnd) {
      throw new Error("Custom start date cannot be after the end date.");
    }

    return { start, end: customEnd };
  }

  if (filters.dateRange === "today") {
    return { start: startOfDay(now), end };
  }

  if (filters.dateRange === "week") {
    return { start: startOfDay(offsetDate(now, -6)), end };
  }

  if (filters.dateRange === "month") {
    return { start: startOfDay(offsetDate(now, -29)), end };
  }

  return { start: startOfDay(offsetDate(now, -364)), end };
}

export function isDateInRange(dateString: string, window: DateWindow) {
  const value = new Date(dateString);
  if (Number.isNaN(value.valueOf())) {
    return false;
  }

  return value >= window.start && value <= window.end;
}

function monthFormatter(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short" });
}

function dayFormatter(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getTimeCategories(
  dateRange: DateRangePreset,
  customWindow?: DateWindow,
): string[] {
  const now = new Date();

  if (dateRange === "today") {
    return ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
  }

  if (dateRange === "week") {
    return Array.from({ length: 7 }, (_, index) => {
      const date = offsetDate(now, index - 6);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    });
  }

  if (dateRange === "month") {
    return ["Week 1", "Week 2", "Week 3", "Week 4"];
  }

  if (dateRange === "custom" && customWindow) {
    const totalDays = Math.max(
      1,
      Math.ceil(
        (customWindow.end.valueOf() - customWindow.start.valueOf()) / 86400000,
      ),
    );

    if (totalDays <= 12) {
      return Array.from({ length: totalDays + 1 }, (_, index) =>
        dayFormatter(offsetDate(customWindow.start, index)),
      );
    }

    const bucketCount = 8;
    const bucketSize = Math.max(1, Math.floor(totalDays / bucketCount));
    return Array.from({ length: bucketCount }, (_, index) => {
      const cursor = offsetDate(customWindow.start, index * bucketSize);
      return dayFormatter(cursor);
    });
  }

  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
}

export function buildTrendValues(
  points: number,
  baseValue: number,
  options?: {
    growth?: number;
    volatility?: number;
    floor?: number;
    precision?: number;
  },
) {
  const growth = options?.growth ?? 0;
  const volatility = options?.volatility ?? 0;
  const floor = options?.floor ?? 0;
  const precision = options?.precision ?? 0;

  return Array.from({ length: points }, (_, index) => {
    const wave =
      Math.sin(index * 1.2) * volatility +
      Math.cos(index * 0.55) * (volatility * 0.5);
    const linear = baseValue + growth * index;
    const total = Math.max(floor, linear + wave);

    if (precision === 0) {
      return Math.round(total);
    }

    const divisor = 10 ** precision;
    return Math.round(total * divisor) / divisor;
  });
}

export function sum(values: number[]) {
  return values.reduce((acc, value) => acc + value, 0);
}

export function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return sum(values) / values.length;
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDataUsage(valueGb: number) {
  if (valueGb >= 1024) {
    return `${(valueGb / 1024).toFixed(1)} TB`;
  }

  return `${valueGb.toFixed(1)} GB`;
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatDate(dateString: string) {
  const value = new Date(dateString);
  if (Number.isNaN(value.valueOf())) {
    return "N/A";
  }

  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.valueOf())) {
    return "Unknown";
  }

  const diffMs = Date.now() - date.valueOf();
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffHours < 1) {
    return "just now";
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function formatHoursAsReadable(hours: number) {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes}m`;
}

export function monthLabelsFromCurrentYear() {
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  return Array.from({ length: 12 }, (_, index) =>
    monthFormatter(new Date(yearStart.getFullYear(), index, 1)),
  );
}
