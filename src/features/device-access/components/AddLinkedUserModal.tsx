"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Loader2, UserPlus, AlertCircle } from "lucide-react";
import { searchRegisteredUser } from "@/lib/mock-api/linked-users";
import type {
  RegisteredUser,
  LinkedUser,
  LinkedUserRole,
} from "@/types/linked-user";

interface AddLinkedUserModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (user: LinkedUser) => void;
}

export function AddLinkedUserModal({
  open,
  onClose,
  onAdd,
}: AddLinkedUserModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<RegisteredUser | null>(null);

  // Configuration fields
  const [role, setRole] = useState<LinkedUserRole>("Viewer");
  const [validitySpan, setValiditySpan] = useState("1 Year");
  const [notification, setNotification] = useState(true);

  const resetState = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchError(null);
    setFoundUser(null);
    setRole("Viewer");
    setValiditySpan("1 Year");
    setNotification(true);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setFoundUser(null);

    const result = await searchRegisteredUser(searchQuery);

    if (result) {
      setFoundUser(result);
    } else {
      setSearchError(
        "No registered user found with this Mobile No. or Email ID.",
      );
    }
    setIsSearching(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const computeExpiryDate = (): string => {
    const today = new Date();

    switch (validitySpan) {
      case "1 Month": {
        const d = new Date(today);
        d.setMonth(today.getMonth() + 1);
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      case "6 Months": {
        const d = new Date(today);
        d.setMonth(today.getMonth() + 6);
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      case "1 Year": {
        const d = new Date(today);
        d.setFullYear(today.getFullYear() + 1);
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

  const handleAddUser = () => {
    if (!foundUser) return;

    const today = new Date();
    const joiningDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newUser: LinkedUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      mobile: foundUser.mobile,
      role,
      status: "Active",
      notification,
      joiningDate,
      expiryDate:
        role === "Ownership Transfer" ? "No Expiry" : computeExpiryDate(),
    };

    onAdd(newUser);
    handleClose();
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-xl border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-800">
              Add User to Device
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-1.5 leading-relaxed">
              Search for a registered user by their exact Mobile No. or Email
              ID, then configure their access.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5 bg-white">
          {/* Search Section */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-700">
              Search Registered User
              <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold ml-2">
                Required
              </span>
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Enter exact Mobile No. or Email ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  className="pl-9 h-11 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-primary"
                  autoComplete="off"
                  disabled={isSearching}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
                className="h-11 px-5 bg-[#1C2C4F] hover:bg-[#152240] text-white shrink-0"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {/* Error State */}
            {searchError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {searchError}
              </div>
            )}
          </div>

          {/* Found User Card */}
          {foundUser && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-5">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <Avatar className="h-10 w-10 border border-green-200">
                  <AvatarFallback className="bg-green-100 text-green-700 text-sm font-semibold">
                    {getInitials(foundUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {foundUser.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {foundUser.email} • {foundUser.mobile}
                  </p>
                </div>
                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full border border-green-200">
                  Match Found
                </span>
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
                    <SelectItem
                      value="Viewer"
                      className="py-2.5 cursor-pointer"
                    >
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
                      <SelectItem
                        value="1 Month"
                        className="py-2.5 cursor-pointer"
                      >
                        1 Month
                      </SelectItem>
                      <SelectItem
                        value="6 Months"
                        className="py-2.5 cursor-pointer"
                      >
                        6 Months
                      </SelectItem>
                      <SelectItem
                        value="1 Year"
                        className="py-2.5 cursor-pointer"
                      >
                        1 Year
                      </SelectItem>
                      <SelectItem
                        value="Forever"
                        className="py-2.5 cursor-pointer"
                      >
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
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-10 px-5 text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            disabled={!foundUser}
            className="h-10 px-6 bg-primary hover:bg-primary/90 text-white shadow-sm transition-all duration-200"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
