"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  BookOpen,
  FileQuestion,
  HelpCircle,
  LifeBuoy,
  Phone,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { createSupportTicket } from "@/lib/support-api";
import { ticketSubjectOptions } from "@/lib/support";
import type { SupportTicketPriority } from "@/types/support";

const priorityOptions: SupportTicketPriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

export default function HelpPage() {
  const [ticketOpen, setTicketOpen] = useState(false);
  const [category, setCategory] = useState(ticketSubjectOptions[0]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<SupportTicketPriority>("medium");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const createMutation = useMutation({
    mutationFn: createSupportTicket,
    onSuccess: () => {
      setTicketOpen(false);
      setDescription("");
      setAttachments([]);
      setCategory(ticketSubjectOptions[0]);
      setTitle("");
      setPriority("medium");
    },
  });

  return (
    <div className="p-8 space-y-12">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 bg-blue-50 text-[#2596be] rounded-3xl flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
          <HelpCircle className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">
            Get the Help You Need
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            We are here to support you every step of the way. Choose the channel
            that works best for you.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center space-y-6 flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-blue-50 text-[#2596be]">
              <Ticket className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Support Ticket</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Raise a ticket with title, priority, and attachments.
              </p>
            </div>
            <DialogTrigger asChild>
              <Button className="w-full mt-auto bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl">
                Open Ticket
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Select a subject and add priority, description, and attachments.
              </DialogDescription>
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
                  {priorityOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the issue"
                className="min-h-[120px]"
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
                      <li key={file.name} className="flex items-center justify-between">
                        <span className="truncate">{file.name}</span>
                        <span>{Math.max(1, Math.round(file.size / 1024))} KB</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <DialogFooter>
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
                }}
              >
                Submit Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center space-y-6 flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-orange-50 text-orange-600">
              <Phone className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Book a Call</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Confirm before scheduling a support call.
              </p>
            </div>
            <DialogTrigger asChild>
              <Button className="w-full mt-auto bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl">
                Book a Call
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Call Request</DialogTitle>
              <DialogDescription>
                We will create a call request and notify the support team.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button asChild>
                <Link href="/support/call-requests">Confirm</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center space-y-6 flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600">
              <LifeBuoy className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Book Demo</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Confirm before submitting a demo request.
              </p>
            </div>
            <DialogTrigger asChild>
              <Button className="w-full mt-auto bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl">
                Book Demo
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Demo Request</DialogTitle>
              <DialogDescription>
                We will redirect you to the demo request form.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button asChild>
                <Link href="/support/demo-request">Continue</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
        <Link
          href="/support/knowledge-base"
          className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-colors"
        >
          <BookOpen className="h-6 w-6 text-blue-500 shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">Knowledge Base</h4>
            <p className="text-sm text-slate-500">
              Browse guides, troubleshooting tips, and setup walkthroughs.
            </p>
          </div>
        </Link>
        <Link
          href="/support/faq"
          className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-colors"
        >
          <FileQuestion className="h-6 w-6 text-emerald-500 shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">FAQ</h4>
            <p className="text-sm text-slate-500">
              Quick answers to common support questions.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
