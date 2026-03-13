import {
  formatCompactNumber,
  formatHoursAsReadable,
  formatRelativeTime,
} from "@/lib/helpers";
import type { KpiMetric, AxisChartData, PieChartData } from "@/types/models";
import type {
  SupportTicket,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/types/support";

export const ticketStatusLabels: Record<SupportTicketStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  on_hold: "On Hold",
  resolved: "Resolved",
  closed: "Closed",
  cancelled: "Cancelled",
};

export const ticketPriorityLabels: Record<SupportTicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const ticketStatusStyles: Record<SupportTicketStatus, string> = {
  new: "bg-sky-50 text-sky-700 border-sky-200",
  in_progress: "bg-indigo-50 text-indigo-700 border-indigo-200",
  on_hold: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export const ticketPriorityStyles: Record<SupportTicketPriority, string> = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  critical: "bg-rose-50 text-rose-700 border-rose-200",
};

export const ticketSubjectOptions = [
  "Account Access",
  "Billing & Plan",
  "Connectivity",
  "Device Setup",
  "Integration Support",
  "Other",
];

export function isOpenStatus(status: SupportTicketStatus) {
  return status === "new" || status === "in_progress" || status === "on_hold";
}

export function formatSlaDue(dateString: string) {
  const value = new Date(dateString);
  if (Number.isNaN(value.valueOf())) {
    return "Unknown";
  }

  const diffMs = value.valueOf() - Date.now();
  const diffHours = Math.round(diffMs / 3600000);

  if (diffHours <= 0) {
    return "Overdue";
  }

  if (diffHours < 24) {
    return `${diffHours}h left`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d left`;
}

export function buildSupportMetrics(tickets: SupportTicket[]): KpiMetric[] {
  const openTickets = tickets.filter((ticket) => isOpenStatus(ticket.status));
  const unassigned = openTickets.filter((ticket) => !ticket.assignedAgentId);
  const onHold = tickets.filter((ticket) => ticket.status === "on_hold");
  const atRisk = tickets.filter((ticket) => ticket.sla.risk === "high");
  const resolutionHours = tickets
    .map((ticket) => ticket.resolutionTimeHours ?? null)
    .filter((value): value is number => value !== null);

  const avgResolution =
    resolutionHours.length > 0
      ? formatHoursAsReadable(
          resolutionHours.reduce((acc, value) => acc + value, 0) /
            resolutionHours.length,
        )
      : "N/A";

  return [
    {
      id: "open-tickets",
      label: "Open Tickets",
      value: formatCompactNumber(openTickets.length),
      delta: "+6.1%",
      trend: "up",
    },
    {
      id: "unassigned",
      label: "Unassigned",
      value: formatCompactNumber(unassigned.length),
      delta: "-2.4%",
      trend: "down",
      tone: "warning",
    },
    {
      id: "on-hold",
      label: "On Hold",
      value: formatCompactNumber(onHold.length),
      delta: "+1.2%",
      trend: "up",
      tone: "info",
    },
    {
      id: "sla-risk",
      label: "SLA Risk",
      value: formatCompactNumber(atRisk.length),
      delta: "-0.8%",
      trend: "down",
      tone: "danger",
    },
    {
      id: "avg-resolution",
      label: "Avg Resolution",
      value: avgResolution,
      delta: "+3.4%",
      trend: "up",
    },
  ];
}

export function buildSupportStatusSplit(
  tickets: SupportTicket[],
): PieChartData {
  const statusOrder: SupportTicketStatus[] = [
    "new",
    "in_progress",
    "on_hold",
    "resolved",
    "closed",
    "cancelled",
  ];

  return {
    labels: statusOrder.map((status) => ticketStatusLabels[status]),
    series: statusOrder.map(
      (status) => tickets.filter((ticket) => ticket.status === status).length,
    ),
  };
}

function dayLabels(lastDays = 7) {
  const now = new Date();
  return Array.from({ length: lastDays }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (lastDays - 1 - index));
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function buildSupportVolumeTrend(
  tickets: SupportTicket[],
  lastDays = 7,
): AxisChartData {
  const categories = dayLabels(lastDays);
  const now = new Date();

  const buckets = Array.from({ length: lastDays }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (lastDays - 1 - index));
    return date;
  });

  const created = buckets.map(
    (bucket) =>
      tickets.filter((ticket) =>
        isSameDay(new Date(ticket.createdAt), bucket),
      ).length,
  );

  const resolved = buckets.map(
    (bucket) =>
      tickets.filter((ticket) =>
        ticket.resolvedAt
          ? isSameDay(new Date(ticket.resolvedAt), bucket)
          : false,
      ).length,
  );

  return {
    categories,
    series: [
      { name: "Created", data: created },
      { name: "Resolved", data: resolved },
    ],
  };
}

export function buildResolutionByPriority(
  tickets: SupportTicket[],
): AxisChartData {
  const priorities: SupportTicketPriority[] = [
    "low",
    "medium",
    "high",
    "critical",
  ];

  const data = priorities.map((priority) => {
    const resolvedTickets = tickets.filter(
      (ticket) =>
        ticket.priority === priority && (ticket.resolutionTimeHours ?? 0) > 0,
    );
    if (!resolvedTickets.length) {
      return 0;
    }
    const average =
      resolvedTickets.reduce(
        (acc, ticket) => acc + (ticket.resolutionTimeHours ?? 0),
        0,
      ) / resolvedTickets.length;
    return Number(average.toFixed(1));
  });

  return {
    categories: priorities.map((priority) => ticketPriorityLabels[priority]),
    series: [{ name: "Avg Resolution (hrs)", data }],
  };
}

export function formatTicketActivity(dateString: string) {
  return formatRelativeTime(dateString);
}
