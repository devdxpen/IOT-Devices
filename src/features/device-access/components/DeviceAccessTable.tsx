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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IoTrashOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoTimeOutline,
  IoEllipse,
} from "react-icons/io5";
import { LuChevronsUpDown } from "react-icons/lu";
import { PiPenLight, PiDeviceTabletSpeaker } from "react-icons/pi";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DeviceAccessRequest, TabType } from "@/lib/mock-api/device-requests";

interface DeviceAccessTableProps {
  activeTab: TabType;
  data: DeviceAccessRequest[];
  isLoading: boolean;
  onDeleteRequest: (
    id: string,
    actionType?: "delete" | "reject" | "cancel",
  ) => void;
  onAcceptInit: (req: DeviceAccessRequest) => void;
  onUpdateRole: (id: string, newRole: string) => void;
  onToggleNotification: (id: string, enabled: boolean) => void;
}

export function DeviceAccessTable({
  activeTab,
  data,
  isLoading,
  onDeleteRequest,
  onAcceptInit,
  onUpdateRole,
  onToggleNotification,
}: DeviceAccessTableProps) {
  // Role Modal States (Local edit trigger)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRoleRequest, setSelectedRoleRequest] =
    useState<DeviceAccessRequest | null>(null);
  const [tempRole, setTempRole] = useState<string>("Viewer");

  const handleOpenRoleModal = (row: DeviceAccessRequest) => {
    setSelectedRoleRequest(row);
    setTempRole(row.role || "Viewer");
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = () => {
    if (selectedRoleRequest) {
      onUpdateRole(selectedRoleRequest.id, tempRole);
    }
    setIsRoleModalOpen(false);
  };

  // Table States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Sorting Logic
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    } else if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "desc"
    ) {
      setSortConfig(null);
      return;
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue: any = a[key as keyof DeviceAccessRequest];
    let bValue: any = b[key as keyof DeviceAccessRequest];

    // Handle nested fields explicitly for sorting
    if (key === "user") {
      aValue = a.user.name;
      bValue = b.user.name;
    }
    if (key === "device") {
      aValue = a.device.name;
      bValue = b.device.name;
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Selection Logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(paginatedData.map((req) => req.id));
      setSelectedRowIds(newSelected);
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRowIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRowIds(newSelected);
  };

  const handleBulkAction = (
    action: "accept" | "delete" | "reject" | "cancel",
  ) => {
    selectedRowIds.forEach((id) => {
      // For delete/reject/cancel we reuse onDeleteRequest. Bulk accept could be wired similarly if needed.
      if (action !== "accept") onDeleteRequest(id, action);
    });
    setSelectedRowIds(new Set());
  };

  const renderSortableHeader = (label: string, sortKey: string) => (
    <div
      className="flex items-center gap-1 cursor-pointer hover:text-slate-900 transition-colors select-none"
      onClick={() => handleSort(sortKey)}
    >
      {label}
      <div className="flex flex-col opacity-50 space-y-[-0.2rem]">
        <span
          className={`text-[9px] ${sortConfig?.key === sortKey && sortConfig.direction === "asc" ? "text-primary opacity-100 font-bold" : ""}`}
        >
          ▲
        </span>
        <span
          className={`text-[9px] ${sortConfig?.key === sortKey && sortConfig.direction === "desc" ? "text-primary opacity-100 font-bold" : ""}`}
        >
          ▼
        </span>
      </div>
    </div>
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-700 border-transparent hover:bg-green-100 gap-1.5 px-2.5 py-0.5 whitespace-nowrap"
          >
            <IoEllipse className="w-2 h-2 fill-current" />
            Active
          </Badge>
        );
      case "Expired":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-700 border-transparent hover:bg-red-100 gap-1.5 px-2.5 py-0.5 whitespace-nowrap"
          >
            <IoTimeOutline className="w-3.5 h-3.5" />
            Expired
          </Badge>
        );
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="bg-orange-100 text-orange-700 border-transparent hover:bg-orange-100 gap-1.5 px-2.5 py-0.5 whitespace-nowrap"
          >
            <IoTimeOutline className="w-3.5 h-3.5" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case "received":
        return {
          title: "No Pending Requests",
          desc: "You have no incoming device access requests at this time.",
        };
      case "sent":
        return {
          title: "No Sent Requests",
          desc: "You haven't requested access to any devices yet.",
        };
      default:
        return {
          title: "No Devices Setup",
          desc: "There are no devices mapped to this access level. Request access to get started.",
        };
    }
  };

  const renderTableSkeleton = () => (
    <TableBody>
      {Array(5)
        .fill(0)
        .map((_, idx) => (
          <TableRow key={idx}>
            <TableCell className="pl-4 py-3">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
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
              <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-24 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-24 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm flex-1 flex flex-col min-h-[500px]">
        {selectedRowIds.size > 0 && (
          <div className="bg-primary/5 border-b border-slate-200 px-5 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2 shrink-0">
            <span className="text-sm font-medium text-primary">
              {selectedRowIds.size}{" "}
              {selectedRowIds.size === 1 ? "item" : "items"} selected
            </span>
            <div className="flex gap-2">
              {activeTab === "received" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  onClick={() => handleBulkAction("reject")}
                >
                  Reject Selected
                </Button>
              )}
              {activeTab === "sent" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  onClick={() => handleBulkAction("cancel")}
                >
                  Cancel Selected
                </Button>
              )}
              {activeTab === "access" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  onClick={() => handleBulkAction("delete")}
                >
                  Remove Selected
                </Button>
              )}
            </div>
          </div>
        )}
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader className="bg-[#f8f9fc] sticky top-0 z-10 shadow-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px] pl-4">
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      selectedRowIds.size === paginatedData.length
                    }
                    onCheckedChange={(checked) =>
                      handleSelectAll(checked as boolean)
                    }
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="py-3 font-medium text-slate-500 w-[200px]">
                  {renderSortableHeader("Username", "user")}
                </TableHead>
                <TableHead className="py-3 font-medium text-slate-500 w-[200px]">
                  {renderSortableHeader("Device Name", "device")}
                </TableHead>
                <TableHead className="py-3 font-medium text-slate-500">
                  {renderSortableHeader("Notification", "notification")}
                </TableHead>
                <TableHead className="py-3 font-medium text-slate-500">
                  {renderSortableHeader("Joining Date", "joiningDate")}
                </TableHead>
                <TableHead className="py-3 font-medium text-slate-500">
                  {renderSortableHeader("Expiry Date", "expiryDate")}
                </TableHead>
                <TableHead className="py-3 font-medium text-slate-500">
                  {renderSortableHeader("Status", "status")}
                </TableHead>
                <TableHead className="py-3 font-medium text-slate-500">
                  {renderSortableHeader("Roles", "role")}
                </TableHead>
                <TableHead className="py-3 font-medium text-slate-500 pr-4 w-[160px] text-left">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            {isLoading ? (
              renderTableSkeleton()
            ) : data.length === 0 ? (
              <TableBody className="h-full">
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={8} className="h-[400px]">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
                        <PiDeviceTabletSpeaker className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800">
                        {getEmptyStateMessage().title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2 max-w-sm">
                        {getEmptyStateMessage().desc}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody className="h-full">
                {paginatedData.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors"
                  >
                    {/* Selection Checkbox */}
                    <TableCell className="pl-4">
                      <Checkbox
                        checked={selectedRowIds.has(row.id)}
                        onCheckedChange={(checked) =>
                          handleSelectRow(row.id, checked as boolean)
                        }
                        aria-label={`Select ${row.id}`}
                      />
                    </TableCell>

                    {/* Username */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border border-slate-200">
                            <AvatarImage
                              src={row.user.avatar}
                              alt={row.user.name}
                            />
                            <AvatarFallback>
                              {row.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 ${row.user.isOnline ? "bg-green-500" : "bg-slate-300"} border-2 border-white rounded-full`}
                          ></span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {row.user.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {row.user.handle}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Device Name */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 rounded-md border border-slate-200">
                            <AvatarFallback className="bg-slate-100 rounded-md">
                              <PiDeviceTabletSpeaker className="w-5 h-5 text-slate-500" />
                            </AvatarFallback>
                          </Avatar>
                          {row.status === "Active" && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full transform translate-x-1/3 translate-y-1/3"></span>
                          )}
                          {row.status === "Expired" && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-400 border border-white rounded-full transform translate-x-1/3 translate-y-1/3"></span>
                          )}
                          {row.status === "Pending" && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-orange-500 border border-white rounded-full transform translate-x-1/3 translate-y-1/3"></span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {row.device.id}
                          </span>
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-xs text-slate-500 truncate max-w-[120px] cursor-help border-b border-dashed border-slate-300">
                                  {row.device.name}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent
                                side="bottom"
                                className="text-xs bg-slate-800 text-white p-2 rounded max-w-[200px] shadow-lg border-slate-700"
                              >
                                <p className="font-semibold mb-1 text-slate-100">
                                  Device Preview
                                </p>
                                <p className="text-slate-300">
                                  ID: {row.device.id}
                                </p>
                                <p className="text-slate-300">
                                  Status: {row.status}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </TableCell>

                    {/* Notification */}
                    <TableCell className="py-3">
                      <Switch
                        checked={row.notification}
                        onCheckedChange={(checked) =>
                          onToggleNotification(row.id, checked)
                        }
                      />
                    </TableCell>

                    {/* Joining Date */}
                    <TableCell className="py-3 text-sm text-slate-600">
                      {row.joiningDate}
                    </TableCell>

                    {/* Expiry Date */}
                    <TableCell className="py-3 text-sm text-slate-600">
                      <div className="flex items-center">
                        <span>{row.expiryDate}</span>
                        {(() => {
                          if (row.expiryDate && row.expiryDate !== "-") {
                            const expiry = new Date(row.expiryDate);
                            if (!isNaN(expiry.getTime())) {
                              const daysDiff = Math.ceil(
                                (expiry.getTime() - new Date().getTime()) /
                                  (1000 * 3600 * 24),
                              );
                              if (daysDiff < 0 || row.status === "Expired") {
                                return (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-red-100 text-red-700 border-red-200 text-[10px] px-1.5 py-0 uppercase"
                                  >
                                    Expired
                                  </Badge>
                                );
                              } else if (daysDiff <= 7) {
                                return (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-orange-100 text-orange-700 border-orange-200 text-[10px] px-1.5 py-0 uppercase"
                                  >
                                    &lt; 7 Days
                                  </Badge>
                                );
                              }
                            }
                          }
                          return null;
                        })()}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3">
                      {getStatusBadge(row.status)}
                    </TableCell>

                    {/* Roles */}
                    <TableCell className="py-3">
                      {activeTab === "access" ? (
                        <button
                          onClick={() => handleOpenRoleModal(row)}
                          className="flex items-center gap-2 border border-slate-200 rounded-md px-2 py-1 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors w-fit group"
                        >
                          <span className="text-sm text-slate-700">
                            {row.role}
                          </span>
                          <PiPenLight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 border border-slate-100 rounded-md px-2 py-1 bg-slate-50 w-fit opacity-70">
                          <span className="text-sm text-slate-600">
                            {row.role}
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-4 py-3">
                      <div className="flex items-center gap-2">
                        {activeTab === "access" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border border-transparent rounded-md transition-colors"
                            onClick={() => setDeleteConfirmId(row.id)}
                          >
                            <IoTrashOutline className="w-4 h-4" />
                          </Button>
                        )}

                        {activeTab === "received" && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-slate-200 text-slate-700 hover:bg-slate-50"
                              onClick={() => onAcceptInit(row)}
                            >
                              <IoCheckmarkOutline className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                              onClick={() => onDeleteRequest(row.id, "reject")}
                            >
                              <IoCloseOutline className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {activeTab === "sent" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                            onClick={() => onDeleteRequest(row.id, "cancel")}
                          >
                            <IoCloseOutline className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      </div>

      {/* Footer Pagination Component */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Show</span>
          <select
            className="border border-slate-200 rounded-md py-1 px-2 bg-white outline-none focus:ring-1 focus:ring-primary"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>of {sortedData.length}</span>
        </div>

        <Pagination className="justify-end w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((p) => p - 1);
                }}
                className={
                  isLoading || currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  (p >= currentPage - 1 && p <= currentPage + 1),
              )
              .map((page, i, arr) => (
                <div key={page} className="flex items-center">
                  {i > 0 && page - arr[i - 1] > 1 && (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </div>
              ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                }}
                className={
                  isLoading || currentPage === totalPages || totalPages === 0
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Role Update Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Device Role</DialogTitle>
            <DialogDescription>
              Assign a precise access level to{" "}
              <span className="font-semibold text-slate-800">
                {selectedRoleRequest?.user.name}
              </span>{" "}
              for device{" "}
              <span className="font-semibold text-slate-800">
                {selectedRoleRequest?.device.id}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <RadioGroup
              value={tempRole}
              onValueChange={setTempRole}
              className="gap-4"
            >
              <div className="flex items-center space-x-3 border p-3 rounded-lg border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="Viewer" id="r1" />
                <Label
                  htmlFor="r1"
                  className="cursor-pointer font-medium flex-1"
                >
                  Viewer
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    Can view telemetry data but cannot execute commands.
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 border p-3 rounded-lg border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="Admin" id="r2" />
                <Label
                  htmlFor="r2"
                  className="cursor-pointer font-medium flex-1"
                >
                  Admin
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    Full access to execute device commands and change settings.
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 border p-3 rounded-lg border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="Ownership Transfer" id="r3" />
                <Label
                  htmlFor="r3"
                  className="cursor-pointer font-medium flex-1"
                >
                  Ownership Transfer
                  <p className="text-xs text-amber-600 font-normal mt-0.5">
                    Permanently transfer full ownership rights to this user.
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveRole}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent className="rounded-xl border-slate-200 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-slate-900">
              Revoke Device Access?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 mt-2 text-base">
              Are you sure you want to remove access for this user to this
              device? They will no longer be able to view or interact with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="h-10 px-5 text-slate-600 border-slate-200 hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  onDeleteRequest(deleteConfirmId, "delete");
                  setDeleteConfirmId(null);
                }
              }}
              className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              Remove Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
