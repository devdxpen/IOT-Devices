export type DemoRequestStatus = "pending" | "scheduled" | "completed" | "cancelled";

export interface DemoRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  reason: string;
  preferredDate: string;
  message: string;
  status: DemoRequestStatus;
  createdAt: string;
}

export interface DemoRequestCreateInput {
  reason: string;
  preferredDate: string;
  message: string;
}

export interface DemoRequestSummary {
  total: number;
  pending: number;
  completed: number;
}
