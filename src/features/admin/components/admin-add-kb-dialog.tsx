"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdminAddKbDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "Knowledge Base" | "FAQ & Guide";
}

export function AdminAddKbDialog({ open, onOpenChange, type }: AdminAddKbDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add {type === "Knowledge Base" ? "Category" : "FAQ"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            {type === "Knowledge Base" ? (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input id="categoryName" placeholder="Enter category name" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Enter description..." className="min-h-[100px]" />
                    </div>
                </>
            ) : (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="question">Question</Label>
                        <Input id="question" placeholder="Enter question" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea id="answer" placeholder="Enter answer..." className="min-h-[100px]" />
                    </div>
                </>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" className="bg-[#2596be] hover:bg-[#1a7a9c] text-white">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
