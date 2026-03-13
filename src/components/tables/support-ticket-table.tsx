"use client";

import { FiClipboard, FiMoreHorizontal, FiUserCheck } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ticketPriorityLabels,
  ticketPriorityStyles,
  ticketStatusLabels,
  ticketStatusStyles,
  formatSlaDue,
} from "@/lib/support";
import type {
  SupportAgent,
  SupportTicket,
  SupportTicketStatus,
} from "@/types/support";

interface SupportTicketTableProps {
  tickets: SupportTicket[];
  selectedTicketId: string | null;
  onSelect: (ticketId: string) => void;
  onAssign: (ticketId: string) => void;
  onUnassign: (ticketId: string) => void;
  onUpdateStatus: (ticketId: string, status: SupportTicketStatus) => void;
  currentAgent: SupportAgent | null;
  showActions?: boolean;
  showSource?: boolean;
}

export function SupportTicketTable({
  tickets,
  selectedTicketId,
  onSelect,
  onAssign,
  onUnassign,
  onUpdateStatus,
  currentAgent,
  showActions = true,
  showSource = false,
}: SupportTicketTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
              Ticket
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
              Requester
            </TableHead>
            {showSource ? (
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                Source
              </TableHead>
            ) : null}
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
              Priority
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
              Assignment
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
              SLA
            </TableHead>
            {showActions ? (
              <TableHead className="text-right text-xs font-semibold uppercase text-muted-foreground">
                Actions
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => {
            const isSelected = ticket.id === selectedTicketId;
            return (
              <TableRow
                key={ticket.id}
                className={cn(
                  "cursor-pointer transition hover:bg-muted/40",
                  isSelected && "bg-muted/40",
                )}
                onClick={() => onSelect(ticket.id)}
              >
                <TableCell className="min-w-[200px]">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-primary">
                      {ticket.id}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {ticket.subject}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.companyName ?? "Independent User"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-foreground">
                      {ticket.requester.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.requester.email}
                    </div>
                  </div>
                </TableCell>
                {showSource ? (
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {ticket.requesterType === "company"
                        ? "Company"
                        : ticket.companyId
                          ? "IoT User"
                          : "Independent"}
                    </Badge>
                  </TableCell>
                ) : null}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", ticketPriorityStyles[ticket.priority])}
                  >
                    {ticketPriorityLabels[ticket.priority]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", ticketStatusStyles[ticket.status])}
                  >
                    {ticketStatusLabels[ticket.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {ticket.assignedAgentName ? (
                    <div className="text-sm font-medium text-foreground">
                      {ticket.assignedAgentName}
                    </div>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-dashed text-xs text-muted-foreground"
                    >
                      Unassigned
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-foreground">
                    {formatSlaDue(ticket.sla.responseDueAt)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ticket.sla.risk.toUpperCase()} risk
                  </div>
                </TableCell>
                {showActions ? (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                    {!ticket.assignedAgentId && currentAgent ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(event) => {
                                event.stopPropagation();
                                onAssign(ticket.id);
                              }}
                            >
                              <FiUserCheck className="mr-2 h-4 w-4" />
                              Assign to Me
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Claim this ticket</TooltipContent>
                        </Tooltip>
                      ) : null}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <FiMoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(event) => {
                              event.stopPropagation();
                              onSelect(ticket.id);
                            }}
                          >
                            <FiClipboard className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                        {ticket.assignedAgentId === currentAgent?.id ? (
                          <DropdownMenuItem
                            onClick={(event) => {
                              event.stopPropagation();
                              onUnassign(ticket.id);
                            }}
                          >
                            Unassign
                          </DropdownMenuItem>
                        ) : null}
                        {ticket.assignedAgentId === currentAgent?.id ? (
                          <>
                            <DropdownMenuItem
                              onClick={(event) => {
                                event.stopPropagation();
                                onUpdateStatus(ticket.id, "on_hold");
                              }}
                            >
                              Mark On Hold
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(event) => {
                                event.stopPropagation();
                                onUpdateStatus(ticket.id, "resolved");
                              }}
                            >
                              Mark Resolved
                            </DropdownMenuItem>
                          </>
                        ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
