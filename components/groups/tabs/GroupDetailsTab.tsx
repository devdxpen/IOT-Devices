import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface GroupDetailsTabProps {
  mode: "create" | "edit" | "view";
  data?: {
    groupName: string;
    description: string;
    status: boolean;
    activationDate: string;
    endDate: string;
  };
  onChange?: (data: {
    groupName: string;
    description: string;
    status: boolean;
    activationDate: string;
    endDate: string;
  }) => void;
}

export function GroupDetailsTab({
  mode,
  data,
  onChange,
}: GroupDetailsTabProps) {
  const [groupName, setGroupName] = useState(data?.groupName ?? "");
  const [description, setDescription] = useState(data?.description ?? "");
  const [status, setStatus] = useState(data?.status ?? false);
  const [activationDate, setActivationDate] = useState(
    data?.activationDate ?? "",
  );
  const [endDate, setEndDate] = useState(data?.endDate ?? "");

  const isReadOnly = mode === "view";

  const handleDateChange = (
    field: "activationDate" | "endDate",
    date: Date | undefined,
  ) => {
    if (!date) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    if (field === "activationDate") {
      setActivationDate(formattedDate);
      emitChange({ activationDate: formattedDate });
    } else {
      setEndDate(formattedDate);
      emitChange({ endDate: formattedDate });
    }
  };

  const emitChange = (partial: Partial<typeof data>) => {
    const next = {
      groupName,
      description,
      status,
      activationDate,
      endDate,
      ...partial,
    };
    onChange?.(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Group Details</h3>
        {mode === "view" && (
          <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground font-medium">
            Read Only
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="group-name">Group Name</Label>
          <Input
            id="group-name"
            placeholder="Enter group name"
            value={groupName}
            disabled={isReadOnly}
            onChange={(e) => {
              setGroupName(e.target.value);
              emitChange({ groupName: e.target.value });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Upload Group Image</Label>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            disabled={isReadOnly}
          >
            {isReadOnly ? (
              <Upload className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center gap-3">
            <Switch
              checked={status}
              disabled={isReadOnly}
              onCheckedChange={(v) => {
                setStatus(v);
                emitChange({ status: v });
              }}
            />
            <span
              className={`text-sm font-medium ${status ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              {status ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="group-desc">Description</Label>
        <Textarea
          id="group-desc"
          placeholder="Enter group description..."
          value={description}
          disabled={isReadOnly}
          rows={3}
          onChange={(e) => {
            setDescription(e.target.value);
            emitChange({ description: e.target.value });
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Activation Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                disabled={isReadOnly}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !activationDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {activationDate ? (
                  format(parseISO(activationDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={activationDate ? parseISO(activationDate) : undefined}
                onSelect={(d) => handleDateChange("activationDate", d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                disabled={isReadOnly}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? (
                  format(parseISO(endDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate ? parseISO(endDate) : undefined}
                onSelect={(d) => handleDateChange("endDate", d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
