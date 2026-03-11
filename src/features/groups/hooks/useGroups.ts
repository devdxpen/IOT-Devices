import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupFilterState } from "@/types/group";
import {
  fetchGroups,
  fetchGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  toggleGroupStatus,
  fetchAvailableDevices,
  fetchGroupUsers,
  fetchGroupAlarms,
  type GroupListResponse,
  type GroupDetailResponse,
} from "@/features/groups/api/groupApi";

// ─── Query Keys ───
const keys = {
  all: ["groups"] as const,
  list: (filters: GroupFilterState, page: number, pageSize: number) =>
    [...keys.all, "list", filters, page, pageSize] as const,
  detail: (id: string) => [...keys.all, "detail", id] as const,
  availableDevices: (search: string) => ["available-devices", search] as const,
  users: () => ["group-users"] as const,
  alarms: () => ["group-alarms"] as const,
};

// ─── List ───
export function useGroups(
  filters: GroupFilterState,
  page: number,
  pageSize: number,
) {
  return useQuery<GroupListResponse>({
    queryKey: keys.list(filters, page, pageSize),
    queryFn: () => fetchGroups(filters, page, pageSize),
    placeholderData: (prev) => prev,
  });
}

// ─── Detail ───
export function useGroup(id: string | undefined) {
  return useQuery<GroupDetailResponse>({
    queryKey: keys.detail(id!),
    queryFn: () => fetchGroupById(id!),
    enabled: !!id,
  });
}

// ─── Create ───
export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}

// ─── Update ───
export function useUpdateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateGroup>[1];
    }) => updateGroup(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: keys.all });
      qc.invalidateQueries({ queryKey: keys.detail(variables.id) });
    },
  });
}

// ─── Delete ───
export function useDeleteGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}

// ─── Toggle Status ───
export function useToggleGroupStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleGroupStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}

// ─── Available Devices ───
export function useAvailableDevices(search: string) {
  return useQuery({
    queryKey: keys.availableDevices(search),
    queryFn: () => fetchAvailableDevices(search),
  });
}

// ─── Group Users ───
export function useGroupUsers() {
  return useQuery({
    queryKey: keys.users(),
    queryFn: fetchGroupUsers,
  });
}

// ─── Group Alarms ───
export function useGroupAlarms() {
  return useQuery({
    queryKey: keys.alarms(),
    queryFn: fetchGroupAlarms,
  });
}
