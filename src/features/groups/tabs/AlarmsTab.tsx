import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Eye, Edit, Trash2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { GroupAlarm } from "@/types/group";
import { CreateAlarmModal } from "./CreateAlarmModal";

interface AlarmsTabProps {
  alarms: GroupAlarm[];
  mode: "create" | "edit" | "view";
  onChange?: (alarms: GroupAlarm[]) => void;
}

const typeColors: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  Major: "bg-orange-50 text-orange-700 border-orange-200",
  Minor: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export function AlarmsTab({ alarms, mode, onChange }: AlarmsTabProps) {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const isReadOnly = mode === "view";

  const handleAddAlarm = (newAlarm: GroupAlarm) => {
    if (onChange) {
      onChange([...alarms, newAlarm]);
    }
  };

  const handleRemoveAlarm = (id: string) => {
    if (onChange) {
      onChange(alarms.filter((a) => a.id !== id));
    }
  };

  const filtered = alarms.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Alarms</h3>
          <p className="text-sm text-muted-foreground">
            {alarms.length} alarm{alarms.length !== 1 && "s"} configured
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alarms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-[200px]"
            />
          </div>
          {!isReadOnly && (
            <>
              <Button onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Add Alarm
              </Button>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              {!isReadOnly && (
                <TableHead className="w-10">
                  <Checkbox />
                </TableHead>
              )}
              <TableHead>Alarm Name</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Alarm Type</TableHead>
              <TableHead>Status</TableHead>
              {!isReadOnly && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isReadOnly ? 6 : 8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No alarms found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((alarm) => (
                <TableRow key={alarm.id}>
                  {!isReadOnly && (
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{alarm.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {alarm.tag}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded border text-xs font-mono bg-muted/30">
                      {alarm.condition}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center -space-x-2">
                      {[...Array(Math.min(3, alarm.recipientCount))].map(
                        (_, i) => (
                          <Avatar
                            key={i}
                            className="h-7 w-7 border-2 border-background"
                          >
                            <AvatarFallback className="text-xs bg-muted">
                              U
                            </AvatarFallback>
                          </Avatar>
                        ),
                      )}
                      {alarm.recipientCount > 3 && (
                        <span className="text-xs text-muted-foreground ml-3">
                          +{alarm.recipientCount - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", typeColors[alarm.alarmType])}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1" />
                      {alarm.alarmType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={alarm.status} disabled={isReadOnly} />
                  </TableCell>
                  {!isReadOnly && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveAlarm(alarm.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateAlarmModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAlarm}
      />
    </div>
  );
}

