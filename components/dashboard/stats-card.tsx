import { Card, CardContent } from "@/components/ui/card";
import type { IconType } from "react-icons";

interface StatsCardProps {
  icon: IconType;
  label: string;
  value: string;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  iconBgColor = "bg-neutral-100",
  iconColor = "text-neutral-600",
}: StatsCardProps) {
  return (
    <Card className="bg-white border border-neutral-200 shadow-sm rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Icon Container - 48x48px */}
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          {/* Text Content */}
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-neutral-500 font-medium leading-tight">
              {label}
            </span>
            <span className="text-2xl font-bold text-neutral-900 leading-tight">
              {value}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
