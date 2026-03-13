"use client";

import { useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useSupportCompanyRequests } from "@/hooks/use-support-tickets";
import { SupportEmptyState, SupportErrorState, SupportLoadingState } from "@/components/layout/support-state";
import { SupportTicketDetail } from "@/components/widgets/support-ticket-detail";
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
import { ticketStatusLabels, ticketStatusStyles } from "@/lib/support";
import { cn } from "@/lib/utils";
import { ticketSubjectOptions } from "@/lib/support";
import type { SupportTicketPriority } from "@/types/support";

const priorities: SupportTicketPriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

export function SupportCompanyRequestsView() {
  const { query, createMutation, feedbackMutation } =
    useSupportCompanyRequests();

  const [priority, setPriority] = useState<SupportTicketPriority>("medium");
  const [category, setCategory] = useState(ticketSubjectOptions[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const tickets = query.data?.tickets ?? [];
  const threads = query.data?.threads ?? {};
  const summary = query.data?.summary;

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId],
  );

  useEffect(() => {
    if (!tickets.length) {
      setSelectedTicketId(null);
      return;
    }
    if (!selectedTicketId || !tickets.some((item) => item.id === selectedTicketId)) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  if (query.isLoading) {
    return <SupportLoadingState />;
  }

  if (query.isError) {
    return (
      <SupportErrorState
        title="Unable to load company requests"
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
          <h2 className="text-lg font-semibold text-foreground">
            Company Support Requests
          </h2>
          <p className="text-sm text-muted-foreground">
            Raise a request to admin support and track progress.
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
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 text-sm">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Title"
              />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {ticketSubjectOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as SupportTicketPriority)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
              />
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,image/*"
                onChange={(event) => {
                  const files = event.target.files
                    ? Array.from(event.target.files)
                    : [];
                  setAttachments(files);
                }}
              />
              {attachments.length ? (
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
                  <div className="mb-2 font-semibold text-foreground">
                    Selected files
                  </div>
                  <ul className="space-y-1">
                    {attachments.map((file) => (
                      <li
                        key={file.name}
                        className="flex items-center justify-between"
                      >
                        <span className="truncate">{file.name}</span>
                        <span>
                          {Math.max(1, Math.round(file.size / 1024))} KB
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <Button
                onClick={() => {
                  if (!title.trim() || !description.trim()) {
                    return;
                  }
                  createMutation.mutate({
                    category,
                    subject: title.trim(),
                    description: description.trim(),
                    priority,
                    attachments: attachments.map((file, index) => ({
                      id: `att-${Date.now()}-${index}`,
                      name: file.name,
                      type: file.type || "application/octet-stream",
                      sizeKb: Math.max(1, Math.round(file.size / 1024)),
                      url: URL.createObjectURL(file),
                    })),
                  });
                  setTitle("");
                  setDescription("");
                  setAttachments([]);
                  setCategory(ticketSubjectOptions[0]);
                }}
              >
                Submit Request
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
              {summary?.total ?? tickets.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Open</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {summary?.open ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Resolved</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {summary?.resolved ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {tickets.length ? (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                  Ticket
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                  Subject
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                  Updated
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => setSelectedTicketId(ticket.id)}
                >
                  <TableCell className="font-medium text-primary">
                    {ticket.id}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {ticket.subject}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", ticketStatusStyles[ticket.status])}
                    >
                      {ticketStatusLabels[ticket.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <SupportEmptyState
          title="No requests yet"
          description="Create a support request to reach admin support."
        />
      )}

      <SupportTicketDetail
        ticket={selectedTicket}
        messages={threads[selectedTicketId ?? ""] ?? []}
        currentAgent={null}
        onAssign={() => {}}
        onUnassign={() => {}}
        onStatusChange={() => {}}
        readOnly
        onFeedback={(rating) => {
          if (selectedTicketId) {
            feedbackMutation.mutate({ ticketId: selectedTicketId, rating });
          }
        }}
      />
    </div>
  );
}
