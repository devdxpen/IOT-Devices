"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDemoRequest,
  fetchMyDemoRequests,
  updateDemoRequestStatus,
} from "@/lib/demo-api";
import type { DemoRequestStatus } from "@/types/demo";

export function useDemoRequests() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["demo-requests", "my"],
    queryFn: fetchMyDemoRequests,
  });

  const createMutation = useMutation({
    mutationFn: createDemoRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["demo-requests", "my"] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({
      requestId,
      status,
    }: {
      requestId: string;
      status: DemoRequestStatus;
    }) => updateDemoRequestStatus(requestId, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["demo-requests", "my"] }),
  });

  return {
    query,
    createMutation,
    statusMutation,
  };
}
