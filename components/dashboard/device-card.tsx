import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoEyeOutline } from "react-icons/io5";
import { Device } from "@/types";
import { Button } from "../ui/button";

interface DeviceCardProps {
  device: Device;
}

// Reusable info row component for consistent styling
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-medium text-neutral-900">{value}</span>
    </div>
  );
}

export function DeviceCard({ device }: DeviceCardProps) {
  return (
    <Card className="border border-neutral-200 rounded-md shadow-xl hover:shadow-2xl transition-all hover:scale-105 duration-300 cursor-pointer">
      <CardContent className="p-3 border-b border-neutral-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Device Icon - Orange gradient */}
            <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
              <img
                src="/sensor-icon.png"
                alt="Device"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  // Fallback if image doesn't load
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            {/* Device Name & Type */}
            <div>
              <h3 className="font-semibold text-neutral-900 text-sm leading-tight">
                {device.name}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">{device.type}</p>
            </div>
          </div>
          {/* View Button */}
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            aria-label="View device details"
          >
            <IoEyeOutline className="w-4 h-4 text-neutral-400" />
          </Button>
        </div>
      </CardContent>
      <CardContent className="p-3">
        <div className="space-y-2">
          <InfoRow label="Serial Number :" value={device.serialNumber} />
          <InfoRow label="Category :" value={device.category} />
          <InfoRow label="Sub Category :" value={device.subCategory} />
          <div className="flex justify-between items-center py-0.5">
            <span className="text-xs text-neutral-500">User :</span>
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

          <InfoRow
            label="Manufacturer & Mode :"
            value={`${device.manufacturer} ${device.model}`}
          />
          <InfoRow label="Firmware Version :" value={device.firmwareVersion} />
          <InfoRow label="MAC Address :" value={device.macAddress} />
        </div>
      </CardContent>
    </Card>
  );
}
