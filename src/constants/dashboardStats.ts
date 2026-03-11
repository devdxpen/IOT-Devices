import {
  AlertCircle,
  CheckCircle2,
  PauseCircle,
  Server,
} from "lucide-react";

export const dashboardStats = [
  {
    key: "total-devices",
    label: "Total Devices",
    value: "10,987",
    icon: Server,
  },
  {
    key: "active-devices",
    label: "Active Devices",
    value: "10,987",
    icon: CheckCircle2,
  },
  {
    key: "inactive-devices",
    label: "In-active Devices",
    value: "10,987",
    icon: PauseCircle,
  },
  {
    key: "faulty-devices",
    label: "Faulty Devices",
    value: "10,987",
    icon: AlertCircle,
  },
];
