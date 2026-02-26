import {
  IoHomeOutline,
  IoGridOutline,
  IoTabletPortraitOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
  IoBookOutline,
  IoHelpCircleOutline,
  IoHeadsetOutline,
  IoStatsChartOutline,
  IoCodeSlashOutline,
  IoPeopleOutline,
  IoLayersOutline,
} from "react-icons/io5";

export interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  section?: "main" | "secondary" | "support";
}

export const navItems: NavItem[] = [
  { icon: IoHomeOutline, label: "Home", href: "/", section: "main" },
  {
    icon: IoGridOutline,
    label: "Dashboard",
    href: "/dashboard",
    section: "main",
  },
  {
    icon: IoNotificationsOutline,
    label: "Alerts",
    href: "/alerts",
    badge: 3,
    section: "main",
  },
  {
    icon: IoTabletPortraitOutline,
    label: "Device",
    href: "/device",
    section: "main",
  },
  {
    icon: IoPeopleOutline,
    label: "Groups",
    href: "/groups",
    section: "main",
  },
  {
    icon: IoLayersOutline,
    label: "Templates",
    href: "/template-management",
    section: "main",
  },
  {
    icon: IoStatsChartOutline,
    label: "Reports",
    href: "/reports",
    section: "secondary",
  },
  {
    icon: IoCodeSlashOutline,
    label: "Developer",
    href: "/developer",
    section: "secondary",
  },
  {
    icon: IoSettingsOutline,
    label: "Settings",
    href: "/settings",
    section: "support",
  },
  {
    icon: IoBookOutline,
    label: "User Guide",
    href: "/user-guide",
    section: "support",
  },
  {
    icon: IoHelpCircleOutline,
    label: "Help",
    href: "/help",
    section: "support",
  },
  {
    icon: IoHeadsetOutline,
    label: "Support",
    href: "/support",
    section: "support",
  },
];
