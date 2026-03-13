"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  mockDevices,
  mockUsers,
  alarmOptions,
} from "../data/mock-notifications";
import { Notification, NotificationFormData, NotificationMethod, NotificationPriority } from "../types";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NotificationFormData) => void;
  initialData?: Notification;
}

const methodOptions: NotificationMethod[] = ["SMS", "Email", "Push Notification"];
const priorityOptions: NotificationPriority[] = ["High", "Medium", "Low"];

export function NotificationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: NotificationModalProps) {
  const [formData, setFormData] = useState<NotificationFormData>({
    name: "",
    deviceId: "",
    userSettings: [],
    alarmIds: [],
    priority: "Medium",
    status: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        deviceId: initialData.device.id,
        userSettings: initialData.userSettings,
        alarmIds: initialData.alarms,
        priority: initialData.priority,
        status: initialData.status,
      });
    } else {
      setFormData({
        name: "",
        deviceId: "",
        userSettings: [],
        alarmIds: [],
        priority: "Medium",
        status: true,
      });
    }
  }, [initialData, isOpen]);

  const toggleAlarm = (alarm: string) => {
    setFormData((prev) => ({
      ...prev,
      alarmIds: prev.alarmIds.includes(alarm)
        ? prev.alarmIds.filter((id) => id !== alarm)
        : [...prev.alarmIds, alarm],
    }));
  };

  const toggleMatrix = (userId: string, method: NotificationMethod) => {
    setFormData((prev) => {
      const existingUser = prev.userSettings.find((u) => u.userId === userId);
      let newUserSettings;

      if (existingUser) {
        const hasMethod = existingUser.methods.includes(method);
        const newMethods = hasMethod
          ? existingUser.methods.filter((m) => m !== method)
          : [...existingUser.methods, method];

        if (newMethods.length === 0) {
          // Remove user if no methods selected
          newUserSettings = prev.userSettings.filter((u) => u.userId !== userId);
        } else {
          newUserSettings = prev.userSettings.map((u) =>
            u.userId === userId ? { ...u, methods: newMethods } : u
          );
        }
      } else {
        newUserSettings = [...prev.userSettings, { userId, methods: [method] }];
      }

      return { ...prev, userSettings: newUserSettings };
    });
  };

  const isSelected = (userId: string, method: NotificationMethod) => {
    return (
      formData.userSettings
        .find((u) => u.userId === userId)
        ?.methods.includes(method) ?? false
    );
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl rounded-xl">
        <DialogHeader className="px-6 py-4 flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Notification Setup
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-200/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Notification Name
              </Label>
              <Input
                id="name"
                placeholder="Enter notification name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 bg-slate-50/50 border-slate-200 focus:ring-2 focus:ring-[#2596be]/20 focus:border-[#2596be] transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="device" className="text-sm font-medium text-slate-700">
                Device
              </Label>
              <Select
                value={formData.deviceId}
                onValueChange={(value) => setFormData({ ...formData, deviceId: value })}
              >
                <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200">
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  {mockDevices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Alarms</Label>
              <div className="flex flex-wrap gap-2 p-3 min-h-[44px] bg-slate-50/50 border border-slate-200 rounded-lg">
                {alarmOptions.map((alarm) => (
                  <Badge
                    key={alarm}
                    variant={formData.alarmIds.includes(alarm) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-3 py-1 text-xs transition-all",
                      formData.alarmIds.includes(alarm)
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-none"
                        : "bg-white text-slate-600 hover:bg-slate-100 border-slate-200"
                    )}
                    onClick={() => toggleAlarm(alarm)}
                  >
                    {alarm}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Priority Level</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: NotificationPriority) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-slate-700">Notification Matrix</Label>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 text-left font-semibold text-slate-600">User</th>
                            {methodOptions.map(method => (
                                <th key={method} className="px-4 py-3 text-center font-semibold text-slate-600 w-32">
                                    {method}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {mockUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 text-slate-700 font-medium">{user.name}</td>
                                {methodOptions.map(method => (
                                    <td key={method} className="px-4 py-3 text-center">
                                        <div 
                                            className={cn(
                                                "mx-auto h-5 w-5 rounded border flex items-center justify-center cursor-pointer transition-all",
                                                isSelected(user.id, method)
                                                    ? "bg-[#2596be] border-[#2596be]"
                                                    : "bg-white border-slate-300 hover:border-[#2596be]"
                                            )}
                                            onClick={() => toggleMatrix(user.id, method)}
                                        >
                                            {isSelected(user.id, method) && (
                                                <div className="h-2 w-2 rounded-full bg-white shadow-sm" />
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch
              checked={formData.status}
              onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
            />
            <span className="text-sm text-slate-700 font-semibold">
              Status: <span className={formData.status ? "text-emerald-600" : "text-slate-400"}>
                {formData.status ? "Active" : "Inactive"}
              </span>
            </span>
          </div>
        </div>


        <DialogFooter className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-8 h-10 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-800 transition-all shadow-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-8 h-10 bg-[#2596be] hover:bg-[#1e7da0] text-white transition-all shadow-md shadow-blue-500/20"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { cn } from "@/lib/utils";
