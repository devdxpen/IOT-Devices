"use client";

import {
  AlertCircle,
  Bell,
  CheckCircle2,
  FlameKindling,
  Thermometer,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const monthlyAlarmData = [
  { month: "Jan", critical: 8, high: 12, medium: 16, low: 10 },
  { month: "Feb", critical: 6, high: 10, medium: 14, low: 9 },
  { month: "Mar", critical: 7, high: 11, medium: 18, low: 11 },
  { month: "April", critical: 9, high: 13, medium: 20, low: 12 },
  { month: "May", critical: 10, high: 14, medium: 22, low: 14 },
  { month: "June", critical: 12, high: 15, medium: 23, low: 13 },
  { month: "July", critical: 11, high: 14, medium: 21, low: 12 },
  { month: "Aug", critical: 9, high: 13, medium: 19, low: 11 },
  { month: "Sep", critical: 8, high: 12, medium: 18, low: 10 },
  { month: "Oct", critical: 10, high: 15, medium: 22, low: 13 },
  { month: "Nov", critical: 7, high: 11, medium: 17, low: 9 },
  { month: "Dec", critical: 6, high: 10, medium: 16, low: 8 },
];

// For now alerts follow same pattern; can diverge later when backend data available
const monthlyAlertData = monthlyAlarmData;

type AlertSeverity = "critical" | "high" | "medium" | "low";

interface AlertItem {
  id: number;
  type: AlertSeverity;
  time: string;
  ago?: string;
  title?: string;
  description?: string;
}

interface AlertCardProps {
  type: AlertSeverity;
  time: string;
  title: string;
  description: string;
  ago?: string;
  onAcknowledge?: () => void;
}

const typeStyles: Record<
  AlertCardProps["type"],
  { label: string; badge: string; border: string; chip: string }
> = {
  critical: {
    label: "Critical Alarms",
    badge: "bg-red-50 text-red-700 border-red-200",
    border: "border-red-100",
    chip: "bg-red-500",
  },
  high: {
    label: "High Alarms",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    border: "border-orange-100",
    chip: "bg-orange-500",
  },
  medium: {
    label: "Medium Alarms",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    border: "border-amber-100",
    chip: "bg-amber-500",
  },
  low: {
    label: "Low Alarms",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    border: "border-emerald-100",
    chip: "bg-emerald-500",
  },
};

function AlertCard({
  type,
  time,
  title,
  description,
  ago,
  onAcknowledge,
}: AlertCardProps) {
  const style = typeStyles[type];
  return (
    <Card
      className={`flex flex-col gap-2 rounded-xl border ${style.border} bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)] px-4 py-3`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${style.badge}`}
        >
          {style.label}
        </span>
        <span className="text-[11px] font-medium text-slate-500">{time}</span>
      </div>

      <div className="flex items-start gap-3">
        <div className="relative mt-1">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 shadow-sm" />
          <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white bg-white">
            <span className={`h-2.5 w-2.5 rounded-full ${style.chip}`} />
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-slate-900">
            {title}
          </div>
          <div className="mt-0.5 text-[12px] text-slate-500">{description}</div>
          {ago ? (
            <div className="mt-1 text-[11px] text-emerald-600">{ago}</div>
          ) : null}
        </div>
      </div>

      <div className="mt-1">
        <Button
          size="sm"
          variant="outline"
          className="h-7 rounded-full border-slate-200 px-3 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
          onClick={onAcknowledge}
        >
          ✓ Acknowledge &amp; Fix
        </Button>
      </div>
    </Card>
  );
}

export default function AlertsPage() {
  const [alarms, setAlarms] = useState<AlertItem[]>([
    {
      id: 1,
      type: "critical",
      time: "10:40 AM",
      title: "HVAC-MAIN-01 (DEV-1001)",
      description: "Temperature threshold exceeded (>72.5°F)",
    },
    {
      id: 2,
      type: "critical",
      time: "10:42 AM",
      title: "HUMIDITY-LAB-01 (DEV-1004)",
      description: "Critical humidity levels in Building C lab (>45%)",
    },
    {
      id: 3,
      type: "medium", // Yellow flag in mock data mapped to medium
      time: "10:45 AM",
      title: "VALVE-MAIN-WATER (DEV-1006)",
      description: "Pressure variation detected (150.2 PSI)",
    },
    {
      id: 4,
      type: "high", // Orange flag mapped to high
      time: "10:50 AM",
      title: "TEMP-STORE-RM (DEV-1011)",
      description: "Cold storage warming up (-18.2°F)",
    },
    {
      id: 5,
      type: "low",
      time: "Yesterday",
      title: "CHILLER-ROOM-SENSOR (DEV-1002)",
      description: "Maintenance calibration due soon",
    },
    {
      id: 6,
      type: "medium",
      time: "2 days ago",
      title: "MOTION-LOBBY-A (DEV-1003)",
      description: "Unusual motion detected during off-hours",
    },
  ]);

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 101,
      type: "critical",
      time: "09:15 AM",
      title: "FW-Update Failure",
      description: "Firmware v2.4.1 deployment failed on HVAC-MAIN-01",
    },
    {
      id: 102,
      type: "high",
      time: "08:30 AM",
      title: "Connectivity Loss",
      description: "HVAC-ZONE-B-02 (DEV-1008) is currently offline",
    },
    {
      id: 103,
      type: "medium",
      time: "07:00 AM",
      title: "Battery Warning",
      description: "MOTION-LOBBY-A (DEV-1003) battery at 15%",
    },
    {
      id: 104,
      type: "low",
      time: "Yesterday",
      title: "Sync Status",
      description: "Database synchronization completed with 0.5s lag",
    },
  ]);

  const [ackDialogOpen, setAckDialogOpen] = useState(false);
  const [ackScope, setAckScope] = useState<"alarms" | "alerts" | "single">(
    "alarms",
  );
  const [ackComment, setAckComment] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const openAckAll = (scope: "alarms" | "alerts") => {
    setAckScope(scope);
    setAckComment("");
    setAckDialogOpen(true);
  };

  const openAckSingle = (id: number) => {
    setAckScope("single");
    setSelectedId(id);
    setAckComment("");
    setAckDialogOpen(true);
  };

  const applyAcknowledgement = () => {
    const timestamp = new Date().toISOString();
    const trimmedComment = ackComment.trim();
    if (trimmedComment.length < 8) {
      return;
    }
    // In a real app this would be sent to backend as audit trail (user, time, comment)
    // For now we only update local state to illustrate behaviour.
    if (ackScope === "alarms") {
      setAlarms([]);
    } else if (ackScope === "alerts") {
      setAlerts([]);
    } else if (ackScope === "single" && selectedId != null) {
      setAlarms((prev) => prev.filter((a) => a.id !== selectedId));
      setAlerts((prev) => prev.filter((a) => a.id !== selectedId));
    }
    // In production replace this with API call; keep console for now as debug only.
    // eslint-disable-next-line no-console
    console.log("acknowledged", {
      scope: ackScope,
      id: selectedId,
      comment: trimmedComment,
      timestamp,
    });
    setAckDialogOpen(false);
    setSelectedId(null);
  };

  const totalAlarms = alarms.length;
  const criticalAlarms = alarms.filter((a) => a.type === "critical").length;
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter((a) => a.type === "critical").length;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-3 rounded-2xl border-slate-200 bg-sky-50 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              Total Alarms
            </div>
            <div className="text-lg font-semibold text-slate-900">
              {totalAlarms}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 rounded-2xl border-slate-200 bg-red-50 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              Critical Alarms
            </div>
            <div className="text-lg font-semibold text-slate-900">
              {criticalAlarms}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 rounded-2xl border-slate-200 bg-rose-50 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm">
            <FlameKindling className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              Total Alerts
            </div>
            <div className="text-lg font-semibold text-slate-900">
              {totalAlerts}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 rounded-2xl border-slate-200 bg-red-50 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm">
            <Thermometer className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              Critical Alerts
            </div>
            <div className="text-lg font-semibold text-slate-900">
              {criticalAlerts}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts – separate for alarms & alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-slate-200 px-6 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Alarms trend
              </h2>
              <p className="text-[11px] text-slate-500">
                Threshold-based alarms per month, by severity.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" /> Critical
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-orange-400" /> High
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-300" /> Medium
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Low
              </div>
            </div>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer>
              <AreaChart data={monthlyAlarmData} stackOffset="none">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  width={24}
                />
                <ReTooltip
                  cursor={{ fill: "rgba(148,163,184,0.12)" }}
                  contentStyle={{
                    borderRadius: 10,
                    borderColor: "#e5e7eb",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="low"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#bbf7d0"
                />
                <Area
                  type="monotone"
                  dataKey="medium"
                  stackId="1"
                  stroke="#facc15"
                  fill="#feeeb3"
                />
                <Area
                  type="monotone"
                  dataKey="high"
                  stackId="1"
                  stroke="#fb923c"
                  fill="#fed7aa"
                />
                <Area
                  type="monotone"
                  dataKey="critical"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#fecaca"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200 px-6 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Alerts trend
              </h2>
              <p className="text-[11px] text-slate-500">
                System / technical alerts per month, by severity.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" /> Critical
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-orange-400" /> High
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-300" /> Medium
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Low
              </div>
            </div>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer>
              <AreaChart data={monthlyAlertData} stackOffset="none">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  width={24}
                />
                <ReTooltip
                  cursor={{ fill: "rgba(148,163,184,0.12)" }}
                  contentStyle={{
                    borderRadius: 10,
                    borderColor: "#e5e7eb",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="low"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#bbf7d0"
                />
                <Area
                  type="monotone"
                  dataKey="medium"
                  stackId="1"
                  stroke="#facc15"
                  fill="#feeeb3"
                />
                <Area
                  type="monotone"
                  dataKey="high"
                  stackId="1"
                  stroke="#fb923c"
                  fill="#fed7aa"
                />
                <Area
                  type="monotone"
                  dataKey="critical"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#fecaca"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom alarms + alerts columns */}
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Alarms column */}
        <Card className="flex min-h-0 flex-col rounded-2xl border-slate-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-sm font-semibold text-slate-900">Alarms</h3>
              <span className="text-[11px] text-slate-500">
                ({alarms.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search"
                className="h-8 w-32 rounded-full border-slate-200 bg-slate-50 px-3 text-[11px]"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-slate-200 px-3 text-[11px] text-slate-700"
              >
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={alarms.length === 0}
                onClick={() => openAckAll("alarms")}
                className="h-8 rounded-full border-emerald-200 bg-emerald-50 px-3 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Ack all
              </Button>
            </div>
          </div>
          <Separator className="bg-slate-100" />
          <div className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto px-4 py-3 md:grid-cols-2">
            {alarms.length === 0 ? (
              <div className="col-span-full py-8 text-center text-xs text-slate-500">
                All alarms acknowledged for this user account.
              </div>
            ) : (
              alarms.map((alarm) => (
                <AlertCard
                  key={alarm.id}
                  type={alarm.type}
                  time={alarm.time}
                  title={alarm.title || "Sensor Event"}
                  description={alarm.description || "Reading anomaly detected"}
                  ago={alarm.ago}
                  onAcknowledge={() => openAckSingle(alarm.id)}
                />
              ))
            )}
          </div>
        </Card>

        {/* Alerts column */}
        <Card className="flex min-h-0 flex-col rounded-2xl border-slate-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-sm font-semibold text-slate-900">Alerts</h3>
              <span className="text-[11px] text-slate-500">
                ({alerts.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search"
                className="h-8 w-32 rounded-full border-slate-200 bg-slate-50 px-3 text-[11px]"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-slate-200 px-3 text-[11px] text-slate-700"
              >
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={alerts.length === 0}
                onClick={() => openAckAll("alerts")}
                className="h-8 rounded-full border-emerald-200 bg-emerald-50 px-3 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Ack all
              </Button>
            </div>
          </div>
          <Separator className="bg-slate-100" />
          <div className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto px-4 py-3 md:grid-cols-2">
            {alerts.length === 0 ? (
              <div className="col-span-full py-8 text-center text-xs text-slate-500">
                All alerts acknowledged for this user account.
              </div>
            ) : (
              alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  type={alert.type}
                  time={alert.time}
                  title={alert.title || "System Alert"}
                  description={alert.description || "Technical notification"}
                  onAcknowledge={() => openAckSingle(alert.id)}
                />
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Acknowledge dialog – user specific with comment + timestamp note */}
      <Dialog open={ackDialogOpen} onOpenChange={setAckDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              {ackScope === "alarms"
                ? "Acknowledge all alarms"
                : ackScope === "alerts"
                  ? "Acknowledge all alerts"
                  : "Acknowledge this event"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              This acknowledgement is recorded per user with timestamp and
              comment, and can be used later for 21 CFR compliant audit reports.
              Other operators will still see their own pending alarms/alerts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-slate-700">
                Comment (required)
              </Label>
              <Textarea
                value={ackComment}
                onChange={(e) => setAckComment(e.target.value)}
                placeholder="E.g. Checked device, temperature back in range."
                className="min-h-[80px] text-xs"
              />
              {ackComment.trim().length > 0 && ackComment.trim().length < 8 && (
                <p className="pt-1 text-[10px] text-red-500">
                  Please enter at least 8 characters for audit comment.
                </p>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              Note: In production, each acknowledge action should capture user
              ID, exact time, device reference and reason to prevent false or
              frequent alerts and to meet 21 CFR expectations.
            </p>
          </div>

          <DialogFooter className="mt-1 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-full px-3 text-[11px]"
              onClick={() => setAckDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 rounded-full px-3 text-[11px]"
              disabled={ackComment.trim().length < 8}
              onClick={applyAcknowledgement}
            >
              Confirm &amp; log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
