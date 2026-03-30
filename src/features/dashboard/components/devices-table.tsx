import { Device } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, ChevronUp, ChevronDown, LayoutGrid, Flag, Move } from "lucide-react";
import { useRouter } from "next/navigation";

interface DevicesTableProps {
  devices: Device[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  sortConfig: {
    key: keyof Device | string;
    direction: "asc" | "desc";
  } | null;
  onSort: (key: string) => void;
  onRequestMove?: (device: Device) => void;
}

export function DevicesTable({
  devices,
  selectedIds,
  onSelectionChange,
  sortConfig,
  onSort,
  onRequestMove,
}: DevicesTableProps) {
  const router = useRouter();

  // Sensors removed

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(devices.map((d) => d.id));
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

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    const isActive = sortConfig?.key === columnKey;
    const isAsc = isActive && sortConfig.direction === "asc";
    const isDesc = isActive && sortConfig.direction === "desc";

    return (
      <div className="ml-1 flex flex-col text-neutral-400">
        <ChevronUp
          className={`w-2.5 h-2.5 -mb-0.5 ${isAsc ? "text-neutral-900" : ""}`}
        />
        <ChevronDown
          className={`w-2.5 h-2.5 ${isDesc ? "text-neutral-900" : ""}`}
        />
      </div>
    );
  };

  const SortableHeader = ({
    label,
    columnKey,
    className = "",
  }: {
    label: string;
    columnKey: string;
    className?: string;
  }) => (
    <TableHead
      className={`whitespace-nowrap cursor-pointer hover:bg-neutral-50 ${className}`}
      onClick={() => onSort(columnKey)}
    >
      <div className="flex items-center text-neutral-600 font-medium text-xs uppercase tracking-wider">
        {label}
        <SortIcon columnKey={columnKey} />
      </div>
    </TableHead>
  );

  return (
    <div className="rounded-md border border-neutral-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-neutral-50/80">
          <TableRow className="border-b border-neutral-200">
            <TableHead className="w-12 text-center">
              <Checkbox
                checked={
                  devices?.length > 0 && selectedIds?.length === devices?.length
                }
                onCheckedChange={handleSelectAll}
                className="border-neutral-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 mx-auto"
                aria-label="Select all"
              />
            </TableHead>
            <SortableHeader
              label="Flag"
              columnKey="colorFlag"
              className="w-12 text-center"
            />
            <SortableHeader label="Device" columnKey="name" />
            <SortableHeader label="Username" columnKey="assignedUser.name" />
            <SortableHeader label="Company" columnKey="company" />
            <TableHead className="whitespace-nowrap font-medium text-xs text-neutral-600 uppercase tracking-wider">
              Tags
            </TableHead>
            <SortableHeader
              label="Last Data Timestamp"
              columnKey="lastDataTimestamp"
            />
            <SortableHeader label="Alarms" columnKey="alarms" />
            <SortableHeader
              label="Data 1"
              columnKey="data.t1"
              className="text-center"
            />
            <SortableHeader
              label="Data 2"
              columnKey="data.t2"
              className="text-center"
            />
            <SortableHeader
              label="Data 3"
              columnKey="data.t3"
              className="text-center"
            />
            <TableHead className="text-right whitespace-nowrap text-neutral-600 font-medium text-xs uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="h-32 text-center text-neutral-500"
              >
                No devices found.
              </TableCell>
            </TableRow>
          ) : (
            devices.map((device) => {
              const isSelected = selectedIds.includes(device.id);

              return (
                <TableRow
                  key={device.id}
                  className={`group border-b border-neutral-100 transition-colors ${
                    isSelected
                      ? "bg-blue-50/50"
                      : "bg-white hover:bg-blue-50/30"
                  }`}
                >
                  <TableCell className="text-center py-3 w-12">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectOne(device.id, !!checked)
                      }
                      className="border-neutral-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 mx-auto"
                      aria-label={`Select ${device.name}`}
                    />
                  </TableCell>

                  {/* Color Flag Cell */}
                  <TableCell className="text-center py-3 w-12 border-r border-neutral-100/50">
                    <div className="flex justify-center">
                      <span title={`Flag: ${device.colorFlag || "None"}`}>
                        <Flag
                          className={`w-4 h-4 ${
                            device.colorFlag === "red"
                              ? "text-red-500"
                              : device.colorFlag === "yellow"
                                ? "text-yellow-500"
                                : device.colorFlag === "green"
                                  ? "text-green-500"
                                  : "text-neutral-200"
                          }`}
                        />
                      </span>
                    </div>
                  </TableCell>

                  {/* Device Cell */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                          <img
                            src={device.icon}
                            alt={device.name}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                            <div className={`w-2.5 h-2.5 rounded-full ${device.isOnline ? 'bg-green-500' : 'bg-red-400'}`}></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-neutral-900">
                          {device.name}
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {device.deviceType}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Username Cell */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 rounded-full border border-neutral-200">
                        <AvatarImage
                          src={device.assignedUser?.avatarUrl}
                          alt={device.assignedUser?.name}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                          {device.assignedUser?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-neutral-700">
                        {device.assignedUser?.name}
                      </span>
                    </div>
                  </TableCell>

                  {/* Company Cell */}
                  <TableCell className="py-3">
                    <span className="text-sm font-medium text-neutral-700">
                      {device.company}
                    </span>
                  </TableCell>

                  {/* Tags Cell */}
                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-1.5 max-w-[180px]">
                      {device.tags && device.tags.length > 0 ? (
                        device.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200 whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-neutral-400 font-medium italic">
                          -
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Timestamp Cell */}
                  <TableCell className="py-3">
                    <span className="text-sm text-neutral-600 font-medium">
                      {device.lastDataTimestamp}
                    </span>
                  </TableCell>

                  {/* Alarms Cell */}
                  <TableCell className="py-3">
                    <div className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-neutral-100 border border-neutral-200 rounded text-xs font-semibold text-neutral-600">
                      {device.alarms ?? 0}
                    </div>
                  </TableCell>

                  {/* Data 1 Cell */}
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-800">
                        {device.data?.t1}
                      </span>
                      <span className="text-[10px] font-medium text-neutral-500 uppercase">
                        T1
                      </span>
                    </div>
                  </TableCell>

                  {/* Data 2 Cell */}
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-800">
                        {device.data?.t2}
                      </span>
                      <span className="text-[10px] font-medium text-neutral-500 uppercase">
                        T2
                      </span>
                    </div>
                  </TableCell>

                  {/* Data 3 Cell */}
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-800">
                        {device.data?.t3}
                      </span>
                      <span className="text-[10px] font-medium text-neutral-500 uppercase">
                        T3
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions Cell */}
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-neutral-600 bg-white hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/device/${device.id}/edit`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-neutral-600 bg-white hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View in Canvas"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/device/${device.id}/canvas`);
                        }}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-neutral-600 bg-white hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Move to Position"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRequestMove) onRequestMove(device);
                        }}
                      >
                        <Move className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
