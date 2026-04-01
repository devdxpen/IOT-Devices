"use client";

import { useEffect, useMemo, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { useDemoSession } from "@/hooks/use-demo-session";
import { useSupportQueue } from "@/hooks/use-support-tickets";
import { SupportTicketTable } from "@/components/tables/support-ticket-table";
import { SupportTicketDetail } from "@/components/widgets/support-ticket-detail";
import { SupportEmptyState, SupportErrorState, SupportLoadingState } from "@/components/layout/support-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ticketPriorityLabels, ticketStatusLabels } from "@/lib/support";
import type { SupportAgent, SupportTicketPriority, SupportTicketStatus } from "@/types/support";

const statusOrder: Array<SupportTicketStatus | "all"> = [
  "all",
  "new",
  "in_progress",
  "on_hold",
  "resolved",
  "closed",
  "cancelled",
];

const priorityOrder: Array<SupportTicketPriority | "all"> = [
  "all",
  "low",
  "medium",
  "high",
  "critical",
];

interface SupportQueueViewProps {
  scope: "company" | "admin";
}

export function SupportQueueView({ scope }: SupportQueueViewProps) {
  const session = useDemoSession();
  const { query, assignMutation, unassignMutation, statusMutation } =
    useSupportQueue();

  const [queueTab, setQueueTab] = useState<"open" | "mine" | "resolved">(
    "open",
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SupportTicketStatus | "all">(
    "all",
  );
  const [priorityFilter, setPriorityFilter] = useState<
    SupportTicketPriority | "all"
  >("all");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const tickets = query.data?.tickets ?? [];
  const threads = query.data?.threads ?? {};

  const currentAgent: SupportAgent | null = session
    ? {
        id: session.userId,
        name: session.displayName,
        title: scope === "admin" ? "Admin Support" : "Company Support",
        companyId: session.companyId ?? null,
        availability: "online",
        activeTickets: 0,
      }
    : null;

  const queueCounts = useMemo(() => {
    const openStatuses: SupportTicketStatus[] = [
      "new",
      "in_progress",
      "on_hold",
    ];
    const resolvedStatuses: SupportTicketStatus[] = [
      "resolved",
      "closed",
      "cancelled",
    ];

    return {
      open: tickets.filter((ticket) => openStatuses.includes(ticket.status))
        .length,
      mine: tickets.filter(
        (ticket) => ticket.assignedAgentId === currentAgent?.id,
      ).length,
      resolved: tickets.filter((ticket) =>
        resolvedStatuses.includes(ticket.status),
      ).length,
    };
  }, [tickets, currentAgent?.id]);

  const filteredTickets = useMemo(() => {
    const openStatuses: SupportTicketStatus[] = [
      "new",
      "in_progress",
      "on_hold",
    ];
    const resolvedStatuses: SupportTicketStatus[] = [
      "resolved",
      "closed",
      "cancelled",
    ];

    return tickets.filter((ticket) => {
      if (queueTab === "open" && !openStatuses.includes(ticket.status)) {
        return false;
      }
      if (queueTab === "resolved" && !resolvedStatuses.includes(ticket.status)) {
        return false;
      }
      if (queueTab === "mine" && ticket.assignedAgentId !== currentAgent?.id) {
        return false;
      }
      if (statusFilter !== "all" && ticket.status !== statusFilter) {
        return false;
      }
      if (priorityFilter !== "all" && ticket.priority !== priorityFilter) {
        return false;
      }
      if (search.trim()) {
        const normalized = search.toLowerCase();
        return (
          ticket.id.toLowerCase().includes(normalized) ||
          ticket.subject.toLowerCase().includes(normalized) ||
          ticket.requester.name.toLowerCase().includes(normalized)
        );
      }
      return true;
    });
  }, [tickets, queueTab, currentAgent?.id, statusFilter, priorityFilter, search]);

  useEffect(() => {
    if (!filteredTickets.length) {
      setSelectedTicketId(null);
      return;
    }
    if (
      !selectedTicketId ||
      !filteredTickets.some((ticket) => ticket.id === selectedTicketId)
    ) {
      setSelectedTicketId(filteredTickets[0].id);
    }
  }, [filteredTickets, selectedTicketId]);

  if (query.isLoading) {
    return <SupportLoadingState />;
  }

  if (query.isError) {
    return (
      <SupportErrorState
        title="Unable to load support tickets"
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
            {scope === "admin" ? "Admin Support Queue" : "Company Support Queue"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {scope === "admin"
              ? "Independent IoT users route directly to admin support."
              : "Company engineers self-assign tickets to start work."}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {currentAgent?.name ?? "Support Engineer"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">Total Open</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {tickets.filter(t => t.status === "new").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">In Progress</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {tickets.filter(t => t.status === "in_progress" || t.status === "on_hold").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">Resolved</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {tickets.filter(t => t.status === "resolved").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">Closed</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {tickets.filter(t => t.status === "closed" || t.status === "cancelled").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={queueTab}
          onValueChange={(value) =>
            setQueueTab(value as "open" | "mine" | "resolved")
          }
        >
          <TabsList>
            <TabsTrigger value="open">
              Open
              <span className="ml-2 text-xs text-muted-foreground">
                {queueCounts.open}
              </span>
            </TabsTrigger>
            <TabsTrigger value="mine">
              My Tickets
              <span className="ml-2 text-xs text-muted-foreground">
                {queueCounts.mine}
              </span>
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved
              <span className="ml-2 text-xs text-muted-foreground">
                {queueCounts.resolved}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px]">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tickets"
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as SupportTicketStatus | "all")
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOrder.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "all" ? "All Statuses" : ticketStatusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priorityFilter}
            onValueChange={(value) =>
              setPriorityFilter(value as SupportTicketPriority | "all")
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOrder.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority === "all"
                    ? "All Priorities"
                    : ticketPriorityLabels[priority]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <FiFilter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          {filteredTickets.length ? (
            <SupportTicketTable
              tickets={filteredTickets}
              selectedTicketId={selectedTicketId}
              onSelect={setSelectedTicketId}
              onAssign={(ticketId) => assignMutation.mutate(ticketId)}
              onUnassign={(ticketId) => unassignMutation.mutate(ticketId)}
              onUpdateStatus={(ticketId, status) =>
                statusMutation.mutate({ ticketId, status })
              }
              currentAgent={currentAgent}
              showSource={scope === "admin"}
            />
          ) : (
            <SupportEmptyState
              title="No tickets in this queue"
              description="Try adjusting the filters or switch tabs to view more tickets."
            />
          )}
        </div>

        <div className="xl:col-span-5">
          <SupportTicketDetail
            ticket={
              filteredTickets.find((ticket) => ticket.id === selectedTicketId) ??
              null
            }
            messages={threads[selectedTicketId ?? ""] ?? []}
            currentAgent={currentAgent}
            onAssign={() => {
              if (selectedTicketId) {
                assignMutation.mutate(selectedTicketId);
              }
            }}
            onUnassign={() => {
              if (selectedTicketId) {
                unassignMutation.mutate(selectedTicketId);
              }
            }}
            onStatusChange={(status) => {
              if (selectedTicketId) {
                statusMutation.mutate({ ticketId: selectedTicketId, status });
              }
            }}
            onFeedback={undefined}
          />
        </div>
      </div>
    </div>
  );
}
