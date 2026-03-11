import { useState } from "react";
import { GroupSummary } from "@/types/group";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DevicesTable } from "./devices-table";

interface GroupRowProps {
  group: GroupSummary;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}

export function GroupRow({ group, isSelected, onSelect }: GroupRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Using the exact structure as we did for devices to maintain consistency
  const usersToDisplay = group.users.slice(0, 3);
  const extraUsersCount = group.users.length - 3;

  return (
    <>
      {/* Primary Group Row */}
      <TableRow
        className={`group transition-colors border-b border-neutral-100 ${
          isSelected ? "bg-blue-50/50" : "bg-white hover:bg-neutral-50/50"
        } ${isExpanded ? "border-b-0" : ""}`}
      >
        <TableCell className="w-10 text-center py-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </TableCell>

        <TableCell className="w-12 text-center py-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="border-neutral-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 mx-auto"
            aria-label={`Select group ${group.name}`}
          />
        </TableCell>

        <TableCell className="py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <span className="text-white font-bold text-xs uppercase">
                {group.name.substring(0, 2)}
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-900">
                {group.name}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {group.deviceCount} Devices
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="py-3">
          <span className="text-sm font-medium text-neutral-700">
            {group.tags}
          </span>
        </TableCell>

        <TableCell className="py-3">
          <span className="text-sm text-neutral-600 font-medium whitespace-pre-line">
            {group.lastDataTimestamp}
          </span>
        </TableCell>

        <TableCell className="py-3">
          <div className="flex flex-col">
            <span className="text-sm text-neutral-600 font-medium">
              {group.validatePeriodStart}
            </span>
            <span className="text-sm text-neutral-600 font-medium mt-0.5">
              {group.validatePeriodEnd}
            </span>
          </div>
        </TableCell>

        <TableCell className="py-3">
          <div className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-neutral-100 border border-neutral-200 rounded text-xs font-semibold text-neutral-600">
            {group.alarms}
          </div>
        </TableCell>

        <TableCell className="py-3">
          <div className="flex items-center">
            {usersToDisplay.map((user, i) => (
              <Avatar
                key={i}
                className="w-7 h-7 border-2 border-white rounded-full -ml-2 first:ml-0 shadow-sm"
              >
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-[10px] font-semibold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {extraUsersCount > 0 && (
              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-100 border-2 border-white text-[10px] font-medium text-neutral-600 -ml-2 shadow-sm z-10">
                +{extraUsersCount}
              </div>
            )}
          </div>
        </TableCell>

        <TableCell className="py-3 text-right">
          <Button
            variant="outline"
            className="h-8 text-xs font-medium bg-white text-neutral-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            View In Canvas
          </Button>
        </TableCell>
      </TableRow>

      {/* Expanded Inner Devices List Row */}
      {isExpanded && (
        <TableRow className="bg-blue-50/20 hover:bg-blue-50/20">
          <TableCell colSpan={9} className="p-0 border-b border-neutral-200">
            {/* 
              We reuse our highly functional DevicesTable component! 
              We wrap it slightly to adjust the outer border to fit seamlessly.
            */}
            <div className="pl-14 pr-4 py-2 bg-blue-50/10 border-t border-blue-100/50">
              <DevicesTable
                devices={group.devices}
                selectedIds={[]}
                onSelectionChange={() => {}}
                sortConfig={null}
                onSort={() => {}}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
