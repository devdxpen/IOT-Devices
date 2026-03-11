import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeviceGroup } from "@/types/group";

interface GroupListViewProps {
  groups: DeviceGroup[];
  onViewGroup: (group: DeviceGroup) => void;
  onEditGroup: (group: DeviceGroup) => void;
  onDeleteGroup: (group: DeviceGroup) => void;
}

export function GroupListView({
  groups,
  onViewGroup,
  onEditGroup,
  onDeleteGroup,
}: GroupListViewProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-10">
              <Checkbox />
            </TableHead>
            <TableHead className="font-semibold">Groups name</TableHead>
            <TableHead className="font-semibold">Tags</TableHead>
            <TableHead className="font-semibold">Validate Period</TableHead>
            <TableHead className="font-semibold">Alarms</TableHead>
            <TableHead className="font-semibold">Group Users</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-12 text-muted-foreground"
              >
                No groups found.
              </TableCell>
            </TableRow>
          ) : (
            groups.map((group) => (
              <TableRow key={group.id} className="hover:bg-muted/20">
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt=""
                        className="h-10 w-10 object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {group.name}
                        <span
                          className={`h-2 w-2 rounded-full ${group.status === "active" ? "bg-emerald-500" : "bg-orange-400"}`}
                        />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {group.deviceCount} Devices
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{group.tags}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{group.validityStart}</p>
                    <p>{group.validityEnd}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded border text-sm font-medium">
                    {group.alarms}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center -space-x-2">
                    {[...Array(Math.min(3, group.activeUsers))].map((_, i) => (
                      <Avatar
                        key={i}
                        className="h-7 w-7 border-2 border-background"
                      >
                        <AvatarFallback className="text-xs bg-muted">
                          U
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {group.activeUsers > 3 && (
                      <span className="text-xs text-muted-foreground ml-3">
                        +{group.activeUsers - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch checked={group.status === "active"} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewGroup(group)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEditGroup(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDeleteGroup(group)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
