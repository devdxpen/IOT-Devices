"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  IoSearchOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "react-icons/io5";

type RequestType = {
  id: string;
  deviceId: string;
  name: string;
  email: string;
  type: string;
  role?: string;
  date: string;
  status: string;
};

const dummyRequests: RequestType[] = [
  {
    id: "R1001",
    deviceId: "DEV-1094",
    name: "Dev Joshi",
    email: "dev@gmail.com",
    type: "Sent",
    role: "User",
    date: "05 Mar 2026",
    status: "Pending",
  },
  {
    id: "R1002",
    deviceId: "DEV-8342",
    name: "Priya Patel",
    email: "priya@gmail.com",
    type: "Received",
    date: "04 Mar 2026",
    status: "Pending",
  },
];

export function RequestsTable() {
  const [filterType, setFilterType] = useState<"All" | "Sent" | "Received">(
    "All",
  );

  // Accept Request Modal State
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestType | null>(
    null,
  );
  const [date, setDate] = useState<Date>();
  const [hasExpiry, setHasExpiry] = useState(false);

  const filteredRequests = dummyRequests.filter(
    (req) => filterType === "All" || req.type === filterType,
  );

  const openAcceptModal = (req: RequestType) => {
    setSelectedRequest(req);
    setIsAcceptModalOpen(true);
    setDate(undefined);
    setHasExpiry(false);
  };

  const handleConfirmAccept = () => {
    // Here we would typically make an API call to accept the request with the configured settings.
    setIsAcceptModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs
          defaultValue="All"
          className="w-full sm:w-auto"
          onValueChange={(val) =>
            setFilterType(val as "All" | "Sent" | "Received")
          }
        >
          <TabsList className="grid w-full sm:w-[350px] grid-cols-3">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Sent">Sent</TabsTrigger>
            <TabsTrigger value="Received">Received</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search request ID or Device..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden mt-2">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">
                Request ID
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Device ID
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                User Name
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Email
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Type
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Requested Role
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Request Date
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium text-slate-700">
                    {req.id}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {req.deviceId}
                  </TableCell>
                  <TableCell>{req.name}</TableCell>
                  <TableCell className="text-slate-500">{req.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        req.type === "Sent"
                          ? "text-blue-600 bg-blue-50 border-blue-200"
                          : "text-purple-600 bg-purple-50 border-purple-200"
                      }
                    >
                      {req.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{req.role || "-"}</TableCell>
                  <TableCell className="text-slate-500">{req.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-700 hover:bg-amber-100"
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {req.type === "Received" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                            onClick={() => openAcceptModal(req)}
                          >
                            <IoCheckmarkOutline className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                          >
                            <IoCloseOutline className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-slate-600 hover:bg-slate-50 border-slate-200"
                        >
                          Cancel Request
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-slate-500"
                >
                  No requests found for the selected filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Basic Pagination Stub */}
      <div className="flex items-center justify-between text-sm text-slate-500 pt-2">
        <div>
          Showing 1 to {filteredRequests.length} of {filteredRequests.length}{" "}
          entries
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-primary text-white hover:bg-primary/90 hover:text-white"
            disabled={filteredRequests.length === 0}
          >
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      {/* Accept Request Configuration Modal */}
      <Dialog open={isAcceptModalOpen} onOpenChange={setIsAcceptModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Accept Request & Configure Access</DialogTitle>
            <DialogDescription>
              User{" "}
              <span className="font-semibold text-slate-900">
                {selectedRequest?.name}
              </span>{" "}
              is requesting access to device{" "}
              <span className="font-semibold text-slate-900">
                {selectedRequest?.deviceId}
              </span>
              . Configure their permissions below to accept.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="role" className="text-slate-700">
                Assign Role
              </Label>
              <Select defaultValue="user">
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="viewer">Viewer Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
              <div>
                <Label className="text-slate-700 font-medium">
                  Notification Selection
                </Label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Allow this user to receive alerts from this device
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50 gap-3">
              <div className="flex-1">
                <Label className="text-slate-700 font-medium">
                  Access Expiry (Validation Time)
                </Label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set a time limit for this user's access
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-expiry"
                    checked={hasExpiry}
                    onCheckedChange={setHasExpiry}
                  />
                  <Label
                    htmlFor="has-expiry"
                    className="text-sm font-normal text-slate-600 whitespace-nowrap"
                  >
                    {hasExpiry ? "Set Date" : "No Expiry"}
                  </Label>
                </div>

                {hasExpiry && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[130px] justify-start text-left font-normal h-8 text-xs",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {date ? (
                          format(date, "MMM dd, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAcceptModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-white hover:bg-primary/90"
              onClick={handleConfirmAccept}
            >
              Confirm Acceptance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
