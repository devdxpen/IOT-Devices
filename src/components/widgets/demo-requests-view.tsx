"use client";

import { useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useDemoSession } from "@/hooks/use-demo-session";
import { useDemoRequests } from "@/hooks/use-demo-requests";
import { SupportEmptyState, SupportErrorState, SupportLoadingState } from "@/components/layout/support-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DemoRequestStatus } from "@/types/demo";

const reasons = [
  "New Project",
  "Feature Upgrade",
  "Technical Support",
  "Pricing Inquiry",
  "Other",
];

const statusStyles: Record<DemoRequestStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  scheduled: "bg-sky-50 text-sky-700 border-sky-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-slate-100 text-slate-700 border-slate-200",
};

export function DemoRequestsView() {
  const session = useDemoSession();
  const { query, createMutation } = useDemoRequests();

  const [reason, setReason] = useState(reasons[0]);
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const requests = query.data?.requests ?? [];
  const summary = query.data?.summary;

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId],
  );

  useEffect(() => {
    if (!requests.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !requests.some((item) => item.id === selectedId)) {
      setSelectedId(requests[0].id);
    }
  }, [requests, selectedId]);

  if (!session) {
    return null;
  }

  if (session.role !== "iot_user") {
    return (
      <SupportEmptyState
        title="Demo requests are available for IoT users"
        description="Login as an IoT user to raise and track demo requests."
      />
    );
  }

  if (query.isLoading) {
    return <SupportLoadingState />;
  }

  if (query.isError) {
    return (
      <SupportErrorState
        title="Unable to load demo requests"
        description={
          query.error instanceof Error ? query.error.message : "Unknown error"
        }
        onRetry={() => query.refetch()}
      />
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Demo Requests</h2>
          <p className="text-sm text-muted-foreground">
            Raise a demo request and track the status.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <FiPlus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a Demo</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 text-sm">
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Reason" />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={preferredDate}
                onChange={(event) => setPreferredDate(event.target.value)}
              />
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Message"
              />
              <Button
                onClick={() => {
                  if (!preferredDate || !message.trim()) {
                    return;
                  }
                  createMutation.mutate({
                    reason,
                    preferredDate,
                    message: message.trim(),
                  });
                  setPreferredDate("");
                  setMessage("");
                }}
              >
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Requests</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {summary?.total ?? requests.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {summary?.pending ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {summary?.completed ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {requests.length ? (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                  Demo ID
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                  Reason
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                  Preferred Date
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                  Created
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow
                  key={request.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => setSelectedId(request.id)}
                >
                  <TableCell className="font-medium text-primary">
                    {request.id}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {request.reason}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {request.preferredDate}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs ${statusStyles[request.status]}`}
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <SupportEmptyState
          title="No demo requests yet"
          description="Raise a demo request to get started."
        />
      )}

      {selectedRequest ? (
        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Request Message
            </div>
            <p className="mt-2 text-foreground">{selectedRequest.message}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
