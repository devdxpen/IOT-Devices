"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IoSearchOutline } from "react-icons/io5";
import { LuFilter } from "react-icons/lu";
import { toast } from "sonner";

import { DeviceAccessTable } from "./DeviceAccessTable";
import { SendAccessRequestForm } from "./SendAccessRequestForm";
import { DeviceAccessRequest, TabType } from "@/lib/mock-api/device-requests";

// We import the dummy data to initialize the global state
import { fetchDeviceRequests } from "@/lib/mock-api/device-requests";

export function DeviceAccessManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("access");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  
  // Accept Modal States
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DeviceAccessRequest | null>(null);
  const [acceptRole, setAcceptRole] = useState<string>("Viewer");
  const [validitySpan, setValiditySpan] = useState<string>("1 Year");

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  // Global Data State
  const [allRequests, setAllRequests] = useState<DeviceAccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data once
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data types simultaneously to populate global state
        const accessReqs = await fetchDeviceRequests("access");
        const receivedReqs = await fetchDeviceRequests("received");
        const sentReqs = await fetchDeviceRequests("sent");
        
        if (isMounted) {
          setAllRequests([...accessReqs, ...receivedReqs, ...sentReqs]);
        }
      } catch (error) {
        console.error("Failed to fetch initial device requests", error);
        toast.error("Failed to load device requests.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter requests based on active tab, search query, and filters
  const filteredRequests = allRequests.filter(req => {
    // 1. Tab Filter
    if (req.type !== activeTab) return false;
    
    // 2. Search Filter (matches user name, user handle, or device name/id)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        req.user.name.toLowerCase().includes(q) || 
        req.user.handle.toLowerCase().includes(q) || 
        req.device.name.toLowerCase().includes(q) || 
        req.device.id.toLowerCase().includes(q);
      
      if (!matchesSearch) return false;
    }

    // 3. Status Filter
    if (statusFilter !== "All" && req.status !== statusFilter) return false;

    // 4. Role Filter
    if (roleFilter !== "All" && req.role !== roleFilter) return false;

    return true;
  });

  // --- INTERACTION HANDLERS ---

  // Handle deletions (trash, cancel, reject)
  const handleDeleteRequest = (id: string, actionType: "delete" | "reject" | "cancel" = "delete") => {
    setAllRequests(prev => prev.filter(req => req.id !== id));
    
    // Provide specific toast feedback based on the action
    if (actionType === "reject") {
      toast.success("Request rejected successfully.");
    } else if (actionType === "cancel") {
      toast.success("Request cancelled successfully.");
    } else {
      toast.success("Access removed successfully.");
    }
  };

  // Handle setting notification state
  const handleToggleNotification = (id: string, enabled: boolean) => {
    setAllRequests(prev => prev.map(req => req.id === id ? { ...req, notification: enabled } : req));
    toast.success(`Notifications ${enabled ? 'enabled' : 'disabled'} for device.`);
  };

  // Handle sending a new request
  const handleSendRequest = (deviceId: string) => {
    const newSentRequest: DeviceAccessRequest = {
      id: `req-new-${Date.now()}`,
      type: "sent",
      user: {
        name: "Current User",
        handle: "current_user",
        avatar: "https://i.pravatar.cc/150?img=11",
        isOnline: true,
      },
      device: { id: deviceId, name: "Unknown Device" },
      notification: true,
      joiningDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: "-",
      status: "Pending",
      role: "Pending",
    };
    setAllRequests(prev => [newSentRequest, ...prev]);
    setIsRequestModalOpen(false); // Close modal on success
    toast.success("Access request sent to device owner.");
  };

  // Open the accept dialog
  const handleAcceptInit = (req: DeviceAccessRequest) => {
    setSelectedRequest(req);
    setAcceptRole("Viewer"); // Default
    setValiditySpan("1 Year"); // Default
    setIsAcceptModalOpen(true);
  };

  // Confirm accept from the modal
  const handleConfirmAccept = () => {
    if (!selectedRequest) return;

    if (acceptRole === "Ownership Transfer") {
      setIsWarningModalOpen(true);
      return;
    }
    
    finalizeAccept();
  };

  const finalizeAccept = () => {
    if (!selectedRequest) return;
    
    const today = new Date();
    const formattedJoin = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    let formattedExpiry = "-"; // Default to no expiry representation
    
    if (acceptRole !== "Ownership Transfer") {
      if (validitySpan === "1 Month") {
        const nextDate = new Date(today);
        nextDate.setMonth(today.getMonth() + 1);
        formattedExpiry = nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      } else if (validitySpan === "6 Months") {
        const nextDate = new Date(today);
        nextDate.setMonth(today.getMonth() + 6);
        formattedExpiry = nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      } else if (validitySpan === "1 Year") {
        const nextDate = new Date(today);
        nextDate.setFullYear(today.getFullYear() + 1);
        formattedExpiry = nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      } else if (validitySpan === "Forever") {
        formattedExpiry = "-"; // "Forever" or "Admin" full access has no expiry date
      }
    }

    setAllRequests(prev => 
      prev.map(item => {
        if (item.id === selectedRequest.id) {
          return { 
            ...item, 
            type: "access", 
            role: acceptRole,
            joiningDate: formattedJoin,
            expiryDate: formattedExpiry,
            status: "Active"
          };
        }
        return item;
      })
    );
    setIsAcceptModalOpen(false);
    setIsWarningModalOpen(false);
    
    if (acceptRole === "Ownership Transfer") {
      toast.success(`Ownership transferred to ${selectedRequest.user.name}.`);
    } else {
      toast.success(`Access granted to ${selectedRequest.user.name}.`);
    }
  };


  // Handle Role update
  const handleUpdateRole = (id: string, newRole: string) => {
    setAllRequests(prev => prev.map(req => req.id === id ? { ...req, role: newRole } : req));
    toast.success("User role updated successfully.");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center p-5 border-b border-slate-100 gap-5 bg-white">
        {/* Left Side: Segmented Control Tabs */}
        <div className="flex bg-slate-100/80 p-1 rounded-lg w-full sm:w-auto overflow-x-auto shadow-inner border border-slate-200/50">
          <button
            onClick={() => setActiveTab("access")}
            className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out whitespace-nowrap min-w-max ${
              activeTab === "access"
                ? "bg-white text-[#2596be] shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            Devices Access
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out whitespace-nowrap min-w-max ${
              activeTab === "received"
                ? "bg-white text-[#2596be] shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            Received Request
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out whitespace-nowrap min-w-max ${
              activeTab === "sent"
                ? "bg-white text-[#2596be] shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            Sent Request
          </button>
        </div>

        {/* Right Side: Filters & Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-3 w-full xl:w-auto">
          <div className="relative w-full sm:w-64">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search devices..." 
              className="pl-9 h-11 border-slate-200 bg-slate-50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white transition-all duration-200 text-sm w-full rounded-lg" 
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter} >
            <SelectTrigger className="h-11 bg-white border-slate-200 text-slate-700 relative">
              <div className="flex items-center gap-2"><span className="truncate">{statusFilter === "All" ? "Status" : statusFilter}</span></div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-11 bg-white border-slate-200 text-slate-700">
              <div className="flex items-center gap-2"><span className="truncate">{roleFilter === "All" ? "Role" : roleFilter}</span></div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Ownership Transfer">Ownership Transfer</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 bg-[#2596be] hover:bg-[#1e7c9e] text-white font-medium px-5 shrink-0 transition-all duration-200 shadow-sm rounded-lg w-full sm:w-auto">
                Request Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl p-0 border-0 bg-transparent shadow-none">
              <SendAccessRequestForm onSendRequest={handleSendRequest} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-0 flex-1 w-full overflow-x-auto bg-slate-50/30">
        <DeviceAccessTable 
          activeTab={activeTab} 
          data={filteredRequests}
          isLoading={isLoading}
          onDeleteRequest={handleDeleteRequest}
          onAcceptInit={handleAcceptInit}
          onUpdateRole={handleUpdateRole}
          onToggleNotification={handleToggleNotification}
        />
      </div>

      {/* Accept Request Configuration Modal */}
      <Dialog open={isAcceptModalOpen} onOpenChange={setIsAcceptModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-xl border-slate-200">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <DialogHeader>
              <DialogTitle className="text-xl text-slate-800">Configure Access</DialogTitle>
              <DialogDescription className="text-slate-500 mt-1.5 leading-relaxed">
                Assign permissions to <span className="font-semibold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm mx-1">{selectedRequest?.user?.name}</span> for device <span className="font-semibold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm mx-1">{selectedRequest?.device?.id}</span>.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6 space-y-6 bg-white">
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Assign Role
                <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Required</span>
              </label>
              <Select value={acceptRole} onValueChange={setAcceptRole}>
                <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200 transition-colors focus:ring-primary/20 focus:border-primary">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 shadow-lg rounded-xl">
                  <SelectItem value="Viewer" className="py-2.5 cursor-pointer">Viewer - Read only</SelectItem>
                  <SelectItem value="Admin" className="py-2.5 cursor-pointer">Admin - Full control</SelectItem>
                  <SelectItem value="Ownership Transfer" className="py-2.5 cursor-pointer text-amber-700 focus:text-amber-800 focus:bg-amber-50">Ownership - Permanent transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {acceptRole !== "Ownership Transfer" && (
              <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  Access Validity
                  <span className="text-slate-400 font-normal text-xs">(Timeframe)</span>
                </label>
                <Select value={validitySpan} onValueChange={setValiditySpan}>
                  <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200 transition-colors focus:ring-primary/20 focus:border-primary">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-200 shadow-lg rounded-xl">
                    <SelectItem value="1 Month" className="py-2.5 cursor-pointer">1 Month</SelectItem>
                    <SelectItem value="6 Months" className="py-2.5 cursor-pointer">6 Months</SelectItem>
                    <SelectItem value="1 Year" className="py-2.5 cursor-pointer">1 Year</SelectItem>
                    <SelectItem value="Forever" className="py-2.5 cursor-pointer">Forever (No Expiry)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAcceptModalOpen(false)} className="h-10 px-5 text-slate-600 hover:text-slate-900 hover:bg-white transition-colors">
              Cancel
            </Button>
            <Button onClick={handleConfirmAccept} className="h-10 px-6 bg-primary hover:bg-primary/90 text-white shadow-sm transition-all duration-200">
              Accept & Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Warning Modal for Ownership Transfer */}
      <AlertDialog open={isWarningModalOpen} onOpenChange={setIsWarningModalOpen}>
        <AlertDialogContent className="rounded-xl border-slate-200 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-slate-900">Transfer Device Ownership?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 mt-2 text-base">
              You are about to permanently transfer ownership of <span className="font-semibold text-slate-900">{selectedRequest?.device?.name}</span> to <span className="font-semibold text-slate-900">{selectedRequest?.user?.name}</span>.
              <br/><br/>
              This action <b>cannot be undone</b>. You will lose all administrative access to this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="h-10 px-5 text-slate-600 border-slate-200 hover:bg-slate-50">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={finalizeAccept} 
              className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              Transfer Ownership
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
