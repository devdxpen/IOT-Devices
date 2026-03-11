import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useDeviceConfig, Alarm } from "../../contexts/DeviceConfigContext";

const NOTIFICATION_OPTIONS = ["Email", "Mobile App Notification", "SMS"];

export function DeviceAlarmsTab() {
  const { config, setAlarms } = useDeviceConfig();
  const { alarms } = config!;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [alarmToDelete, setAlarmToDelete] = useState<number | null>(null);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Alarm>>({
    isActive: true,
    notification: [],
    name: "",
    tag: "",
    valueLow: "",
    conditionLow: "< (Less Than)",
    valueHigh: "",
    conditionHigh: "> (Greater Than)",
    type: "",
    maskTime: "",
  });

  const handleOpenAdd = () => {
    setEditingAlarm(null);
    setFormData({
      isActive: true,
      notification: [],
      name: "",
      tag: "",
      valueLow: "",
      conditionLow: "< (Less Than)",
      valueHigh: "",
      conditionHigh: "> (Greater Than)",
      type: "",
      maskTime: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setFormData({ ...alarm, notification: alarm.notification || [] });
    setIsFormOpen(true);
  };

  const handleToggleActive = (id: number, checked: boolean) => {
    setAlarms(
      alarms.map((a) => (a.id === id ? { ...a, isActive: checked } : a)),
    );
    toast.success(`Alarm ${checked ? "enabled" : "disabled"}`);
  };

  const handleNotificationChange = (option: string, checked: boolean) => {
    const currentList = formData.notification || [];
    if (checked) {
      setFormData({ ...formData, notification: [...currentList, option] });
    } else {
      setFormData({
        ...formData,
        notification: currentList.filter((n) => n !== option),
      });
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.type) {
      toast.error("Alarm Name and Alarm Type are required.");
      return;
    }

    if (editingAlarm) {
      setAlarms(
        alarms.map((a) =>
          a.id === editingAlarm.id ? ({ ...a, ...formData } as Alarm) : a,
        ),
      );
      toast.success("Alarm updated successfully");
    } else {
      setAlarms([...alarms, { ...formData, id: Date.now() } as Alarm]);
      toast.success("Alarm added successfully");
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (alarmToDelete !== null) {
      setAlarms(alarms.filter((a: Alarm) => a.id !== alarmToDelete));
      toast.success("Alarm deleted successfully");
      setAlarmToDelete(null);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-800">
          Alarm Configuration
        </h2>
        <Button
          onClick={handleOpenAdd}
          className="bg-[#1ea1f2] hover:bg-[#1a90da] text-white h-9 px-4 rounded-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Alarm
        </Button>
      </div>

      <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-600 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wide">Status</th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  Alarm Name
                </th>
                <th className="px-6 py-4 font-medium tracking-wide">Tag</th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  Low Value
                </th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  High Value
                </th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  Alarm Type
                </th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  Mask Time
                </th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  Notifications
                </th>
                <th className="px-6 py-4 font-medium tracking-wide text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alarms.map((alarm: Alarm) => (
                <tr
                  key={alarm.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Switch
                      checked={alarm.isActive}
                      onCheckedChange={(c) => handleToggleActive(alarm.id, c)}
                      className="data-[state=checked]:bg-green-500 scale-90"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {alarm.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {alarm.tag || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {alarm.valueLow}{" "}
                    <span className="text-slate-400 text-xs ml-1">
                      {alarm.conditionLow}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {alarm.valueHigh}{" "}
                    <span className="text-slate-400 text-xs ml-1">
                      {alarm.conditionHigh}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full ${
                        alarm.type === "Critical"
                          ? "bg-red-100 text-red-700"
                          : alarm.type === "Warning"
                            ? "bg-orange-100 text-orange-700"
                            : alarm.type === "Info"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {alarm.type || "Standard"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {alarm.maskTime ? `${alarm.maskTime}s` : "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {alarm.notification?.join(", ") || "-"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      onClick={() => handleOpenEdit(alarm)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-[#1ea1f2]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setAlarmToDelete(alarm.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {alarms.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No alarms configured. Click "Add New Alarm" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-[700px] p-0 overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-white">
            <DialogTitle className="text-xl font-medium text-slate-800">
              Alarm Setup
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 p-6">
            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Alarm Name
              </Label>
              <Input
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter alarm name"
                className="h-11 bg-[#fafafa] border-slate-200 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Tag
              </Label>
              <Select
                value={formData.tag || ""}
                onValueChange={(v) => setFormData({ ...formData, tag: v })}
              >
                <SelectTrigger className="h-11 bg-[#fafafa] border-slate-200 text-sm">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TAG-001">TAG-001</SelectItem>
                  <SelectItem value="TAG-002">TAG-002</SelectItem>
                  <SelectItem value="TAG-003">TAG-003</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Tag Value Low
              </Label>
              <div className="flex h-11 items-center rounded-md border border-slate-200 bg-[#fafafa] overflow-hidden focus-within:ring-1 focus-within:ring-[#1ea1f2]">
                <Input
                  type="number"
                  value={formData.valueLow || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, valueLow: e.target.value })
                  }
                  placeholder="|"
                  className="h-full flex-1 border-0 bg-transparent px-3 py-1 shadow-none focus-visible:ring-0 rounded-none text-sm placeholder:text-slate-300"
                />
                <Select
                  value={formData.conditionLow || "< (Less Than)"}
                  onValueChange={(v) =>
                    setFormData({ ...formData, conditionLow: v })
                  }
                >
                  <SelectTrigger className="h-full w-auto min-w-[130px] border-0 border-l border-slate-200 bg-[#fafafa] shadow-none focus-visible:ring-0 rounded-none text-sm font-medium">
                    <SelectValue placeholder="< (Less Than)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="< (Less Than)">
                      {"< (Less Than)"}
                    </SelectItem>
                    <SelectItem value="<= (Less Eq)">
                      {"<= (Less Eq)"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Tag Value High
              </Label>
              <div className="flex h-11 items-center rounded-md border border-slate-200 bg-[#fafafa] overflow-hidden focus-within:ring-1 focus-within:ring-[#1ea1f2]">
                <Input
                  type="number"
                  value={formData.valueHigh || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, valueHigh: e.target.value })
                  }
                  placeholder="|"
                  className="h-full flex-1 border-0 bg-transparent px-3 py-1 shadow-none focus-visible:ring-0 rounded-none text-sm placeholder:text-slate-300"
                />
                <Select
                  value={formData.conditionHigh || "> (Greater Than)"}
                  onValueChange={(v) =>
                    setFormData({ ...formData, conditionHigh: v })
                  }
                >
                  <SelectTrigger className="h-full w-auto min-w-[150px] border-0 border-l border-slate-200 bg-[#fafafa] shadow-none focus-visible:ring-0 rounded-none text-sm font-medium">
                    <SelectValue placeholder="> (Greater Than)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="> (Greater Than)">
                      {"> (Greater Than)"}
                    </SelectItem>
                    <SelectItem value=">= (Greater Eq)">
                      {">= (Greater Eq)"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Alarm Type
              </Label>
              <Select
                value={formData.type || ""}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger className="h-11 bg-[#fafafa] border-slate-200 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Mask Time (Seconds)
              </Label>
              <Input
                type="number"
                value={formData.maskTime || ""}
                onChange={(e) =>
                  setFormData({ ...formData, maskTime: e.target.value })
                }
                placeholder="e.g. 60"
                className="h-11 bg-[#fafafa] border-slate-200 text-sm"
              />
            </div>

            <div className="col-span-2 space-y-3">
              <Label className="text-[13px] font-normal text-slate-600">
                Notification Targets
              </Label>
              <div className="flex flex-wrap gap-4 pt-1">
                {NOTIFICATION_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`notify-${option}`}
                      checked={(formData.notification || []).includes(option)}
                      onCheckedChange={(checked) =>
                        handleNotificationChange(option, checked as boolean)
                      }
                      className="data-[state=checked]:bg-[#1ea1f2] data-[state=checked]:border-[#1ea1f2]"
                    />
                    <label
                      htmlFor={`notify-${option}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 flex flex-col justify-start col-span-2 mt-2">
              <Label className="text-[13px] font-normal text-slate-600 mb-2">
                Status
              </Label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.isActive || false}
                  onCheckedChange={(c) =>
                    setFormData({ ...formData, isActive: c })
                  }
                  className="data-[state=checked]:bg-[#1ea1f2]"
                />
                <span className="text-sm text-slate-600 font-medium">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              className="bg-white hover:bg-slate-100 text-slate-700 h-10 px-6 font-medium border-slate-200 rounded-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#1ea1f2] hover:bg-[#1a90da] text-white h-10 px-8 font-medium rounded-sm"
            >
              Save Alarm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={alarmToDelete !== null}
        onOpenChange={(open) => !open && setAlarmToDelete(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              alarm configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
