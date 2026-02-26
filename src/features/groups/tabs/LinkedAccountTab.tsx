import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { GroupUser } from "@/types/group";
import { AddUserModal } from "./AddUserModal";

interface LinkedAccountTabProps {
  users: GroupUser[];
  mode: "create" | "edit" | "view";
  onChange?: (users: GroupUser[]) => void;
}

const statusColors: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-orange-50 text-orange-700 border-orange-200",
  invited: "bg-blue-50 text-blue-700 border-blue-200",
};

const statusIcons: Record<string, string> = {
  approved: "✓",
  pending: "⏳",
  invited: "👤",
};

export function LinkedAccountTab({
  users,
  mode,
  onChange,
}: LinkedAccountTabProps) {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const isReadOnly = mode === "view";

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddUsers = (newUsers: GroupUser[]) => {
    if (!onChange) return;
    const existingIds = new Set(users.map((u) => u.id));
    const toAdd = newUsers.filter((u) => !existingIds.has(u.id));
    onChange([...users, ...toAdd]);
  };

  const handleRemoveUser = (id: string) => {
    if (!onChange) return;
    onChange(users.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Linked Account & Role Management
          </h3>
          <p className="text-sm text-muted-foreground">
            {users.length} user{users.length !== 1 && "s"} assigned
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name & role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-[220px]"
            />
          </div>
          {!isReadOnly && (
            <>
              <Button onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Add Users
              </Button>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              {!isReadOnly && (
                <TableHead className="w-10">
                  <Checkbox />
                </TableHead>
              )}
              <TableHead>Username</TableHead>
              <TableHead>Assign Devices</TableHead>
              <TableHead>Assign By</TableHead>
              <TableHead>Validity Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              {!isReadOnly && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isReadOnly ? 6 : 8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  {!isReadOnly && (
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1">
                          {user.name}
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.department}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.assignedDevices}
                  </TableCell>
                  <TableCell>
                    {user.assignedBy === "-- Requested --" ? (
                      <span className="text-sm text-muted-foreground italic">
                        -- Requested --
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user.assignedBy
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {user.assignedBy}
                          </p>
                          <p className="text-xs text-emerald-600 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                            {user.assignedByRole}
                          </p>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{user.validityStart}</p>
                      <p className="text-muted-foreground">
                        {user.validityEnd}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs capitalize",
                        statusColors[user.status],
                      )}
                    >
                      {statusIcons[user.status]} {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{user.role}</span>
                      {!isReadOnly && (
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  {!isReadOnly && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {user.status === "pending" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          >
                            Accept
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddUserModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddUsers}
      />
    </div>
  );
}

