"use client";

import {
  Edit2,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { mockNotifications, mockUsers } from "../data/mock-notifications";
import { Notification, NotificationFormData } from "../types";
import { NotificationModal } from "./notification-modal";


export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | undefined>();

  const filteredNotifications = notifications.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, status: !n.status } : n
      )
    );
  };

  const handleAddClick = () => {
    setEditingNotification(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (notification: Notification) => {
    setEditingNotification(notification);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleSave = (data: NotificationFormData) => {
    if (editingNotification) {
      setNotifications(
        notifications.map((n) =>
          n.id === editingNotification.id
            ? {
                ...n,
                ...data,
                device: { ...n.device, id: data.deviceId }, // Simple mock update
              }
            : n
        )
      );
    } else {
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        device: {
          id: data.deviceId,
          name: "New Device",
          type: "Mock Device",
          image: "/gateway.png",
        },
        userSettings: data.userSettings,
        alarms: data.alarmIds,
        status: data.status,
        priority: data.priority,
        createdAt: new Date().toISOString(),
      };
      setNotifications([...notifications, newNotification]);
    }

  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Notification</h1>
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-white border-slate-200 focus:ring-2 focus:ring-[#2596be]/20 focus:border-[#2596be] transition-all"
            />
          </div>
          <Button
            onClick={handleAddClick}
            className="h-10 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 font-medium transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Notification
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-10 border-slate-200 text-slate-600 gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="w-12 px-4 h-12">
                <input type="checkbox" className="rounded border-slate-300" />
              </TableHead>
              <TableHead className="text-sm font-semibold text-slate-600">Notification</TableHead>
              <TableHead className="text-sm font-semibold text-slate-600">Device</TableHead>
              <TableHead className="text-sm font-semibold text-slate-600">Users</TableHead>
              <TableHead className="text-sm font-semibold text-slate-600">Alarm</TableHead>
              <TableHead className="text-sm font-semibold text-slate-600">Method</TableHead>
              <TableHead className="text-sm font-semibold text-slate-600">Status</TableHead>
              <TableHead className="text-sm font-semibold text-slate-600 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
         {filteredNotifications.map((notification) => {
  const assignedUserIds = notification.userSettings.map((u) => u.userId);
  const assignedMethods = Array.from(
    new Set(notification.userSettings.flatMap((u) => u.methods))
  );
                return (
              <TableRow key={notification.id} className="group hover:bg-slate-50/30 transition-colors">
                <TableCell className="px-4 py-4">
                  <input type="checkbox" className="rounded border-slate-300" />
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-sm font-medium text-slate-700">{notification.name}</span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-50 p-1 border border-orange-100">
                        <img 
                            src={notification.device.image} 
                            alt={notification.device.name} 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{notification.device.name}</div>
                      <div className="text-xs text-slate-500">{notification.device.type}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex -space-x-2">
                    {assignedUserIds.slice(0, 3).map((userId) => {
                        const user = mockUsers.find(u => u.id === userId);
                        return (
                      <Avatar key={userId} className="h-8 w-8 border-2 border-white ring-1 ring-slate-100 shadow-sm">
                        <AvatarImage src={undefined} />
                        <AvatarFallback className="bg-slate-200 text-[10px] font-bold">
                          {user?.name.substring(0, 2).toUpperCase() || "??"}
                        </AvatarFallback>
                      </Avatar>
                    )})}
                    {assignedUserIds.length > 3 && (
                      <div className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-100">
                        +{assignedUserIds.length - 3}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-sm text-slate-600 font-medium">
                    {notification.alarms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {notification.alarms.slice(0, 2).map(alarm => (
                                <Badge key={alarm} variant="outline" className="text-[10px] px-1.5 py-0 bg-slate-50 text-slate-500 border-slate-200">
                                    {alarm.replace(" Alarm", "")}
                                </Badge>
                            ))}
                            {notification.alarms.length > 2 && (
                                <span className="text-[10px] text-slate-400">+{notification.alarms.length - 2}</span>
                            )}
                        </div>
                    ) : "No alarms"}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-sm text-slate-600 font-medium">{assignedMethods.join(", ")}</div>
                </TableCell>

                <TableCell className="py-4">
                  <Switch
                    checked={notification.status}
                    onCheckedChange={() => handleToggleStatus(notification.id)}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </TableCell>
                <TableCell className="py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#2596be] hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-[#2596be] hover:bg-blue-50"
                      onClick={() => handleEditClick(notification)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                      onClick={() => handleDeleteClick(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
             </TableRow>
  );
})}
          </TableBody>
        </Table>
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingNotification}
      />
    </div>
  );
}
