"use client";

import { useMemo, useState } from "react";
import {
  FiEye,
  FiGrid,
  FiList,
  FiPlus,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { useSupportMyTickets } from "@/hooks/use-support-tickets";
import {
  SupportEmptyState,
  SupportErrorState,
  SupportLoadingState,
} from "@/components/layout/support-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ticketStatusLabels,
  ticketStatusStyles,
  ticketSubjectOptions,
} from "@/lib/support";
import { cn } from "@/lib/utils";
import type {
  SupportTicketAttachment,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/types/support";

const priorities: SupportTicketPriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

const statusFilters: Array<SupportTicketStatus | "all"> = [
  "all",
  "new",
  "in_progress",
  "on_hold",
  "resolved",
  "closed",
  "cancelled",
];

type LocalAttachment = {
  id: string;
  file: File;
  previewUrl?: string;
};

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return "-";
  }
  return date.toLocaleDateString("en-GB");
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return "-";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function buildAttachmentPayload(attachments: LocalAttachment[]) {
  return attachments.map((item, index) => ({
    id: `att-${Date.now()}-${index}`,
    name: item.file.name,
    type: item.file.type || "application/octet-stream",
    sizeKb: Math.max(1, Math.round(item.file.size / 1024)),
    url: item.previewUrl,
  }));
}

function TicketAttachmentList({
  attachments,
  removable,
  onRemove,
}: {
  attachments: Array<
    LocalAttachment | (SupportTicketAttachment & { previewUrl?: string })
  >;
  removable?: boolean;
  onRemove?: (id: string) => void;
}) {
  if (!attachments.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      {attachments.map((item) => {
        const url = "file" in item ? item.previewUrl : item.url;
        const hasUrl = Boolean(url);
        const isImage = ("file" in item
          ? item.file.type
          : item.type
        ).startsWith("image/");
        const content = (
          <div className="flex min-w-0 items-center gap-3">
              {isImage && url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={"file" in item ? item.file.name : item.name}
                  className="h-12 w-12 rounded-lg border border-border/60 object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg border border-border/60 bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100" />
              )}
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">
                  {"file" in item ? item.file.name : item.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {"file" in item
                    ? `${Math.max(1, Math.round(item.file.size / 1024))} KB`
                    : `${item.sizeKb} KB`}
                </div>
              </div>
            </div>
        );

        return (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2"
          >
            {hasUrl ? (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex min-w-0 items-center gap-3 hover:opacity-80"
              >
                {content}
              </a>
            ) : (
              <div className="flex min-w-0 items-center gap-3">{content}</div>
            )}
            {removable ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onRemove?.(item.id)}
              >
                <FiX className="h-4 w-4 text-rose-500" />
              </Button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function SupportUserTicketsView() {
  const { query, createMutation, feedbackMutation } = useSupportMyTickets();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [statusFilter, setStatusFilter] = useState<
    SupportTicketStatus | "all"
  >("all");
  const [search, setSearch] = useState("");

  const [priority, setPriority] = useState<SupportTicketPriority>("medium");
  const [category, setCategory] = useState(ticketSubjectOptions[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);

  const tickets = query.data?.tickets ?? [];
  const threads = query.data?.threads ?? {};
  const summary = query.data?.summary;

  const filteredTickets = useMemo(() => {
    const queryValue = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      if (statusFilter !== "all" && ticket.status !== statusFilter) {
        return false;
      }
      if (!queryValue) {
        return true;
      }
      return (
        ticket.id.toLowerCase().includes(queryValue) ||
        ticket.subject.toLowerCase().includes(queryValue) ||
        ticket.description.toLowerCase().includes(queryValue) ||
        (ticket.category ?? "").toLowerCase().includes(queryValue) ||
        ticket.requester.name.toLowerCase().includes(queryValue)
      );
    });
  }, [tickets, search, statusFilter]);

  const selectedTicket = useMemo(
    () =>
      filteredTickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [filteredTickets, selectedTicketId],
  );

  const detailAttachments = useMemo(() => {
    if (!selectedTicketId) {
      return [];
    }
    return (threads[selectedTicketId] ?? []).flatMap((message) =>
      message.attachments ?? [],
    );
  }, [selectedTicketId, threads]);

  const todayValue = useMemo(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  }, []);

  if (query.isLoading) {
    return <SupportLoadingState />;
  }

  if (query.isError) {
    return (
      <SupportErrorState
        title="Unable to load your tickets"
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
            My Support Tickets
          </h2>
          <p className="text-sm text-muted-foreground">List View</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <FiPlus className="mr-2 h-4 w-4" />
              Raise Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 text-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Reason
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketSubjectOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Date
                  </label>
                  <Input type="date" defaultValue={todayValue} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Title
                  </label>
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Brief description about user message"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Priority
                  </label>
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
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Please provide detailed information about the call"
                  className="min-h-[160px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Attachments
                </label>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(event) => {
                    const files = event.target.files
                      ? Array.from(event.target.files)
                      : [];
                    const next = files.map((file, index) => ({
                      id: `local-${Date.now()}-${index}`,
                      file,
                      previewUrl: URL.createObjectURL(file),
                    }));
                    setAttachments(next);
                  }}
                />
                <TicketAttachmentList
                  attachments={attachments}
                  removable
                  onRemove={(id) =>
                    setAttachments((prev) => {
                      const target = prev.find((item) => item.id === id);
                      if (target?.previewUrl) {
                        URL.revokeObjectURL(target.previewUrl);
                      }
                      return prev.filter((item) => item.id !== id);
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    attachments.forEach((item) => {
                      if (item.previewUrl) {
                        URL.revokeObjectURL(item.previewUrl);
                      }
                    });
                    setTitle("");
                    setDescription("");
                    setAttachments([]);
                    setCategory(ticketSubjectOptions[0]);
                    setPriority("medium");
                  }}
                >
                  Cancel
                </Button>
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
                      attachments: buildAttachmentPayload(attachments),
                    });
                    attachments.forEach((item) => {
                      if (item.previewUrl) {
                        URL.revokeObjectURL(item.previewUrl);
                      }
                    });
                    setTitle("");
                    setCategory(ticketSubjectOptions[0]);
                    setDescription("");
                    setAttachments([]);
                  }}
                >
                  Submit Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Tickets</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {summary?.total ?? tickets.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Open Tickets</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {summary?.open ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Resolved Tickets</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {summary?.resolved ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
        <div className="relative w-full max-w-xs">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as SupportTicketStatus | "all")
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "all" ? "All Status" : ticketStatusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex rounded-lg border border-border/60 bg-background p-1">
            <Button
              type="button"
              size="icon"
              variant={viewMode === "list" ? "secondary" : "ghost"}
              onClick={() => setViewMode("list")}
              className="h-8 w-8"
            >
              <FiList className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
            >
              <FiGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredTickets.length ? (
        viewMode === "list" ? (
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                    Reason
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                    Title
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                    Description
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                    Demonstrated By
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                    Created Date
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => {
                      setSelectedTicketId(ticket.id);
                      setDetailOpen(true);
                    }}
                  >
                    <TableCell className="text-sm text-muted-foreground">
                      {ticket.category ?? "General"}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">
                      {ticket.subject}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span className="block max-w-[220px] truncate">
                        {ticket.description}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px] font-semibold">
                            {initialsFromName(ticket.requester.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-xs">
                          <div className="font-semibold text-foreground">
                            {ticket.requester.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {ticket.requester.companyName ?? "IoT User"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div>{formatDate(ticket.createdAt)}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {formatTime(ticket.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          ticketStatusStyles[ticket.status],
                        )}
                      >
                        {ticketStatusLabels[ticket.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedTicketId(ticket.id);
                          setDetailOpen(true);
                        }}
                      >
                        <FiEye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="border-border/70 shadow-sm">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {ticket.category ?? "General"}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {ticket.subject}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        ticketStatusStyles[ticket.status],
                      )}
                    >
                      {ticketStatusLabels[ticket.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {ticket.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {formatDate(ticket.createdAt)} at {formatTime(ticket.createdAt)}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8"
                      onClick={() => {
                        setSelectedTicketId(ticket.id);
                        setDetailOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        <SupportEmptyState
          title="No tickets yet"
          description="When you raise a ticket, updates will appear here."
        />
      )}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.subject ?? "Ticket"}</DialogTitle>
          </DialogHeader>
          {selectedTicket ? (
            <div className="space-y-4 text-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Reason</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {selectedTicket.category ?? "General"}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {formatDate(selectedTicket.createdAt)}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Title</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {selectedTicket.subject}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {selectedTicket.priority}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="mt-2 text-sm text-foreground">
                  {selectedTicket.description}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  Attachments
                </p>
                <TicketAttachmentList attachments={detailAttachments} />
              </div>
              <div className="flex items-center justify-end">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    ticketStatusStyles[selectedTicket.status],
                  )}
                >
                  {ticketStatusLabels[selectedTicket.status]}
                </Badge>
              </div>
              {(selectedTicket.status === "resolved" ||
                selectedTicket.status === "closed") &&
              !selectedTicket.feedbackRating ? (
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
                  You can rate the support quality after resolution.
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
