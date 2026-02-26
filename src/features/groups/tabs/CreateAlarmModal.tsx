import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GroupAlarm } from "@/types/group";

interface CreateAlarmModalProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (alarm: GroupAlarm) => void;
}

export function CreateAlarmModal({
  open,
  onClose,
  onAdd,
}: CreateAlarmModalProps) {
  const [alarmName, setAlarmName] = useState("");
  const [tag, setTag] = useState("");
  const [condition, setCondition] = useState("");
  const [alarmType, setAlarmType] = useState<"Critical" | "Major" | "Minor">(
    "Minor",
  );
  const [recipients, setRecipients] = useState("");

  const handleCreate = () => {
    if (!alarmName || !condition) return;

    const newAlarm: GroupAlarm = {
      id: "al-" + Date.now(),
      name: alarmName,
      tag: tag || "General",
      condition: condition,
      recipientCount:
        recipients.split(",").filter((email) => email.trim()).length || 1,
      alarmType: alarmType,
      status: true,
    };

    if (onAdd) {
      onAdd(newAlarm);
    }
    onClose();

    // reset form
    setAlarmName("");
    setTag("");
    setCondition("");
    setAlarmType("Minor");
    setRecipients("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Alarm</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="alarm-name">Alarm Name</Label>
            <Input
              id="alarm-name"
              placeholder="e.g. Temperature Alert"
              value={alarmName}
              onChange={(e) => setAlarmName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alarm-type">Severity</Label>
            <Select
              value={alarmType}
              onValueChange={(val: "Critical" | "Major" | "Minor") =>
                setAlarmType(val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Major">Major</SelectItem>
                <SelectItem value="Minor">Minor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alarm-tag">Tag / Category</Label>
            <Input
              id="alarm-tag"
              placeholder="e.g. Device Fault"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alarm-condition">Condition Statement</Label>
            <Input
              id="alarm-condition"
              placeholder="e.g. Temp > 80°C"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alarm-recipients">
              Recipients (emails separated by comma)
            </Label>
            <Input
              id="alarm-recipients"
              placeholder="admin@example.com, ... "
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!alarmName || !condition}>
            Create Alarm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

