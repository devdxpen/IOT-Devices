import { readDemoSession } from "@/lib/auth/demo-auth";
import { supportApi } from "@/lib/mock-api/support";
import type {
  SupportTicketCreateInput,
  SupportTicketStatus,
} from "@/types/support";

function requireSession() {
  const session = readDemoSession();
  if (!session) {
    throw new Error("Please login to access support tickets.");
  }
  return session;
}

export async function fetchSupportQueue() {
  const session = requireSession();
  return supportApi.getQueue(session);
}

export async function fetchMySupportTickets() {
  const session = requireSession();
  return supportApi.getMyTickets(session);
}

export async function fetchCompanySupportRequests() {
  const session = requireSession();
  return supportApi.getCompanyRequests(session);
}

export async function createSupportTicket(input: SupportTicketCreateInput) {
  const session = requireSession();
  return supportApi.createTicket(session, input);
}

export async function assignSupportTicket(ticketId: string) {
  const session = requireSession();
  return supportApi.assignToSelf(session, ticketId);
}

export async function unassignSupportTicket(ticketId: string) {
  const session = requireSession();
  return supportApi.unassign(session, ticketId);
}

export async function updateSupportTicketStatus(
  ticketId: string,
  status: SupportTicketStatus,
) {
  const session = requireSession();
  return supportApi.updateStatus(session, ticketId, status);
}

export async function submitSupportFeedback(ticketId: string, rating: number) {
  const session = requireSession();
  return supportApi.submitFeedback(session, ticketId, rating);
}
