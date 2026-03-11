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
import { Search, Plus, Trash2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAvailableDevices } from "@/features/groups/hooks/useGroups";

import { Device } from "@/types";

interface AddDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (devices: Device[]) => void;
}

export function AddDeviceModal({ open, onClose, onAdd }: AddDeviceModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: devices = [], isLoading } = useAvailableDevices(search);

  const filtered = devices.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    return true;
  });

  const toggleDevice = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAdd = () => {
    const selected = devices.filter((d) => selectedIds.includes(d.id));
    if (onAdd) {
      onAdd(selected);
    }
    onClose();
    setSelectedIds([]);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Devices to Group</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 py-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="gap-1">
              {selectedIds.length} selected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={() => setSelectedIds([])}
            >
              Clear
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-10"></TableHead>
                <TableHead>Device Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading devices...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No devices found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((device) => (
                  <TableRow
                    key={device.id}
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedIds.includes(device.id) && "bg-primary/5",
                    )}
                    onClick={() => toggleDevice(device.id)}
                  >
                    <TableCell>
                      <Checkbox checked={selectedIds.includes(device.id)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border">
                          <span className="text-xs font-bold text-primary">
                            {device.name.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${device.status === "active" ? "bg-emerald-500" : "bg-orange-400"}`}
                            />
                            {device.status === "active" ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {device.deviceType}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {device.location}
                    </TableCell>
                  </TableRow>
                ))
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
            Add{" "}
            {selectedIds.length > 0
              ? `${selectedIds.length} Device${selectedIds.length > 1 ? "s" : ""}`
              : "Devices"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
