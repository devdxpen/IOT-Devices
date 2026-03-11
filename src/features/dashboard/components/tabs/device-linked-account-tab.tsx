"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { LinkedUsersTable } from "@/features/device-access/components/LinkedUsersTable";
import { AddLinkedUserModal } from "@/features/device-access/components/AddLinkedUserModal";
import { EditLinkedUserModal } from "@/features/device-access/components/EditLinkedUserModal";
import { fetchLinkedUsers } from "@/lib/mock-api/linked-users";
import type { LinkedUser } from "@/types/linked-user";

export function DeviceLinkedAccountTab() {
  // Data State
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<LinkedUser | null>(null);

  // Load initial data
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchLinkedUsers();
        if (mounted) {
          setLinkedUsers(data);
        }
      } catch {
        toast.error("Failed to load linked users.");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // --- Handlers ---

  const handleAddUser = (newUser: LinkedUser) => {
    // Check for duplicate
    if (linkedUsers.some((u) => u.id === newUser.id)) {
      toast.error("This user is already linked to this device.");
      return;
    }
    setLinkedUsers((prev) => [newUser, ...prev]);
    toast.success(`${newUser.name} has been added as ${newUser.role}.`);
  };

  const handleEditInit = (user: LinkedUser) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedUser: LinkedUser) => {
    setLinkedUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
    toast.success(`${updatedUser.name}'s access has been updated.`);
  };

  const handleDeleteUser = (userId: string) => {
    const user = linkedUsers.find((u) => u.id === userId);
    setLinkedUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.success(`${user?.name || "User"} has been removed from this device.`);
  };

  const handleToggleNotification = (userId: string, enabled: boolean) => {
    setLinkedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, notification: enabled } : u)),
    );
    toast.success(`Notifications ${enabled ? "enabled" : "disabled"}.`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-medium text-slate-800">
          Linked Account & Role Management
        </h2>
        <p className="text-sm text-slate-500">
          To add a user to this device, search using their exact Mobile No. or
          Email ID. The user must already be registered in the system.
        </p>
      </div>

      {/* Add User Section */}
      <div className="bg-white rounded-md border border-slate-200 p-6 flex flex-col gap-6">
        <div className="space-y-4">
          <Label className="text-sm font-medium text-slate-700">
            Add Registered User
          </Label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Enter exact Mobile No. or Email ID to search..."
                className="pl-9 h-11 bg-slate-50 border-slate-200 text-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-sm"
                autoComplete="off"
                readOnly
                onClick={() => setIsAddModalOpen(true)}
              />
            </div>
            <Button
              className="h-11 px-6 bg-[#1C2C4F] hover:bg-[#152240] text-white rounded-sm shrink-0"
              onClick={() => setIsAddModalOpen(true)}
            >
              Search & Add User
            </Button>
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-sm border border-amber-100 flex items-center gap-2">
            <span className="shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[10px]">
              !
            </span>
            For secrecy and security, the system will only return a result if
            there is an exact match for the provided ID.
          </p>
        </div>
      </div>

      {/* Linked Users Table */}
      <LinkedUsersTable
        users={linkedUsers}
        isLoading={isLoading}
        onEdit={handleEditInit}
        onDelete={handleDeleteUser}
        onToggleNotification={handleToggleNotification}
      />

      {/* Add User Modal */}
      <AddLinkedUserModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />

      {/* Edit User Modal */}
      <EditLinkedUserModal
        open={isEditModalOpen}
        user={editingUser}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
