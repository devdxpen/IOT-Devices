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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Device } from "@/types/device";
import { AddDeviceModal } from "./AddDeviceModal";

interface LinkedDevicesTabProps {
  devices: Device[];
  mode: "create" | "edit" | "view";
  onChange?: (devices: Device[]) => void;
}

export function LinkedDevicesTab({
  devices,
  mode,
  onChange,
}: LinkedDevicesTabProps) {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isReadOnly = mode === "view";

  const filtered = devices.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddDevices = (newDevices: Device[]) => {
    if (!onChange) return;
    const existingIds = new Set(devices.map((d) => d.id));
    const toAdd = newDevices.filter((d) => !existingIds.has(d.id));
    onChange([...devices, ...toAdd]);
  };

  const handleRemoveDevice = (id: string) => {
    if (!onChange) return;
    onChange(devices.filter((d) => d.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const toggleDevice = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length && filtered.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((d) => d.id));
    }
  };

  const handleBulkRemove = () => {
    if (!onChange || selectedIds.length === 0) return;
    onChange(devices.filter((d) => !selectedIds.includes(d.id)));
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Linked Devices</h3>
          <p className="text-sm text-muted-foreground">
            {filtered.length} device{filtered.length !== 1 && "s"} linked
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-[200px]"
            />
          </div>
          {!isReadOnly && (
            <>
              <Button onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Add Device
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleBulkRemove}
                disabled={selectedIds.length === 0}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              {!isReadOnly && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={
                      filtered.length > 0 &&
                      selectedIds.length === filtered.length
                    }
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
              )}
              <TableHead>Device Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              {!isReadOnly && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isReadOnly ? 4 : 6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No devices found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((device) => (
                <TableRow key={device.id}>
                  {!isReadOnly && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(device.id)}
                        onCheckedChange={() => toggleDevice(device.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border">
                        <span className="text-xs font-bold text-primary">
                          {device.name.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {device.serialNumber}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{device.deviceType}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {device.location}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${device.status === "active" ? "text-emerald-600" : "text-orange-500"}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${device.status === "active" ? "bg-emerald-500" : "bg-orange-400"}`}
                      />
                      {device.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  {!isReadOnly && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveDevice(device.id)}
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

      <AddDeviceModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddDevices}
      />
    </div>
    
  );
}
