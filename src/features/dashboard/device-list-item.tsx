import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeviceSummary } from "@/types";
import { deviceLocations } from "@/constants/deviceLocations";
import { DeviceInfoRow } from "./device-info-row";
import { useRouter } from "next/navigation";

interface DeviceListItemProps {
  device: DeviceSummary;
}

export function DeviceListItem({ device }: DeviceListItemProps) {
  const router = useRouter();
  const locationLabel =
    deviceLocations.find((option) => option.value === device.location)?.label ??
    device.location;

  return (
    <Card
      onClick={() => router.push(`/device/${device.id}/edit`)}
      className="border border-neutral-200 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="p-4 flex items-start gap-4">
        <div className="w-12 h-12 bg-linear-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
          <img
            src={device.icon}
            alt={device.name}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-neutral-900 text-sm leading-tight truncate">
                {device.name}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">{device.type}</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0"
              aria-label="View device details"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/device/${device.id}/edit`);
              }}
            >
              <Eye className="w-4 h-4 text-neutral-400" />
            </Button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            <DeviceInfoRow
              label="Serial Number :"
              value={device.serialNumber}
            />
            <DeviceInfoRow label="Category :" value={device.category} />
            <DeviceInfoRow label="Sub Category :" value={device.subCategory} />
            <DeviceInfoRow label="Location :" value={locationLabel} />
            <DeviceInfoRow
              label="Manufacturer & Model :"
              value={`${device.manufacturer} ${device.model}`}
            />
            <DeviceInfoRow
              label="Firmware Version :"
              value={device.firmwareVersion}
            />
            <DeviceInfoRow label="MAC Address :" value={device.macAddress} />
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex -space-x-2">
            {device.users.slice(0, 3).map((user, index) => (
              <Avatar key={index} className="w-8 h-8 border border-white">
                <AvatarImage src={user} />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-xs font-medium">
                  U{index + 1}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          {device.userCount > 3 && (
            <span className="ml-1.5 text-xs font-medium text-neutral-600">
              +{device.userCount - 3}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
