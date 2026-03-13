import type { SessionUser } from "@/types/access-control";
import { snapshotApi } from "@/lib/mock-api/access-control";
import type {
  SupportTicket,
  SupportTicketCreateInput,
  SupportTicketMessage,
  SupportTicketStatus,
  SupportTicketSummary,
} from "@/types/support";

const now = new Date();

function hoursAgo(hours: number) {
  const date = new Date(now);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

function hoursFromNow(hours: number) {
  const date = new Date(now);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

function daysAgo(days: number) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function buildTicketSummary(tickets: SupportTicket[]): SupportTicketSummary {
  const openStatuses: SupportTicketStatus[] = [
    "new",
    "in_progress",
    "on_hold",
  ];
  const resolvedStatuses: SupportTicketStatus[] = ["resolved", "closed"];
  return {
    total: tickets.length,
    open: tickets.filter((ticket) => openStatuses.includes(ticket.status)).length,
    resolved: tickets.filter((ticket) =>
      resolvedStatuses.includes(ticket.status),
    ).length,
    closed: tickets.filter((ticket) => ticket.status === "closed").length,
  };
}

const dataset = snapshotApi.getDataset();
const companyById = new Map(dataset.companies.map((company) => [company.id, company]));
const userById = new Map(dataset.iotUsers.map((user) => [user.id, user]));

const independentRequester = {
  id: "iot-independent-001",
  name: "Nora Lin",
  email: "nora.lin@fieldops.io",
  phone: "+1 415 555 1189",
  companyId: null,
  companyName: undefined,
};

function createTicketSeed(
  id: string,
  requesterId: string | null,
  overrides: Partial<SupportTicket> = {},
): SupportTicket {
  const requester =
    requesterId && userById.has(requesterId)
      ? userById.get(requesterId)
      : null;
  const company = requester?.companyId ? companyById.get(requester.companyId) : null;
  return {
    category: overrides.category ?? "General",
    id,
    subject: overrides.subject ?? "Device connectivity issue",
    description:
      overrides.description ??
      "Ticket raised from IoT portal. Engineer to verify diagnostics and reply.",
    status: overrides.status ?? "new",
    priority: overrides.priority ?? "medium",
    requesterType: overrides.requesterType ?? "iot_user",
    createdAt: overrides.createdAt ?? hoursAgo(6),
    updatedAt: overrides.updatedAt ?? hoursAgo(1),
    resolvedAt: overrides.resolvedAt ?? null,
    resolutionTimeHours: overrides.resolutionTimeHours ?? null,
    feedbackRating: overrides.feedbackRating ?? null,
    companyId: overrides.companyId ?? (company?.id ?? null),
    companyName: overrides.companyName ?? company?.name,
    requester: overrides.requester ?? {
      id: requester?.id ?? independentRequester.id,
      name: requester?.fullName ?? independentRequester.name,
      email: requester?.email ?? independentRequester.email,
      phone: requester?.mobile ?? independentRequester.phone,
      companyId: company?.id ?? null,
      companyName: company?.name,
    },
    assignedAgentId: overrides.assignedAgentId ?? null,
    assignedAgentName: overrides.assignedAgentName ?? null,
    tags: overrides.tags ?? ["connectivity"],
    channel: overrides.channel ?? "portal",
    sla: overrides.sla ?? {
      responseDueAt: hoursFromNow(4),
      risk: "medium",
    },
    resolutionNote: overrides.resolutionNote ?? null,
  };
}

let supportTickets: SupportTicket[] = [
  createTicketSeed("TCK-1001", dataset.iotUsers[0]?.id ?? null, {
    subject: "Gateway stuck offline after firmware update",
    category: "Connectivity",
    priority: "high",
    tags: ["firmware", "offline"],
    createdAt: hoursAgo(5),
    sla: { responseDueAt: hoursFromNow(2), risk: "high" },
  }),
  createTicketSeed("TCK-1002", dataset.iotUsers[1]?.id ?? null, {
    subject: "Telemetry spikes triggering false alerts",
    category: "Alerts",
    status: "in_progress",
    assignedAgentId: "cmp-zen-agent-001",
    assignedAgentName: "Aarav Singh",
    tags: ["telemetry", "alerts"],
    createdAt: hoursAgo(14),
    updatedAt: hoursAgo(2),
    sla: { responseDueAt: hoursFromNow(6), risk: "medium" },
  }),
  createTicketSeed("TCK-1003", dataset.iotUsers[3]?.id ?? null, {
    subject: "Battery drain warning on sensor cluster",
    category: "Maintenance",
    status: "on_hold",
    priority: "high",
    assignedAgentId: "cmp-aqua-agent-001",
    assignedAgentName: "Rohan Verma",
    tags: ["battery", "maintenance"],
    createdAt: hoursAgo(22),
    updatedAt: hoursAgo(3),
    sla: { responseDueAt: hoursFromNow(10), risk: "low" },
  }),
  createTicketSeed("TCK-1004", dataset.iotUsers[4]?.id ?? null, {
    subject: "Connectivity dropouts on edge controller",
    category: "Connectivity",
    status: "resolved",
    priority: "critical",
    assignedAgentId: "cmp-aqua-agent-002",
    assignedAgentName: "Elena Ortiz",
    tags: ["connectivity", "edge"],
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(7),
    resolvedAt: hoursAgo(6),
    resolutionTimeHours: 12.5,
    sla: { responseDueAt: hoursFromNow(12), risk: "low" },
    resolutionNote:
      "Reconfigured LTE fallback profile and pushed firmware patch v3.4.4.",
  }),
  createTicketSeed("TCK-2001", null, {
    subject: "Independent device not syncing data",
    category: "Data Sync",
    status: "new",
    priority: "critical",
    tags: ["sync", "offline"],
    createdAt: hoursAgo(3),
    sla: { responseDueAt: hoursFromNow(1), risk: "high" },
    companyId: null,
    requester: independentRequester,
    requesterType: "iot_user",
  }),
  createTicketSeed("TCK-2002", null, {
    subject: "Public API key rotation assistance",
    category: "Security",
    status: "in_progress",
    priority: "medium",
    tags: ["security", "api"],
    assignedAgentId: "admin-001",
    assignedAgentName: "Meera Kapoor",
    createdAt: hoursAgo(18),
    updatedAt: hoursAgo(4),
    sla: { responseDueAt: hoursFromNow(8), risk: "medium" },
    companyId: null,
    requester: independentRequester,
    requesterType: "iot_user",
  }),
  createTicketSeed("TCK-3001", null, {
    subject: "Company needs admin help with billing access",
    category: "Billing & Plan",
    status: "new",
    priority: "high",
    tags: ["billing"],
    createdAt: hoursAgo(8),
    companyId: "cmp-zen",
    companyName: companyById.get("cmp-zen")?.name ?? "Company",
    requester: {
      id: "cmp-admin-zen",
      name: "Zenith Company Admin",
      email: "zen@company.com",
      companyId: "cmp-zen",
      companyName: companyById.get("cmp-zen")?.name ?? "Company",
    },
    requesterType: "company",
  }),
];

let supportThreads: Record<string, SupportTicketMessage[]> = {
  "TCK-1001": [
    {
      id: "msg-1001-1",
      ticketId: "TCK-1001",
      author: { id: "iot-001", name: "Raj Patel", role: "customer" },
      body: "Gateway dropped offline after the latest firmware update.",
      createdAt: hoursAgo(4),
    },
  ],
  "TCK-1002": [
    {
      id: "msg-1002-1",
      ticketId: "TCK-1002",
      author: { id: "iot-002", name: "Priya Mehta", role: "customer" },
      body: "We are seeing false alert spikes every 10 minutes.",
      createdAt: hoursAgo(12),
    },
  ],
  "TCK-2001": [
    {
      id: "msg-2001-1",
      ticketId: "TCK-2001",
      author: { id: "iot-independent-001", name: "Nora Lin", role: "customer" },
      body: "My independent device stopped syncing today.",
      createdAt: hoursAgo(2),
    },
  ],
};

function delay(ms = 220) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function canAccessTicket(session: SessionUser, ticket: SupportTicket) {
  if (session.role === "admin") {
    return ticket.companyId === null || ticket.requesterType === "company";
  }
  if (session.role === "company") {
    return ticket.companyId === session.companyId;
  }
  return ticket.requester.id === session.userId;
}

function requireRole(session: SessionUser, roles: SessionUser["role"][]) {
  if (!roles.includes(session.role)) {
    throw new Error("You do not have access to this action.");
  }
}

function getTicketsForSession(session: SessionUser) {
  return supportTickets.filter((ticket) => canAccessTicket(session, ticket));
}

export const supportApi = {
  async getQueue(session: SessionUser) {
    await delay();
    requireRole(session, ["admin", "company"]);
    const tickets =
      session.role === "admin"
        ? supportTickets.filter(
            (ticket) =>
              ticket.requesterType === "company" || ticket.companyId === null,
          )
        : supportTickets.filter(
            (ticket) =>
              ticket.companyId === session.companyId &&
              ticket.requesterType === "iot_user",
          );
    return {
      tickets,
      threads: Object.fromEntries(
        tickets.map((ticket) => [ticket.id, supportThreads[ticket.id] ?? []]),
      ),
    };
  },

  async getMyTickets(session: SessionUser) {
    await delay();
    requireRole(session, ["iot_user"]);
    const tickets = getTicketsForSession(session);
    return {
      tickets,
      threads: Object.fromEntries(
        tickets.map((ticket) => [ticket.id, supportThreads[ticket.id] ?? []]),
      ),
      summary: buildTicketSummary(tickets),
    };
  },

  async getCompanyRequests(session: SessionUser) {
    await delay();
    requireRole(session, ["company"]);
    const tickets = supportTickets.filter(
      (ticket) =>
        ticket.companyId === session.companyId &&
        ticket.requesterType === "company",
    );
    return {
      tickets,
      threads: Object.fromEntries(
        tickets.map((ticket) => [ticket.id, supportThreads[ticket.id] ?? []]),
      ),
      summary: buildTicketSummary(tickets),
    };
  },

  async createTicket(session: SessionUser, input: SupportTicketCreateInput) {
    await delay();
    requireRole(session, ["iot_user", "company"]);
    const company = session.companyId ? companyById.get(session.companyId) : null;

    const ticket: SupportTicket = {
      id: `TCK-${1000 + supportTickets.length + 1}`,
      category: input.category ?? "General",
      subject: input.subject,
      description: input.description,
      status: "new",
      priority: input.priority,
      requesterType: session.role === "company" ? "company" : "iot_user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      resolutionTimeHours: null,
      feedbackRating: null,
      companyId: session.companyId ?? null,
      companyName: company?.name,
      requester: {
        id: session.userId,
        name: session.displayName,
        email: session.email,
        companyId: session.companyId ?? null,
        companyName: company?.name,
      },
      assignedAgentId: null,
      assignedAgentName: null,
      tags: ["support"],
      channel: "portal",
      sla: {
        responseDueAt: hoursFromNow(6),
        risk: "medium",
      },
      resolutionNote: null,
    };

    supportTickets = [ticket, ...supportTickets];
    supportThreads[ticket.id] = [
      {
        id: `msg-${ticket.id}-1`,
        ticketId: ticket.id,
        author: {
          id: session.userId,
          name: session.displayName,
          role: "customer",
        },
        body: input.description,
        createdAt: new Date().toISOString(),
        attachments: input.attachments,
      },
    ];

    return ticket;
  },

  async assignToSelf(session: SessionUser, ticketId: string) {
    await delay();
    requireRole(session, ["admin", "company"]);
    const ticket = supportTickets.find((entry) => entry.id === ticketId);
    if (!ticket || !canAccessTicket(session, ticket)) {
      throw new Error("Ticket not found.");
    }
    if (ticket.requesterType === "company" && session.role !== "admin") {
      throw new Error("Only admin can handle company support requests.");
    }
    if (ticket.assignedAgentId && ticket.assignedAgentId !== session.userId) {
      throw new Error("Ticket is already assigned to another agent.");
    }
    ticket.assignedAgentId = session.userId;
    ticket.assignedAgentName = session.displayName;
    if (ticket.status === "new") {
      ticket.status = "in_progress";
    }
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  },

  async unassign(session: SessionUser, ticketId: string) {
    await delay();
    requireRole(session, ["admin", "company"]);
    const ticket = supportTickets.find((entry) => entry.id === ticketId);
    if (!ticket || !canAccessTicket(session, ticket)) {
      throw new Error("Ticket not found.");
    }
    if (ticket.assignedAgentId !== session.userId) {
      throw new Error("Only the assigned agent can unassign this ticket.");
    }
    ticket.assignedAgentId = null;
    ticket.assignedAgentName = null;
    ticket.status = "new";
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  },

  async updateStatus(
    session: SessionUser,
    ticketId: string,
    status: SupportTicketStatus,
  ) {
    await delay();
    requireRole(session, ["admin", "company"]);
    const ticket = supportTickets.find((entry) => entry.id === ticketId);
    if (!ticket || !canAccessTicket(session, ticket)) {
      throw new Error("Ticket not found.");
    }
    if (ticket.requesterType === "company" && session.role !== "admin") {
      throw new Error("Only admin can update this ticket.");
    }
    if (ticket.assignedAgentId !== session.userId) {
      throw new Error("Only the assigned agent can update this ticket.");
    }
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    if (status === "resolved" || status === "closed") {
      ticket.resolvedAt = new Date().toISOString();
      const created = new Date(ticket.createdAt).valueOf();
      const resolved = new Date(ticket.resolvedAt).valueOf();
      ticket.resolutionTimeHours = Number(
        ((resolved - created) / 3600000).toFixed(1),
      );
    }
    return ticket;
  },

  async submitFeedback(
    session: SessionUser,
    ticketId: string,
    rating: number,
  ) {
    await delay();
    requireRole(session, ["iot_user", "company"]);
    if (rating < 1 || rating > 5) {
      throw new Error("Feedback rating must be between 1 and 5.");
    }
    const ticket = supportTickets.find((entry) => entry.id === ticketId);
    if (!ticket || !canAccessTicket(session, ticket)) {
      throw new Error("Ticket not found.");
    }
    if (ticket.status !== "resolved" && ticket.status !== "closed") {
      throw new Error("Feedback can be provided after ticket resolution.");
    }
    ticket.feedbackRating = rating;
    return ticket;
  },
};
