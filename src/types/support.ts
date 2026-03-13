export type SupportQueueScope = "admin" | "company";

export type SupportTicketStatus =
  | "new"
  | "in_progress"
  | "on_hold"
  | "resolved"
  | "closed"
  | "cancelled";

export type SupportTicketPriority = "low" | "medium" | "high" | "critical";

export type SupportChannel = "portal" | "email" | "phone" | "chat";


export interface SupportRequester {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyId: string | null;
  companyName?: string;
}

export interface SupportAgent {
  id: string;
  name: string;
  title: string;
  companyId: string | null;
  availability: "online" | "offline" | "away";
  activeTickets: number;
}

export interface SupportTicketSla {
  responseDueAt: string;
  risk: "low" | "medium" | "high";
}

export interface SupportTicket {
  category?: string;
  id: string;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  requesterType: "iot_user" | "company";
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  resolutionTimeHours?: number | null;
  feedbackRating?: number | null;
  companyId: string | null;
  companyName?: string;
  requester: SupportRequester;
  assignedAgentId: string | null;
  assignedAgentName?: string | null;
  tags: string[];
  channel: SupportChannel;
  sla: SupportTicketSla;
  resolutionNote?: string | null;
}

export interface SupportTicketAttachment {
  id: string;
  name: string;
  type: string;
  sizeKb: number;
  url?: string;
}

export interface SupportTicketMessage {
  id: string;
  ticketId: string;
  author: {
    id: string;
    name: string;
    role: "customer" | "agent" | "system" | "internal";
  };
  body: string;
  createdAt: string;
  attachments?: SupportTicketAttachment[];
  isInternal?: boolean;
}

export interface SupportTicketCreateInput {
  category?: string;
  subject: string;
  description: string;
  priority: SupportTicketPriority;
  attachments?: SupportTicketAttachment[];
}

export interface SupportTicketSummary {
  total: number;
  open: number;
  resolved: number;
  closed: number;
}
