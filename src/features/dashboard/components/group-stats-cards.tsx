import { Layers, CheckCircle2, XCircle, Cpu } from "lucide-react";

interface GroupStatsCardsProps {
  totalGroups: number;
  activeGroups: number;
  inactiveGroups: number;
  totalDevices: number;
}

export function GroupStatsCards({
  totalGroups,
  activeGroups,
  inactiveGroups,
  totalDevices,
}: GroupStatsCardsProps) {
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US").format(num);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {/* Total Groups */}
      <div className="bg-white rounded-md border border-neutral-200 p-4 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-blue-50 flex items-center justify-center shrink-0">
          <Layers className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-500">Total Groups</p>
          <p className="text-2xl font-bold text-neutral-900">
            {formatNumber(totalGroups)}
          </p>
        </div>
      </div>

      {/* Active Groups */}
      <div className="bg-white rounded-md border border-neutral-200 p-4 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-green-50 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-500">Active Groups</p>
          <p className="text-2xl font-bold text-neutral-900">
            {formatNumber(activeGroups)}
          </p>
        </div>
      </div>

      {/* Inactive Groups */}
      <div className="bg-white rounded-md border border-neutral-200 p-4 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded flex bg-red-50 items-center justify-center shrink-0">
          <XCircle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-500">
            Inactive Groups
          </p>
          <p className="text-2xl font-bold text-neutral-900">
            {formatNumber(inactiveGroups)}
          </p>
        </div>
      </div>

      {/* Total Devices */}
      <div className="bg-white rounded-md border border-neutral-200 p-4 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-blue-50 flex items-center justify-center shrink-0">
          <Cpu className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-500">Total Devices</p>
          <p className="text-2xl font-bold text-neutral-900">
            {formatNumber(totalDevices)}
          </p>
        </div>
      </div>
    </div>
  );
}
