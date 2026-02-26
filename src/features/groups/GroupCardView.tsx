import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeviceGroup } from "@/types/group";

interface GroupCardViewProps {
  groups: DeviceGroup[];
  onViewGroup: (group: DeviceGroup) => void;
  onEditGroup: (group: DeviceGroup) => void;
  onDeleteGroup: (group: DeviceGroup) => void;
}

export function GroupCardView({
  groups, onViewGroup, onEditGroup, onDeleteGroup,
}: GroupCardViewProps) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No groups found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <Card key={group.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Checkbox />
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  <img src="/placeholder.svg" alt="" className="h-10 w-10 object-cover" />
                </div>
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {group.name}
                    <span className={`h-2 w-2 rounded-full ${group.status === 'active' ? 'bg-emerald-500' : 'bg-orange-400'}`} />
                  </p>
                  <p className="text-xs text-muted-foreground">{group.deviceCount} Devices</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewGroup(group)}>View Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditGroup(group)}>Edit Group</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteGroup(group)} className="text-destructive">Delete Group</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tags :</span>
                <span className="font-medium">{group.tags}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Validity Period :</span>
                <span className="font-medium text-xs">
                  {group.validityStart} - {group.validityEnd}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Alarms :</span>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded border text-xs font-medium">
                  {group.alarms}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Users :</span>
                <div className="flex items-center -space-x-2">
                  {[...Array(Math.min(3, group.activeUsers))].map((_, i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-[10px] bg-muted">U</AvatarFallback>
                    </Avatar>
                  ))}
                  {group.activeUsers > 3 && (
                    <span className="text-xs text-muted-foreground ml-3">+{group.activeUsers - 3}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

