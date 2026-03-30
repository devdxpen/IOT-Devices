import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import { Device } from "@/types";
import { Button } from "@/components/ui/button";
import { DeviceInfoRow } from "./device-info-row";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

interface DeviceCardProps {
  device: Device;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
}

export function DeviceCard({
  device,
  isSelected = false,
  onSelect,
}: DeviceCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/device/${device.id}/edit`)}
      className={`border ${isSelected ? "border-blue-500 bg-blue-50/20" : "border-neutral-200 bg-white"} rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer relative`}
    >
      {onSelect && (
        <div
          className="absolute top-3 left-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="border-neutral-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
          />
        </div>
      )}

      <CardContent className="p-4 pt-5 border-b border-neutral-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 pl-6">
            <div className="relative">
              <div className="w-12 h-12 bg-linear-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                <img
                  src={device.icon}
                  alt={device.name}
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${device.isOnline ? 'bg-green-500' : 'bg-red-400'}`}></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 text-base leading-tight">
                {device.name}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">{device.type}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            aria-label="View device details"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/device/${device.id}/edit`);
            }}
          >
            <Eye className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Avatar className="w-7 h-7 border border-neutral-200">
                <AvatarImage src={device.assignedUser?.avatarUrl} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-[10px] font-medium">
                  {device.assignedUser?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-neutral-700">
                {device.assignedUser?.name}
              </span>
            </div>
            <div className="px-2 py-0.5 bg-neutral-100 rounded text-xs font-semibold text-neutral-700">
              {device.company}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <DeviceInfoRow label="Serial Num :" value={device.serialNumber} />
            <DeviceInfoRow label="Location :" value={device.location} />
            <DeviceInfoRow
              label="Alarms :"
              value={
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-neutral-100 border border-neutral-200 rounded text-xs font-semibold text-neutral-600">
                  {device.alarms}
                </span>
              }
            />
            <DeviceInfoRow
              label="Last Update :"
              value={
                <span className="text-xs">{device.lastDataTimestamp}</span>
              }
            />
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-100">
            <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Live Data
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-base font-semibold text-neutral-800 leading-none mb-1">
                  {device.data?.t1 ?? "--"}
                </span>
                <span className="text-[10px] font-medium text-neutral-500 uppercase">
                  T1
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-neutral-800 leading-none mb-1">
                  {device.data?.t2 ?? "--"}
                </span>
                <span className="text-[10px] font-medium text-neutral-500 uppercase">
                  T2
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-neutral-800 leading-none mb-1">
                  {device.data?.t3 ?? "--"}
                </span>
                <span className="text-[10px] font-medium text-neutral-500 uppercase">
                  T3
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
