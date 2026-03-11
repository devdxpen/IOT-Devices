"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Pencil, Trash2, Users } from "lucide-react";
import type { LinkedUser } from "@/types/linked-user";

interface LinkedUsersTableProps {
  users: LinkedUser[];
  isLoading: boolean;
  onEdit: (user: LinkedUser) => void;
  onDelete: (userId: string) => void;
  onToggleNotification: (userId: string, enabled: boolean) => void;
}

export function LinkedUsersTable({
  users,
  isLoading,
  onEdit,
  onDelete,
  onToggleNotification,
}: LinkedUsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<LinkedUser | null>(
    null,
  );

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"
          >
            {role}
          </Badge>
        );
      case "Ownership Transfer":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
          >
            Owner
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="hover:bg-secondary">
            {role}
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50"
          >
            Active
          </Badge>
        );
      case "Expired":
        return (
          <Badge variant="destructive" className="hover:bg-destructive">
            Expired
          </Badge>
        );
      case "Inactive":
        return (
          <Badge
            variant="outline"
            className="border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-50"
          >
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderSkeleton = () => (
    <TableBody>
      {Array(4)
        .fill(0)
        .map((_, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-14 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-11 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-20" />
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar & Stats */}
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div className="text-sm border py-2 px-3 rounded-lg text-slate-600 bg-white">
          Total Users:{" "}
          <span className="font-semibold text-slate-800">{users.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">
                User ID
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                User Name
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Email
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                User Role
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Notification
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Joining Date
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Expiry Date
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            renderSkeleton()
          ) : filteredUsers.length === 0 ? (
            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={9} className="h-[200px]">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      No Users Found
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm">
                      {searchQuery
                        ? "No users match your search criteria. Try a different search term."
                        : "No users are linked to this device yet. Use the search above to add users."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="font-medium text-slate-700">
                    {user.id}
                  </TableCell>
                  <TableCell className="text-slate-700">{user.name}</TableCell>
                  <TableCell className="text-slate-500">{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.notification}
                      onCheckedChange={(checked) =>
                        onToggleNotification(user.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {user.joiningDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">{user.expiryDate}</span>
                      {user.expiryDate !== "No Expiry" &&
                        (() => {
                          const expiry = new Date(user.expiryDate);
                          if (!isNaN(expiry.getTime())) {
                            const daysDiff = Math.ceil(
                              (expiry.getTime() - new Date().getTime()) /
                                (1000 * 3600 * 24),
                            );
                            if (daysDiff < 0) {
                              return (
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-700 border-red-200 text-[10px] px-1.5 py-0 uppercase"
                                >
                                  Expired
                                </Badge>
                              );
                            }
                            if (daysDiff <= 7) {
                              return (
                                <Badge
                                  variant="outline"
                                  className="bg-orange-100 text-orange-700 border-orange-200 text-[10px] px-1.5 py-0 uppercase"
                                >
                                  &lt; 7 Days
                                </Badge>
                              );
                            }
                          }
                          return null;
                        })()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        title="Edit Role"
                        onClick={() => onEdit(user)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                        title="Remove User"
                        onClick={() => setDeleteConfirmUser(user)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      {/* Pagination Stub */}
      <div className="flex items-center justify-between text-sm text-slate-500 pt-2">
        <div>
          Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-primary text-white hover:bg-primary/90 hover:text-white"
          >
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmUser}
        onOpenChange={(open) => !open && setDeleteConfirmUser(null)}
      >
        <AlertDialogContent className="rounded-xl border-slate-200 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-slate-900">
              Remove User Access?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 mt-2 text-base">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-900">
                {deleteConfirmUser?.name}
              </span>{" "}
              from this device? They will no longer be able to view or interact
              with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="h-10 px-5 text-slate-600 border-slate-200 hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmUser) {
                  onDelete(deleteConfirmUser.id);
                  setDeleteConfirmUser(null);
                }
              }}
              className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
