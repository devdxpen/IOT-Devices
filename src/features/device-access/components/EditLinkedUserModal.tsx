"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import type { LinkedUser, LinkedUserRole } from "@/types/linked-user";

interface EditLinkedUserModalProps {
  open: boolean;
  user: LinkedUser | null;
  onClose: () => void;
  onSave: (updatedUser: LinkedUser) => void;
}

export function EditLinkedUserModal({
  open,
  user,
  onClose,
  onSave,
}: EditLinkedUserModalProps) {
  const [role, setRole] = useState<LinkedUserRole>("Viewer");
  const [validitySpan, setValiditySpan] = useState("1 Year");
  const [notification, setNotification] = useState(true);

  // Sync local state when user changes
  useEffect(() => {
    if (user) {
      setRole(user.role);
      setNotification(user.notification);
      // Try to derive validity span from expiry
      setValiditySpan(user.expiryDate === "No Expiry" ? "Forever" : "1 Year");
    }
  }, [user]);

  const computeExpiryDate = (): string => {
    // Use the original joining date as the base to compute the new expiry
    const base = new Date();

    switch (validitySpan) {
      case "1 Month": {
        const d = new Date(base);
        d.setMonth(base.getMonth() + 1);
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      case "6 Months": {
        const d = new Date(base);
        d.setMonth(base.getMonth() + 6);
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      case "1 Year": {
        const d = new Date(base);
        d.setFullYear(base.getFullYear() + 1);
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      case "Forever":
      default:
        return "No Expiry";
    }
  };

  const handleSave = () => {
    if (!user) return;

    const updatedUser: LinkedUser = {
      ...user,
      role,
      notification,
      expiryDate:
        role === "Ownership Transfer" ? "No Expiry" : computeExpiryDate(),
      status: "Active",
    };

    onSave(updatedUser);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-xl border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-800">
              Edit User Access
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-1.5 leading-relaxed">
              Update permissions for{" "}
              <span className="font-semibold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm mx-1">
                {user.name}
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 bg-white">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user.email} • {user.mobile}
              </p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              Assign Role
              <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                Required
              </span>
            </Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as LinkedUserRole)}
            >
              <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200 transition-colors focus:ring-primary/20 focus:border-primary">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="border-slate-200 shadow-lg rounded-xl">
                <SelectItem value="Viewer" className="py-2.5 cursor-pointer">
                  Viewer — Read only
                </SelectItem>
                <SelectItem value="Admin" className="py-2.5 cursor-pointer">
                  Admin — Full control
                </SelectItem>
                <SelectItem
                  value="Ownership Transfer"
                  className="py-2.5 cursor-pointer text-amber-700 focus:text-amber-800 focus:bg-amber-50"
                >
                  Ownership — Permanent transfer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Validity Selection */}
          {role !== "Ownership Transfer" && (
            <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Access Validity
                <span className="text-slate-400 font-normal text-xs">
                  (Timeframe)
                </span>
              </Label>
              <Select value={validitySpan} onValueChange={setValiditySpan}>
                <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200 transition-colors focus:ring-primary/20 focus:border-primary">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 shadow-lg rounded-xl">
                  <SelectItem value="1 Month" className="py-2.5 cursor-pointer">
                    1 Month
                  </SelectItem>
                  <SelectItem
                    value="6 Months"
                    className="py-2.5 cursor-pointer"
                  >
                    6 Months
                  </SelectItem>
                  <SelectItem value="1 Year" className="py-2.5 cursor-pointer">
                    1 Year
                  </SelectItem>
                  <SelectItem value="Forever" className="py-2.5 cursor-pointer">
                    Forever (No Expiry)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notification Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <Label className="text-sm font-medium text-slate-700">
                Notifications
              </Label>
              <p className="text-xs text-slate-500 mt-0.5">
                Send alerts and notifications to this user
              </p>
            </div>
            <Switch
              checked={notification}
              onCheckedChange={setNotification}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-10 px-5 text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="h-10 px-6 bg-primary hover:bg-primary/90 text-white shadow-sm transition-all duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
