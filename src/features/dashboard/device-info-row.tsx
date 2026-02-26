import { ReactNode } from "react";

interface DeviceInfoRowProps {
  label: string;
  value: ReactNode;
}

export function DeviceInfoRow({ label, value }: DeviceInfoRowProps) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-medium text-neutral-900">{value}</span>
    </div>
  );
}
