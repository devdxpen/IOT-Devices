import {
  IoBookOutline,
  IoCodeSlashOutline,
  IoGridOutline,
  IoHeadsetOutline,
  IoHelpCircleOutline,
  IoHomeOutline,
  IoLayersOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
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
    href: "/home",
    section: "main",
    tabs: [
      { label: "Home", href: "/home" },
      { label: "Devices Access Request", href: "/home/access-requests" },
      { label: "Device Data Log", href: "/home/data-logs" },
      { label: "User Activity Log", href: "/home/activity-logs" },
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
      { label: "Devices Groups", href: "/settings/device-groups" },
      { label: "Device Categories", href: "/settings/device-categories" },
      { label: "Cluster Management", href: "/settings/clusters" },
      { label: "Notification", href: "/settings/notifications" },
      { label: "Reports Layouts", href: "/settings/report-layouts" },
      { label: "Roles", href: "/settings/roles" },
      { label: "Company Users", href: "/settings/company-users" },
    ],
  },
  {
    icon: IoHeadsetOutline,
    label: "Support",
    href: "/support",
    section: "support",
    subItems: [
      { label: "Help", href: "/support/help" },
      { label: "Knowledge Base", href: "/support/kb" },
      { label: "FAQ", href: "/support/faq" },
      { label: "Support Analytics", href: "/support/analytics" },
      { label: "Support Tickets", href: "/support/tickets" },
      { label: "Company Support Queue", href: "/support/queue" },
      { label: "Call Requests", href: "/support/calls" },
      { label: "Book a Demo", href: "/support/demo" },
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
