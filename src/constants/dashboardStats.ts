import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoPauseCircleOutline,
  IoServerOutline,
} from "react-icons/io5";

export const dashboardStats = [
  {
    key: "total-devices",
    label: "Total Devices",
    value: "10,987",
    icon: IoServerOutline,
  },
  {
    key: "active-devices",
    label: "Active Devices",
    value: "10,987",
    icon: IoCheckmarkCircleOutline,
  },
  {
    key: "inactive-devices",
    label: "In-active Devices",
    value: "10,987",
    icon: IoPauseCircleOutline,
  },
  {
    key: "faulty-devices",
    label: "Faulty Devices",
    value: "10,987",
    icon: IoAlertCircleOutline,
  },
];
