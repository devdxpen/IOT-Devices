import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { Search, Plus, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGroupUsers } from "@/hooks/useGroups";
import { GroupUser } from "@/types/group";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (users: GroupUser[]) => void;
}

export function AddUserModal({ open, onClose, onAdd }: AddUserModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [roleMap, setRoleMap] = useState<Record<string, string>>({});
  const [startDateMap, setStartDateMap] = useState<Record<string, string>>({});
  const [endDateMap, setEndDateMap] = useState<Record<string, string>>({});

  const [bulkRole, setBulkRole] = useState("Viewer");
  const [bulkStartDate, setBulkStartDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [bulkEndDate, setBulkEndDate] = useState<string>("2030-12-31");

  const { data: users = [], isLoading } = useGroupUsers();

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleUser = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleRoleChange = (id: string, role: string) => {
    setRoleMap((prev) => ({ ...prev, [id]: role }));
  };

  const handleBulkApply = () => {
    const newRoleMap = { ...roleMap };
    const newStartMap = { ...startDateMap };
    const newEndMap = { ...endDateMap };

    selectedIds.forEach((id) => {
      newRoleMap[id] = bulkRole;
      newStartMap[id] = bulkStartDate;
      newEndMap[id] = bulkEndDate;
    });

    setRoleMap(newRoleMap);
    setStartDateMap(newStartMap);
    setEndDateMap(newEndMap);
  };

  const handleAdd = () => {
    const selected = users
      .filter((u) => selectedIds.includes(u.id))
      .map((u) => ({
        ...u,
        role: (roleMap[u.id] || "Viewer") as "Viewer" | "Editor" | "Admin",
        validityStart:
          startDateMap[u.id] || new Date().toISOString().split("T")[0],
        validityEnd: endDateMap[u.id] || "2030-12-31",
        assignedBy: "Admin User",
        assignedByRole: "System Admin",
      }));
    if (onAdd) {
      onAdd(selected);
    }
    onClose();
    setSelectedIds([]);
    setRoleMap({});
    setStartDateMap({});
    setEndDateMap({});
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Users to Group</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {selectedIds.length > 0 && (
            <div className="bg-muted/50 p-3 rounded-lg border flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium mr-2">
                Bulk Apply to {selectedIds.length} users:
              </span>

              <Select value={bulkRole} onValueChange={setBulkRole}>
                <SelectTrigger className="w-[110px] h-8 text-xs bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 text-xs w-[130px] justify-start text-left font-normal bg-background"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {bulkStartDate
                      ? format(parseISO(bulkStartDate), "PP")
                      : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseISO(bulkStartDate)}
                    onSelect={(d) =>
                      d && setBulkStartDate(format(d, "yyyy-MM-dd"))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 text-xs w-[130px] justify-start text-left font-normal bg-background"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {bulkEndDate
                      ? format(parseISO(bulkEndDate), "PP")
                      : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseISO(bulkEndDate)}
                    onSelect={(d) =>
                      d && setBulkEndDate(format(d, "yyyy-MM-dd"))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button
                size="sm"
                className="h-8 text-xs ml-auto"
                onClick={handleBulkApply}
              >
                Apply to Selected
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-10"></TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role to Assign</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => {
                  const isSelected = selectedIds.includes(user.id);
                  return (
                    <TableRow
                      key={user.id}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSelected && "bg-primary/5",
                      )}
                    >
                      <TableCell onClick={() => toggleUser(user.id)}>
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell onClick={() => toggleUser(user.id)}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-muted">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.department}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={roleMap[user.id] || "Viewer"}
                          onValueChange={(val) =>
                            handleRoleChange(user.id, val)
                          }
                          disabled={!isSelected}
                        >
                          <SelectTrigger className="w-[110px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Editor">Editor</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              disabled={!isSelected}
                              className={cn(
                                "w-[125px] justify-start text-left font-normal h-8 text-xs",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3" />
                              {startDateMap[user.id]
                                ? format(parseISO(startDateMap[user.id]), "PP")
                                : "Start Date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                startDateMap[user.id]
                                  ? parseISO(startDateMap[user.id])
                                  : parseISO(bulkStartDate)
                              }
                              onSelect={(d) =>
                                d &&
                                setStartDateMap((p) => ({
                                  ...p,
                                  [user.id]: format(d, "yyyy-MM-dd"),
                                }))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              disabled={!isSelected}
                              className={cn(
                                "w-[125px] justify-start text-left font-normal h-8 text-xs",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3" />
                              {endDateMap[user.id]
                                ? format(parseISO(endDateMap[user.id]), "PP")
                                : "End Date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                endDateMap[user.id]
                                  ? parseISO(endDateMap[user.id])
                                  : parseISO(bulkEndDate)
                              }
                              onSelect={(d) =>
                                d &&
                                setEndDateMap((p) => ({
                                  ...p,
                                  [user.id]: format(d, "yyyy-MM-dd"),
                                }))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between pt-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={selectedIds.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Add Users
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
