import {
  IoCodeSlashOutline,
  IoGridOutline,
  IoHeadsetOutline,
  IoHomeOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
  IoStatsChartOutline,
  IoTabletPortraitOutline,
} from "react-icons/io5";

export interface NavSubItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

export interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  section?: "main" | "secondary" | "support";
  subItems?: NavSubItem[];
  tabs?: NavSubItem[];
}

export const navItems: NavItem[] = [
  {
    icon: IoHomeOutline,
    label: "Home",
    href: "/dashboard",
    section: "main",
    tabs: [
      { label: "Overview", href: "/dashboard" },
      { label: "Devices", href: "/dashboard/devices" },
      { label: "Groups", href: "/dashboard/groups" },
      { label: "IoT Users", href: "/dashboard/users" },
    ],
  },
  {
    icon: IoGridOutline,
    label: "Dashboard",
    href: "/dashboard",
    section: "main",
    subItems: [
      { label: "Devices", href: "/dashboard/devices" },
      { label: "Groups", href: "/dashboard/groups" },
      { label: "Map View", href: "/dashboard/map" },
      { label: "IoT Users", href: "/dashboard/users" },
    ],
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
    label: "Devices",
    href: "/device",
    section: "main",
  },
  {
    icon: IoSettingsOutline,
    label: "Settings",
    href: "/settings",
    section: "support",
    subItems: [
      { label: "Templates", href: "/settings/templates" },
      { label: "Notification", href: "/settings/notification" },
      { label: "Groups", href: "/groups" },
      { label: "Devices", href: "/device" },
      { label: "Company Users", href: "/dashboard/users" },
    ],
  },
  {
    icon: IoHeadsetOutline,
    label: "Support",
    href: "/support",
    section: "support",
    subItems: [
      { label: "Help", href: "/support/help" },
      { label: "Knowledge Base", href: "/support/knowledge-base" },
      { label: "FAQ", href: "/support/faq" },
      { label: "Support Analytics", href: "/support/analytics" },
      { label: "Support Tickets", href: "/support/tickets" },
      { label: "Call Requests", href: "/support/call-requests" },
      { label: "Book a Demo", href: "/support/demo-request" },
    ],
  },
  {
    icon: IoStatsChartOutline,
    label: "Reports",
    href: "/reports",
    section: "secondary",
  },
  {
    icon: IoCodeSlashOutline,
    label: "Developers",
    href: "/developer",
    section: "secondary",
  },
];
