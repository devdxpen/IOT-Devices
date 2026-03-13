"use client";

import { FiPaperclip } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SupportTicketReplyProps {
  onAddNote?: () => void;
}

export function SupportTicketReply({ onAddNote }: SupportTicketReplyProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-card shadow-sm">
      <div className="border-b border-border/60 px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Internal Log Note</p>
        <p className="text-xs text-muted-foreground">
          Notes are internal-only. No live chat with customers.
        </p>
      </div>

      <div className="space-y-3 px-4 py-4">
        <Textarea
          placeholder="Add internal troubleshooting notes..."
          className="min-h-[110px]"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" size="sm">
            <FiPaperclip className="mr-2 h-4 w-4" />
            Attach file
          </Button>
          <Button size="sm" variant="secondary" onClick={onAddNote}>
            Save note
          </Button>
        </div>
      </div>
    </div>
  );
}
