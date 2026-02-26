"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GroupFilters } from "@/components/groups/GroupFilters";
import { GroupListView } from "@/components/groups/GroupListView";
import { GroupCardView } from "@/components/groups/GroupCardView";
import { GroupPagination } from "@/components/groups/GroupPagination";
import { DeleteGroupDialog } from "@/components/groups/DeleteGroupDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { DeviceGroup, GroupFilterState } from "@/types/group";
import { ViewMode } from "@/types/device";
import { useGroups } from "@/hooks/useGroups";

export default function GroupsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<GroupFilterState>({
    search: "",
    status: "all",
    deviceType: "all",
  });

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<DeviceGroup | null>(null);

  // API data
  const { data, isLoading } = useGroups(filters, currentPage, itemsPerPage);
  const groups = data?.groups ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleFilterChange = (key: keyof GroupFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", status: "all", deviceType: "all" });
    setCurrentPage(1);
  };

  const handleViewGroup = (group: DeviceGroup) => {
    router.push(`/groups/${group.id}`);
  };

  const handleEditGroup = (group: DeviceGroup) => {
    router.push(`/groups/${group.id}/edit`);
  };

  const handleDeleteGroup = (group: DeviceGroup) => {
    setDeleteTarget(group);
  };

  return (
    <>
      <GroupFilters
        filters={filters}
        viewMode={viewMode}
        onFilterChange={handleFilterChange}
        onViewModeChange={setViewMode}
        onClearFilters={handleClearFilters}
        onCreateGroup={() => router.push("/groups/create")}
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : viewMode === "list" ? (
        <GroupListView
          groups={groups}
          onViewGroup={handleViewGroup}
          onEditGroup={handleEditGroup}
          onDeleteGroup={handleDeleteGroup}
        />
      ) : (
        <GroupCardView
          groups={groups}
          onViewGroup={handleViewGroup}
          onEditGroup={handleEditGroup}
          onDeleteGroup={handleDeleteGroup}
        />
      )}

      {!isLoading && totalItems > 0 && (
        <GroupPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(count) => {
            setItemsPerPage(count);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteGroupDialog
        group={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
