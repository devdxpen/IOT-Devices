"use client";

import { FiExternalLink, FiPaperclip, FiStar, FiUser } from "react-icons/fi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatRelativeTime } from "@/lib/helpers";
import {
  ticketPriorityLabels,
  ticketPriorityStyles,
  ticketStatusLabels,
  ticketStatusStyles,
  formatSlaDue,
} from "@/lib/support";
import { cn } from "@/lib/utils";
import type {
  SupportAgent,
  SupportTicket,
  SupportTicketMessage,
} from "@/types/support";
import { SupportTicketReply } from "@/components/forms/support-ticket-reply";

interface SupportTicketDetailProps {
  ticket: SupportTicket | null;
  messages: SupportTicketMessage[];
  currentAgent: SupportAgent | null;
  onAssign: () => void;
  onUnassign: () => void;
  onStatusChange: (status: SupportTicket["status"]) => void;
  readOnly?: boolean;
  onFeedback?: (rating: number) => void;
}

function MessageCard({ message }: { message: SupportTicketMessage }) {
  const initials = message.author.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "rounded-lg border border-border/70 p-3 text-sm",
        message.isInternal ? "bg-muted/40" : "bg-card",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold text-foreground">
              {message.author.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatRelativeTime(message.createdAt)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{message.body}</p>
          {message.attachments?.length ? (
            <div className="flex flex-wrap gap-2">
              {message.attachments.map((attachment) => {
                const hasPreview = Boolean(attachment.url);
                const isImage = attachment.type.startsWith("image/");
                const content = (
                  <>
                    {isImage && attachment.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="h-7 w-7 rounded-md border border-border/60 object-cover"
                      />
                    ) : (
                      <FiPaperclip className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="max-w-[160px] truncate text-foreground">
                      {attachment.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {attachment.sizeKb} KB
                    </span>
                    {hasPreview ? (
                      <FiExternalLink className="h-3 w-3 text-muted-foreground" />
                    ) : null}
                  </>
                );

                if (!hasPreview) {
                  return (
                    <div
                      key={attachment.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-2 py-1 text-xs opacity-70"
                    >
                      {content}
                    </div>
                  );
                }

                return (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-2 py-1 text-xs hover:bg-muted/60"
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SupportTicketDetail({
  ticket,
  messages,
  currentAgent,
  onAssign,
  onUnassign,
  onStatusChange,
  readOnly = false,
  onFeedback,
}: SupportTicketDetailProps) {
  const visibleMessages = readOnly
    ? messages.filter((message) => !message.isInternal)
    : messages;

  if (!ticket) {
    return (
      <Card className="border-border/70 shadow-sm">
        <CardContent className="flex min-h-[420px] items-center justify-center text-sm text-muted-foreground">
          Select a ticket to see the full conversation and status details.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold">
                {ticket.subject}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{ticket.id}</p>
            </div>
            <Badge
              variant="outline"
              className={cn("text-xs", ticketStatusStyles[ticket.status])}
            >
              {ticketStatusLabels[ticket.status]}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Opened {formatRelativeTime(ticket.createdAt)}</span>
            <span>|</span>
            <span>Updated {formatRelativeTime(ticket.updatedAt)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs", ticketPriorityStyles[ticket.priority])}
            >
              {ticketPriorityLabels[ticket.priority]} Priority
            </Badge>
            {ticket.category ? (
              <Badge variant="outline" className="text-xs">
                {ticket.category}
              </Badge>
            ) : null}
            {ticket.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Assigned To</div>
              <div className="font-medium text-foreground">
                {ticket.assignedAgentName ?? "Unassigned"}
              </div>
            </div>
            {!readOnly ? (
              <div className="flex flex-wrap items-center gap-2">
                {!ticket.assignedAgentId && currentAgent ? (
                  <Button size="sm" onClick={onAssign}>
                    Assign to Me
                  </Button>
                ) : ticket.assignedAgentId === currentAgent?.id ? (
                  <Button size="sm" variant="outline" onClick={onUnassign}>
                    Unassign
                  </Button>
                ) : null}
                {ticket.assignedAgentId === currentAgent?.id ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onStatusChange("on_hold")}
                      >
                        Put On Hold
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Use On Hold when waiting for user or vendor response.
                    </TooltipContent>
                  </Tooltip>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 rounded-lg border border-border/60 bg-card p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">SLA Deadline</span>
              <span className="font-medium text-foreground">
                {formatSlaDue(ticket.sla.responseDueAt)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Company</span>
              <span className="font-medium text-foreground">
                {ticket.companyName ?? "Independent User"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Requester</span>
              <span className="font-medium text-foreground">
                {ticket.requester.name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Support History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleMessages.length ? (
            visibleMessages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              No updates yet.
            </div>
          )}
          {ticket.resolutionNote ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3 text-sm text-emerald-700">
              <div className="mb-1 text-xs font-semibold uppercase">
                Resolution Note
              </div>
              {ticket.resolutionNote}
            </div>
          ) : null}

          {ticket.status === "resolved" || ticket.status === "closed" ? (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Feedback
              </div>
              <div className="mt-2 flex items-center gap-2">
                {Array.from({ length: 5 }, (_, index) => {
                  const value = index + 1;
                  const isActive = (ticket.feedbackRating ?? 0) >= value;
                  return (
                    <button
                      key={value}
                      type="button"
                      className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                        isActive
                          ? "border-amber-300 bg-amber-50 text-amber-500"
                          : "border-border text-muted-foreground"
                      }`}
                      onClick={() => {
                        if (readOnly && onFeedback && !ticket.feedbackRating) {
                          onFeedback(value);
                        }
                      }}
                      aria-label={`Rate ${value} stars`}
                    >
                      <FiStar className="h-4 w-4" />
                    </button>
                  );
                })}
                <span className="text-xs text-muted-foreground">
                  {ticket.feedbackRating
                    ? `${ticket.feedbackRating} / 5`
                    : "Rate support"}
                </span>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!readOnly && ticket.assignedAgentId === currentAgent?.id ? (
        <>
          <SupportTicketReply />
          <Button className="w-full" onClick={() => onStatusChange("resolved")}>
            Mark as Resolved
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <FiUser className="h-4 w-4" />
            User confirmation will close the ticket automatically.
          </div>
        </>
      ) : null}
    </div>
  );
}
