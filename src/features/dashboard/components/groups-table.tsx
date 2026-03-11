"use client";

import { useState } from "react";
import { GroupSummary } from "@/types/group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { GroupRow } from "./group-row";

interface GroupsTableProps {
  groups: GroupSummary[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function GroupsTable({
  groups,
  selectedIds,
  onSelectionChange,
}: GroupsTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(groups.map((g) => g.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  return (
    <div className="rounded-md border border-neutral-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-neutral-50/80">
          <TableRow className="border-b border-neutral-200">
            {/* Expand Chevron Column */}
            <TableHead className="w-10 text-center"></TableHead>
            {/* Checkbox Column */}
            <TableHead className="w-12 text-center">
              <Checkbox
                checked={
                  groups.length > 0 && selectedIds.length === groups.length
                }
                onCheckedChange={handleSelectAll}
                className="border-neutral-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 mx-auto"
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="whitespace-nowrap font-medium text-xs text-neutral-600 uppercase tracking-wider">
              Group Name
            </TableHead>
            <TableHead className="whitespace-nowrap font-medium text-xs text-neutral-600 uppercase tracking-wider">
              Tags
            </TableHead>
            <TableHead className="whitespace-nowrap font-medium text-xs text-neutral-600 uppercase tracking-wider">
              Last Data Timestamp
            </TableHead>
            <TableHead className="whitespace-nowrap font-medium text-xs text-neutral-600 uppercase tracking-wider">
              Validate Period
            </TableHead>
            <TableHead className="whitespace-nowrap font-medium text-xs text-neutral-600 uppercase tracking-wider">
              Alarms
            </TableHead>
            <TableHead className="whitespace-nowrap font-medium text-xs text-neutral-600 uppercase tracking-wider">
              Users
            </TableHead>
            <TableHead className="w-32"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="h-32 text-center text-neutral-500"
              >
                No groups found.
              </TableCell>
            </TableRow>
          ) : (
            groups.map((group) => (
              <GroupRow
                key={group.id}
                group={group}
                isSelected={selectedIds.includes(group.id)}
                onSelect={(checked) => handleSelectOne(group.id, checked)}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
