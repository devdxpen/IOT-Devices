export const analyticsAppConfig = {
  dashboardName: "IoT Admin Analytics",
  sectionLinks: [
    { href: "/dashboard", label: "Overview" },
    { href: "/device-analytics", label: "Device Analytics" },
    { href: "/user-analytics", label: "User Analytics" },
    { href: "/company-analytics", label: "Company Analytics" },
  ],
  dateRangeOptions: [
    { value: "today", label: "Today" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
    { value: "custom", label: "Custom" },
  ],
  chartPalette: [
    "#0284c7",
    "#0ea5e9",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
  ],
} as const;
