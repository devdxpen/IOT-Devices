"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignSupportTicket,
  createSupportTicket,
  fetchCompanySupportRequests,
  fetchMySupportTickets,
  fetchSupportQueue,
  unassignSupportTicket,
  submitSupportFeedback,
  updateSupportTicketStatus,
} from "@/lib/support-api";
import type {
  SupportTicketCreateInput,
  SupportTicketStatus,
} from "@/types/support";

export function useSupportQueue() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["support", "queue"],
    queryFn: fetchSupportQueue,
  });

  const assignMutation = useMutation({
    mutationFn: assignSupportTicket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["support", "queue"] }),
  });

  const unassignMutation = useMutation({
    mutationFn: unassignSupportTicket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["support", "queue"] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: string; status: SupportTicketStatus }) =>
      updateSupportTicketStatus(ticketId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["support", "queue"] }),
  });

  return {
    query,
    assignMutation,
    unassignMutation,
    statusMutation,
  };
}

export function useSupportMyTickets() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["support", "my-tickets"],
    queryFn: fetchMySupportTickets,
  });

  const createMutation = useMutation({
    mutationFn: createSupportTicket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["support", "my-tickets"] }),
  });

  const feedbackMutation = useMutation({
    mutationFn: ({ ticketId, rating }: { ticketId: string; rating: number }) =>
      submitSupportFeedback(ticketId, rating),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["support", "my-tickets"] }),
  });

  return {
    query,
    createMutation,
    feedbackMutation,
  };
}

export function useSupportCompanyRequests() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["support", "company-requests"],
    queryFn: fetchCompanySupportRequests,
  });

  const createMutation = useMutation({
    mutationFn: createSupportTicket,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["support", "company-requests"] }),
  });

  const feedbackMutation = useMutation({
    mutationFn: ({ ticketId, rating }: { ticketId: string; rating: number }) =>
      submitSupportFeedback(ticketId, rating),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["support", "company-requests"] }),
  });

  return {
    query,
    createMutation,
    feedbackMutation,
  };
}
